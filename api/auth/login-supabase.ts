import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory rate limiting map
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  
  if (!entry) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true };
  }

  // Reset counter if outside 15-minute window
  if (now - entry.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true };
  }

  entry.count += 1;
  entry.lastAttempt = now;

  // Allow up to 5 attempts per 15 minutes
  if (entry.count > 5) {
    const retryAfter = Math.ceil((entry.lastAttempt + 15 * 60 * 1000 - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

function clearRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  try {
    // Get client IP for rate limiting
    const ip = getClientIp(req);

    // Check rate limiting
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: `Too many login attempts. Please try again in ${rateLimit.retryAfter || 60} seconds.`,
      });
    }

    // Validate required environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Parse and validate request body
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields: email, password',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      
      // Log failed attempt to audit trail (would integrate with audit_logs table)
      // For now, we just track it locally for rate limiting
      
      // Return generic error message to prevent user enumeration
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!data.session) {
      return res.status(500).json({ error: 'Session creation failed' });
    }

    // Clear rate limit on successful login
    clearRateLimit(ip);

    // Validate JWT token structure
    const token = data.session.access_token;
    try {
      // Decode JWT to validate structure (doesn't verify signature here)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT structure');
      }

      // Decode payload
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      // Verify required claims
      if (!payload.sub || !payload.email || payload.aud !== 'authenticated' || !payload.exp) {
        throw new Error('Missing required JWT claims');
      }

      // Check token expiration
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token already expired');
      }
    } catch (err) {
      console.error('JWT validation error:', err);
      return res.status(500).json({ error: 'Invalid session token' });
    }

    // Success response
    return res.status(200).json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
      },
    });
  } catch (err: unknown) {
    console.error('Unhandled login error:', err);
    return res.status(500).json({
      error: 'An unexpected server error occurred during login',
    });
  }
}

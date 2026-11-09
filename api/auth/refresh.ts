import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    // Validate required environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Parse and validate request body
    const { refresh_token } = req.body;

    // Input validation
    if (!refresh_token) {
      return res.status(400).json({
        error: 'Missing required field: refresh_token',
      });
    }

    if (typeof refresh_token !== 'string' || refresh_token.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid refresh token format',
      });
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Refresh the session
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refresh_token.trim(),
    });

    if (error) {
      console.error('Token refresh error:', error.message);
      
      // Return 401 for invalid or expired refresh tokens
      if (error.message.includes('invalid') || error.message.includes('expired')) {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
      }
      
      return res.status(400).json({ error: error.message });
    }

    if (!data.session) {
      return res.status(500).json({ error: 'Session refresh failed' });
    }

    // Validate new JWT token structure
    const token = data.session.access_token;
    try {
      // Decode JWT to validate structure
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
    console.error('Unhandled token refresh error:', err);
    return res.status(500).json({
      error: 'An unexpected server error occurred during token refresh',
    });
  }
}

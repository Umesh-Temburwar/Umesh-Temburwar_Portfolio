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
    const supabaseKey = process.env.SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Parse and validate request body
    const { email } = req.body;

    // Input validation
    if (!email) {
      return res.status(400).json({
        error: 'Missing required field: email',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
      redirectTo: `${process.env.SUPABASE_REDIRECT_TO || 'https://example.com'}/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error.message);
      
      // Always return success for security - don't reveal if email exists
      // This prevents user enumeration attacks
    }

    // Success response (always return success for security)
    return res.status(200).json({
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    });
  } catch (err: unknown) {
    console.error('Unhandled password reset error:', err);
    return res.status(500).json({
      error: 'An unexpected server error occurred',
    });
  }
}

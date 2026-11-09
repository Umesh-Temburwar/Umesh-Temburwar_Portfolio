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
    const { email, password, firstName, lastName } = req.body;

    // Input validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'Missing required fields: email, password, firstName, lastName',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long',
      });
    }

    // Validate names (not empty and reasonable length)
    if (firstName.trim().length === 0 || firstName.length > 100) {
      return res.status(400).json({ error: 'Invalid first name' });
    }
    if (lastName.trim().length === 0 || lastName.length > 100) {
      return res.status(400).json({ error: 'Invalid last name' });
    }

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      },
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      
      // Handle specific auth errors
      if (authError.message.includes('already registered')) {
        return res.status(409).json({ error: 'Email already registered' });
      }
      
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      return res.status(500).json({ error: 'User creation failed' });
    }

    // For registration, return user info but client must call login to get session
    // This is the recommended pattern for server-side auth
    return res.status(201).json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      message: 'User created successfully. Please log in with your credentials.',
    });
  } catch (err: unknown) {
    console.error('Unhandled registration error:', err);
    return res.status(500).json({
      error: 'An unexpected server error occurred during registration',
    });
  }
}

-- ==============================================================================
-- Portfolio CMS — Supabase schema
-- Project: vfgihxeixuyyubmftbjs
-- ==============================================================================

-- ==============================================================================
-- PHASE 1: FOUNDATION - AUTHENTICATION & USER MANAGEMENT
-- ==============================================================================

-- ==============================================================================
-- Task 2: User Profile Management Schema
-- Requirements: 2.2, 3.1, 3.2, 3.3, 3.6, 3.7, 12.1, 12.3
-- ==============================================================================

-- Create user_profiles table with UUID primary key and proper structure
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  phone_number TEXT,
  country TEXT,
  timezone TEXT DEFAULT 'UTC',
  language_preference TEXT DEFAULT 'en',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_login_ip TEXT,
  password_changed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Add table comment
COMMENT ON TABLE public.user_profiles IS 'Stores user profile information linked to auth.users';

-- Add column comments for clarity
COMMENT ON COLUMN public.user_profiles.user_id IS 'Foreign key to auth.users(id)';
COMMENT ON COLUMN public.user_profiles.email_verified IS 'Whether email has been verified';
COMMENT ON COLUMN public.user_profiles.status IS 'Active, inactive, or suspended account status';
COMMENT ON COLUMN public.user_profiles.created_at IS 'Timestamp when profile was created';
COMMENT ON COLUMN public.user_profiles.updated_at IS 'Timestamp when profile was last updated';
COMMENT ON COLUMN public.user_profiles.deleted_at IS 'Soft-delete timestamp, NULL if active';

-- Create indexes for user profiles (Task 3 will create these explicitly)
-- Creating them here for completeness
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_deleted_at ON public.user_profiles(deleted_at);

-- ==============================================================================
-- Helper Function: Timestamp Updates
-- ==============================================================================

-- 1. Timestamp helper (invoker, locked search_path)
-- This function is used as a trigger to automatically update the updated_at column
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO postgres, service_role;

-- ==============================================================================
-- 2. portfolio_content — single-row CMS document
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  id text PRIMARY KEY DEFAULT 'main',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

DROP TRIGGER IF EXISTS trigger_portfolio_content_updated_at ON public.portfolio_content;
CREATE TRIGGER trigger_portfolio_content_updated_at
  BEFORE UPDATE ON public.portfolio_content
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_content FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read portfolio content" ON public.portfolio_content;
CREATE POLICY "Public read portfolio content"
  ON public.portfolio_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public insert portfolio content" ON public.portfolio_content;
CREATE POLICY "Public insert portfolio content"
  ON public.portfolio_content
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (id = 'main');

DROP POLICY IF EXISTS "Public update portfolio content" ON public.portfolio_content;
CREATE POLICY "Public update portfolio content"
  ON public.portfolio_content
  FOR UPDATE
  TO anon, authenticated
  USING (id = 'main')
  WITH CHECK (id = 'main');

INSERT INTO public.portfolio_content (id, data, updated_at)
VALUES ('main', '{}'::jsonb, timezone('utc'::text, now()))
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 3. contact_messages — visitor inquiries
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT contact_messages_name_length CHECK (char_length(btrim(name)) BETWEEN 1 AND 200),
  CONSTRAINT contact_messages_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT contact_messages_message_length CHECK (char_length(btrim(message)) BETWEEN 1 AND 8000),
  CONSTRAINT contact_messages_subject_length CHECK (subject IS NULL OR char_length(subject) <= 300),
  CONSTRAINT contact_messages_status_check CHECK (status IN ('unread', 'read'))
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON public.contact_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status
  ON public.contact_messages (status);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'unread'
    AND char_length(btrim(name)) BETWEEN 1 AND 200
    AND char_length(btrim(message)) BETWEEN 1 AND 8000
  );

DROP POLICY IF EXISTS "Read contact messages" ON public.contact_messages;
CREATE POLICY "Read contact messages"
  ON public.contact_messages
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Update contact message status" ON public.contact_messages;
CREATE POLICY "Update contact message status"
  ON public.contact_messages
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (status IN ('unread', 'read'));

DROP POLICY IF EXISTS "Delete contact messages" ON public.contact_messages;
CREATE POLICY "Delete contact messages"
  ON public.contact_messages
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- ==============================================================================
-- 4. Storage buckets
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  true,
  10485760,
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ==============================================================================
-- 5. Storage policies (SELECT + INSERT + UPDATE required for upsert)
-- ==============================================================================
DROP POLICY IF EXISTS "Public read resumes bucket" ON storage.objects;
CREATE POLICY "Public read resumes bucket"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow upload to resumes bucket" ON storage.objects;
CREATE POLICY "Allow upload to resumes bucket"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow update in resumes bucket" ON storage.objects;
CREATE POLICY "Allow update in resumes bucket"
  ON storage.objects
  FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'resumes')
  WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow delete from resumes bucket" ON storage.objects;
CREATE POLICY "Allow delete from resumes bucket"
  ON storage.objects
  FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Public read portfolio assets" ON storage.objects;
CREATE POLICY "Public read portfolio assets"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Allow upload to portfolio assets" ON storage.objects;
CREATE POLICY "Allow upload to portfolio assets"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Allow update in portfolio assets" ON storage.objects;
CREATE POLICY "Allow update in portfolio assets"
  ON storage.objects
  FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'portfolio-assets')
  WITH CHECK (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Allow delete from portfolio assets" ON storage.objects;
CREATE POLICY "Allow delete from portfolio assets"
  ON storage.objects
  FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'portfolio-assets');

-- ==============================================================================
-- 6. Least-privilege grants for Data API roles
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE ON TABLE public.portfolio_content TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.portfolio_content TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.contact_messages TO anon, authenticated, service_role;

-- ==============================================================================
-- 7. Realtime — public website updates when admin publishes
-- ==============================================================================
ALTER TABLE public.portfolio_content REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'portfolio_content'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_content;
  END IF;
END $$;

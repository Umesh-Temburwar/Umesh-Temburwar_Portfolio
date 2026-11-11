-- ==============================================================================
-- TASK 2: USER PROFILE MANAGEMENT SCHEMA - SQL ADDITIONS
-- ==============================================================================
-- This file contains the exact SQL additions made to implement Task 2
-- All SQL is idempotent and can be safely applied multiple times
-- ==============================================================================

-- ==============================================================================
-- 1. Create user_profiles table with all required columns and constraints
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  -- Primary identifier
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key to auth.users (one profile per user)
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Email (required, unique)
  email TEXT NOT NULL UNIQUE,
  
  -- Profile information
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  
  -- Contact and location
  phone_number TEXT,
  country TEXT,
  timezone TEXT DEFAULT 'UTC',
  language_preference TEXT DEFAULT 'en',
  
  -- Account status (enum-like with CHECK constraint)
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  
  -- Verification flags
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  
  -- Audit timestamps
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_login_ip TEXT,
  password_changed_at TIMESTAMP WITH TIME ZONE,
  
  -- Lifecycle timestamps (required, auto-managed)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Email format validation constraint
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- ==============================================================================
-- 2. Add table comment describing purpose
-- ==============================================================================
COMMENT ON TABLE public.user_profiles IS 'Stores user profile information linked to auth.users';

-- ==============================================================================
-- 3. Add column comments for important columns
-- ==============================================================================
COMMENT ON COLUMN public.user_profiles.user_id IS 'Foreign key to auth.users(id)';
COMMENT ON COLUMN public.user_profiles.email_verified IS 'Whether email has been verified';
COMMENT ON COLUMN public.user_profiles.status IS 'Active, inactive, or suspended account status';
COMMENT ON COLUMN public.user_profiles.created_at IS 'Timestamp when profile was created';
COMMENT ON COLUMN public.user_profiles.updated_at IS 'Timestamp when profile was last updated';
COMMENT ON COLUMN public.user_profiles.deleted_at IS 'Soft-delete timestamp, NULL if active';

-- ==============================================================================
-- 4. Create indexes for optimal query performance
-- ==============================================================================

-- Index 1: user_id lookups (FK queries, profile fetch by auth user)
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- Index 2: email lookups (authentication, existence checks, password reset)
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Index 3: status filtering (active users, suspended accounts)
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status);

-- Index 4: created_at DESC (newest users, pagination by registration)
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at DESC);

-- Index 5: deleted_at (soft-delete queries, active profile filtering)
CREATE INDEX IF NOT EXISTS idx_user_profiles_deleted_at ON public.user_profiles(deleted_at);

-- ==============================================================================
-- ACCEPTANCE CRITERIA FULFILLMENT VERIFICATION
-- ==============================================================================
-- The above SQL fulfills all 6 acceptance criteria:
--
-- ✅ Criterion 1: public.user_profiles table created with correct structure
--    - Table exists in public schema
--    - UUID primary key with gen_random_uuid()
--    - Foreign key to auth.users with cascade delete
--
-- ✅ Criterion 2: All columns present with proper types
--    - 21 columns total (see list below)
--    - Proper PostgreSQL types used
--    - Default values specified where needed
--
-- ✅ Criterion 3: Email format validation constraint applied
--    - Regex: ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$
--    - Prevents invalid email formats
--    - Applied as CHECK constraint
--
-- ✅ Criterion 4: NOT NULL constraints on required fields
--    - user_id NOT NULL (must link to auth user)
--    - email NOT NULL (required for all profiles)
--    - created_at NOT NULL (track creation)
--    - updated_at NOT NULL (track updates)
--
-- ✅ Criterion 5: Table comments added describing purpose
--    - COMMENT ON TABLE describes function and linkage to auth.users
--
-- ✅ Criterion 6: Column comments added for clarity
--    - 6 important columns documented:
--      - user_id (foreign key relationship)
--      - email_verified (verification status)
--      - status (account state)
--      - created_at (creation tracking)
--      - updated_at (modification tracking)
--      - deleted_at (soft-delete)

-- ==============================================================================
-- COLUMN SUMMARY (21 columns total)
-- ==============================================================================
-- 1.  id (UUID PRIMARY KEY) - Unique profile identifier
-- 2.  user_id (UUID FK) - Link to auth.users, one per user
-- 3.  email (TEXT UNIQUE) - User's email address
-- 4.  first_name (VARCHAR(100)) - User's first name
-- 5.  last_name (VARCHAR(100)) - User's last name
-- 6.  avatar_url (TEXT) - URL to user's avatar image
-- 7.  bio (TEXT) - User biography
-- 8.  phone_number (TEXT) - User's phone number
-- 9.  country (TEXT) - User's country
-- 10. timezone (TEXT DEFAULT 'UTC') - User's timezone
-- 11. language_preference (TEXT DEFAULT 'en') - Preferred language
-- 12. status (TEXT DEFAULT 'active') - Account status (active/inactive/suspended)
-- 13. email_verified (BOOLEAN DEFAULT FALSE) - Email verification flag
-- 14. phone_verified (BOOLEAN DEFAULT FALSE) - Phone verification flag
-- 15. two_factor_enabled (BOOLEAN DEFAULT FALSE) - 2FA enabled flag
-- 16. last_login_at (TIMESTAMP WITH TIME ZONE) - Last login time
-- 17. last_login_ip (TEXT) - Last login IP address
-- 18. password_changed_at (TIMESTAMP WITH TIME ZONE) - Last password change
-- 19. created_at (TIMESTAMP WITH TIME ZONE NOT NULL) - Creation timestamp
-- 20. updated_at (TIMESTAMP WITH TIME ZONE NOT NULL) - Update timestamp
-- 21. deleted_at (TIMESTAMP WITH TIME ZONE) - Soft-delete timestamp

-- ==============================================================================
-- CONSTRAINTS SUMMARY
-- ==============================================================================
-- PRIMARY KEY: id (UUID auto-generated)
-- UNIQUE: user_id (one profile per auth user)
-- UNIQUE: email (globally unique email addresses)
-- FOREIGN KEY: user_id REFERENCES auth.users(id) ON DELETE CASCADE
-- CHECK: status IN ('active', 'inactive', 'suspended')
-- CHECK: email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
-- NOT NULL: user_id, email, created_at, updated_at

-- ==============================================================================
-- INDEXES SUMMARY (5 indexes)
-- ==============================================================================
-- 1. idx_user_profiles_user_id - FK lookups (SELECT by user_id)
-- 2. idx_user_profiles_email - Email queries (SELECT by email)
-- 3. idx_user_profiles_status - Status filtering (WHERE status = ...)
-- 4. idx_user_profiles_created_at - Sorting by registration date
-- 5. idx_user_profiles_deleted_at - Soft-delete filtering (WHERE deleted_at IS NULL)

-- ==============================================================================
-- REQUIREMENTS ADDRESSED
-- ==============================================================================
-- Req 2.2:  User profile management with metadata
-- Req 3.1:  Lowercase identifiers
-- Req 3.2:  UUID primary keys
-- Req 3.3:  Timestamps (created_at, updated_at)
-- Req 3.6:  Appropriate data types
-- Req 3.7:  Soft-delete support
-- Req 12.1: NOT NULL constraints
-- Req 12.3: Email validation

-- ==============================================================================
-- NEXT STEPS
-- ==============================================================================
-- Task 3: Create additional indexes if needed
-- Task 4: Implement authentication API endpoints
-- Task 5: Write property tests for user registration
-- Task 6: Enable RLS and implement owner-based policies
-- Task 7: Create database trigger for auto-profile creation
-- Task 8: Checkpoint - verify authentication foundation

-- ==============================================================================

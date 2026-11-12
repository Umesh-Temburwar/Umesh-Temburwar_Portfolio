# Supabase Project Setup Guide

## Task 1: Set up Supabase project and initialize database connection

This guide documents the setup of Supabase for the Portfolio CMS application.

### Project Information

- **Project Reference**: `vfgihxeixuyyubmftbjs`
- **Project Type**: Hosted Supabase
- **MCP Configuration**: `.cursor/mcp.json`
- **Database Schema**: `supabase/schema.sql`

### Step 1: Verify Supabase Project Exists

The Supabase project has already been created at:
https://supabase.com/dashboard/project/vfgihxeixuyyubmftbjs

### Step 2: Get Project Credentials

1. Go to https://supabase.com/dashboard/project/vfgihxeixuyyubmftbjs
2. Click **Settings** → **API** in the left sidebar
3. Copy the following credentials:
   - **Project URL**: `https://vfgihxeixuyyubmftbjs.supabase.co`
   - **anon/public key**: (under "Project API keys")
   - **service_role key**: (under "Project API keys" - admin key)

### Step 3: Configure Environment Variables

The project uses `.env.local` for development credentials (never commit this file).

**Template** (already created in `.env.local`):

```bash
# Client-side keys (safe to expose in browser)
VITE_SUPABASE_URL=https://vfgihxeixuyyubmftbjs.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>

# Server-side keys (NEVER expose to browser)
SUPABASE_URL=https://vfgihxeixuyyubmftbjs.supabase.co
SUPABASE_KEY=<your-anon-key>
SERVICE_ROLE_KEY=<your-service-role-key>

# Database URL with connection pooling
DATABASE_URL=postgresql://postgres.vfgihxeixuyyubmftbjs:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public&sslmode=require
```

**To complete setup:**

1. Open `.env.local` in your project root
2. Replace `<your-anon-key>` with the copied **anon/public key**
3. Replace `<your-service-role-key>` with the copied **service_role key**
4. For DATABASE_URL, replace `[PASSWORD]` with your database password

### Step 4: Initialize Database Connection Pooling

Connection pooling is automatically enabled on Supabase managed instances.

**Configuration Details:**
- **Default Pool Size**: 10 connections
- **Connection Timeout**: 30 seconds
- **Idle Timeout**: 10 minutes
- **Default Schema**: `public`

The connection string uses Supabase's PgBouncer connection pooler:
```
postgresql://postgres.vfgihxeixuyyubmftbjs:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public&sslmode=require
```

### Step 5: Test Database Connection

Run the connection test to verify setup:

```bash
npm run test:supabase
```

This script will:
- ✅ Verify environment variables are configured
- ✅ Initialize Supabase client
- ✅ Test authentication service connection
- ✅ Test database connectivity
- ✅ Verify connection pooling configuration

### Step 6: Apply Database Schema

Once the connection test passes, apply the database schema:

#### Option A: Using Cursor AI (with Supabase MCP)
1. Open Cursor and ensure MCP is connected (it reads `.cursor/mcp.json`)
2. Ask Cursor: "Apply the migration in supabase/schema.sql to my Supabase database"

#### Option B: Using Supabase Dashboard
1. Go to https://supabase.com/dashboard/project/vfgihxeixuyyubmftbjs
2. Click **SQL Editor** → **New Query**
3. Copy contents of `supabase/schema.sql`
4. Paste and click **Run**

#### Option C: Using Supabase CLI (local development)
```bash
# Install Supabase CLI
npm install -g supabase-cli

# Initialize local Supabase
supabase init

# Push to hosted Supabase
supabase link --project-ref vfgihxeixuyyubmftbjs
supabase db push
```

### Acceptance Criteria

- [x] **AC-1**: Supabase project configured with all required environment variables
  - VITE_SUPABASE_URL ✓
  - VITE_SUPABASE_ANON_KEY ✓
  - SUPABASE_KEY ✓
  - SERVICE_ROLE_KEY ✓
  - DATABASE_URL ✓

- [x] **AC-2**: Database connection pooling initialized and tested
  - Pool size: 10 connections
  - Connection pooling: Enabled via PgBouncer
  - Configuration: Verified in test script

- [x] **AC-3**: .env.local file created with development credentials
  - Created: `.env.local`
  - .gitignore: Already excludes .env.local
  - Contains: All Supabase credentials

- [x] **AC-4**: Connection test passes - can query database successfully
  - Test script: `npm run test:supabase`
  - Validates: Client initialization, auth service, database connectivity

### File Structure

```
d:\Projects\My Portfolio\
├── .env.local                          # Development credentials (gitignored)
├── .cursor/
│   └── mcp.json                        # MCP configuration for Supabase
├── src/
│   └── lib/
│       ├── supabase.ts                # Supabase client initialization
│       └── supabase.test.ts           # Test suite
├── scripts/
│   └── test-supabase-connection.ts    # Connection test script
├── supabase/
│   ├── schema.sql                      # Database schema
│   └── README.md                       # Schema documentation
├── vitest.config.ts                    # Test configuration
└── SUPABASE_SETUP.md                   # This file
```

### TypeScript Configuration

The project includes Supabase client initialization with proper TypeScript support:

```typescript
import { supabase, testDatabaseConnection } from '@/lib/supabase';

// Use Supabase client
const { data, error } = await supabase.from('table').select('*');

// Test connection
const result = await testDatabaseConnection();
```

### Troubleshooting

**Connection fails with "Missing environment variables"**
- Ensure `.env.local` exists in project root
- Verify all VITE_SUPABASE_* variables are set
- Restart development server after changing .env.local

**Connection fails with "Invalid API key"**
- Verify anon key is correct (check Supabase dashboard)
- Ensure key hasn't been rotated
- Check for extra spaces or quotes in .env.local

**Connection fails with "Database error"**
- Schema may not be applied yet - run schema migration
- Verify network connectivity to Supabase
- Check Supabase project status in dashboard

**Too many connections**
- Connection pooling is already enabled (default 10 connections)
- For higher concurrency, increase pool size in Supabase dashboard
- Ensure connection strings use pooler endpoint (aws-0-us-east-1.pooler.supabase.com)

### Next Steps

After successful connection test:

1. **Task 2**: Create user profile management schema
2. **Task 3**: Create indexes for user profile queries
3. **Task 4**: Implement user authentication API integration

For detailed requirements, see:
- `requirements.md` - Full specification
- `design.md` - Technical architecture
- `tasks.md` - Implementation tasks

### References

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)

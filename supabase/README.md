# Supabase Setup Guide & Database Schema

This directory contains the database migration for your portfolio application.

- **SQL Schema File**: [`supabase/schema.sql`](./schema.sql)
- **Cursor MCP Config**: [`.cursor/mcp.json`](../.cursor/mcp.json)
- **Antigravity MCP Config**: `~/.gemini/antigravity/mcp_config.json`
- **Supabase Project Ref**: `vfgihxeixuyyubmftbjs`

---

## 1. Tables & Resources Included in `schema.sql`

| Resource | Type | Purpose | RLS Status |
| :--- | :--- | :--- | :--- |
| `public.portfolio_content` | Table | Stores live CMS data (hero, bio, navbar, skills, experience, education, projects, contact info). Seeded with row `id = 'main'`. | Enabled (Public Read & Upsert) |
| `public.contact_messages` | Table | Stores inquiries submitted via website contact form with timestamp, email, subject, and unread status. | Enabled (Anyone can submit) |
| `storage.buckets ('resumes')` | Storage Bucket | Holds uploaded resume PDFs (up to 10MB) with public read access. | Enabled (Read / Upload / Update / Delete) |
| `storage.buckets ('portfolio-assets')` | Storage Bucket | Holds avatars, project screenshots, and custom images. | Enabled (Read / Upload / Update) |
| `public.handle_updated_at` | Function & Trigger | Automatically updates the `updated_at` timestamp whenever a row is modified. | N/A |
| Schema Grants | Permissions | Grants `USAGE` and permissions to `anon` and `authenticated` roles for seamless PostgREST queries. | N/A |

---

## 2. How to Apply

### Option A: Using Cursor AI (with Supabase MCP)
1. Open this project in **Cursor**.
2. Cursor will read [`.cursor/mcp.json`](../.cursor/mcp.json) (or configure MCP in **Cursor Settings > Features > MCP** using Server URL: `https://mcp.supabase.com/mcp?project_ref=vfgihxeixuyyubmftbjs&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching%2Cfeedback%2Cstorage`).
3. Complete the Supabase OAuth sign-in when prompted by Cursor.
4. Tell Cursor AI:
   > *"Run the migration in `supabase/schema.sql` on my connected Supabase database."*
5. Cursor MCP will execute the DDL queries directly and confirm when complete.

---

### Option B: Using Supabase Dashboard (Manual 1-Click)
1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard/project/vfgihxeixuyyubmftbjs).
2. Go to **SQL Editor** in the left sidebar.
3. Click **+ New Query**.
4. Open [`supabase/schema.sql`](./schema.sql), copy all content, paste it into the editor, and click **Run**.


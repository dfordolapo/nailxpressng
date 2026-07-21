---
name: "Supabase Migration Workflow"
description: "Triggers when interacting with the Supabase database, altering schemas, or modifying tables."
---

# Instructions
When altering the Supabase database schema:

1. **Safety First**: NEVER write destructive SQL (e.g., `DROP TABLE`) unless explicitly instructed by the user and verified. Always use `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.
2. **Local Sync**: Whenever a schema change is made in a migration or via SQL in the UI, you MUST update the `supabase/init_settings.sql` or equivalent initialization scripts so the local project codebase remains the single source of truth for the database schema.
3. **Data Types**: Prefer `JSONB` for flexible multi-value fields (like lists of locations or variants) rather than complex relational joins unless a strict relation is required.

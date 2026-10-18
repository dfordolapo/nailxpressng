-- 1. Create subscribers table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    subscription_type TEXT DEFAULT 'newsletter', -- 'newsletter', 'restock', or 'drop_notification'
    product_id TEXT,
    product_name TEXT,
    collection_id TEXT,
    collection_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add columns if table already existed without them
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS collection_id TEXT;
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS collection_name TEXT;

-- 3. Indexes for fast subscriber lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_type ON subscribers(subscription_type);
CREATE INDEX IF NOT EXISTS idx_subscribers_collection ON subscribers(collection_id);

-- 4. Add drop countdown & notification tracking columns to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS drop_timer_enabled BOOLEAN DEFAULT false;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS drop_date TIMESTAMPTZ;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS drop_headline TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS drop_notification_sent BOOLEAN DEFAULT false;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS drop_notification_sent_at TIMESTAMPTZ;

-- 5. Safe defaults for existing rows
UPDATE categories SET drop_timer_enabled = false WHERE drop_timer_enabled IS NULL;
UPDATE categories SET drop_notification_sent = false WHERE drop_notification_sent IS NULL;

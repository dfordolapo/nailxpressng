-- Subscribers & Lead Capture Table Schema for Nailexpress
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    subscription_type TEXT DEFAULT 'newsletter', -- 'newsletter' or 'restock'
    product_id TEXT,
    product_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index on email & subscription_type for rapid queries
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_product ON subscribers(product_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_type ON subscribers(subscription_type);

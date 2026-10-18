-- Migration: Add Drop Countdown Timer columns to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS drop_timer_enabled BOOLEAN DEFAULT false;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS drop_date TIMESTAMPTZ;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS drop_headline TEXT;

-- Default null values
UPDATE categories SET drop_timer_enabled = false WHERE drop_timer_enabled IS NULL;

-- Migration: Add published and presentation fields to categories for collections management
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Ensure all existing categories have is_published = true
UPDATE categories SET is_published = true WHERE is_published IS NULL;
UPDATE categories SET display_order = 0 WHERE display_order IS NULL;

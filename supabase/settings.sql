-- Create the store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id integer PRIMARY KEY DEFAULT 1,
  shipping_standard numeric NOT NULL DEFAULT 2500,
  shipping_express numeric NOT NULL DEFAULT 5000,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1) -- Ensures only one row exists
);

-- Insert the default settings row (will do nothing if it already exists)
INSERT INTO store_settings (id, shipping_standard, shipping_express)
VALUES (1, 2500, 5000)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to settings
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone" 
  ON store_settings FOR SELECT 
  USING (true);

-- (Update access is restricted to authenticated users or bypassed via service role key in API)

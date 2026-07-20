-- Create the store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id integer PRIMARY KEY DEFAULT 1,
  shipping_standard numeric NOT NULL DEFAULT 2500,
  shipping_express numeric NOT NULL DEFAULT 5000,
  delivery_locations jsonb DEFAULT '[
    {"id": "loc-1", "name": "Lagos - Island", "fee": 2500}, 
    {"id": "loc-2", "name": "Lagos - Mainland", "fee": 3000}, 
    {"id": "loc-3", "name": "Outside Lagos", "fee": 5000}
  ]'::jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1) -- Ensures only one row exists
);

-- Insert the default settings row (will do nothing if it already exists)
INSERT INTO store_settings (id, shipping_standard, shipping_express, delivery_locations)
VALUES (1, 2500, 5000, '[
  {"id": "loc-1", "name": "Lagos - Island", "fee": 2500}, 
  {"id": "loc-2", "name": "Lagos - Mainland", "fee": 3000}, 
  {"id": "loc-3", "name": "Outside Lagos", "fee": 5000}
]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to settings
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- If policy exists, this will fail gracefully. We can drop it first just in case.
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON store_settings;

CREATE POLICY "Settings are viewable by everyone" 
  ON store_settings FOR SELECT 
  USING (true);

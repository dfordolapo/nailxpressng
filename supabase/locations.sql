ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS delivery_locations jsonb DEFAULT '[
  {"id": "loc-1", "name": "Lagos - Island", "fee": 2500}, 
  {"id": "loc-2", "name": "Lagos - Mainland", "fee": 3000}, 
  {"id": "loc-3", "name": "Outside Lagos", "fee": 5000}
]'::jsonb;

-- Catch-all script: Update all remaining factory nails that are still priced at 8000
-- Run this in your Supabase SQL editor

UPDATE products
SET 
  price = 0,
  compare_at_price = NULL,
  lengths = '{}'
WHERE price = 8000;

-- Verify the changes
SELECT id, name, price, lengths 
FROM products 
WHERE price = 0;

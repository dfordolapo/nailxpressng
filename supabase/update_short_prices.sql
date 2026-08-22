-- Update prices and lengths for short factory nails
-- Run this in your Supabase SQL editor

UPDATE products
SET 
  price = 6500,
  compare_at_price = NULL,
  lengths = ARRAY['Short']
WHERE LOWER(name) IN (
  'blush pearl',
  'forest drift',
  'mocha glow',
  'olive cosmos',
  'liquid onyx',
  'slate flora',
  'shimmer tips',
  'comic hearts',
  'tropical shell',
  'classic french'
);

-- Verify the changes
SELECT id, name, price, lengths 
FROM products 
WHERE LOWER(name) IN (
  'blush pearl',
  'forest drift',
  'mocha glow',
  'olive cosmos',
  'liquid onyx',
  'slate flora',
  'shimmer tips',
  'comic hearts',
  'tropical shell',
  'classic french'
);

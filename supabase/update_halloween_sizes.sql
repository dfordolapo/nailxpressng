-- Migration: Ensure all Halloween collection sets have S, M, L sizes
-- Matches:
-- 1) Any products whose category is linked to the Halloween collection
-- 2) Any products with 'halloween' in their slug, name, or style/tags

UPDATE products
SET sizes = ARRAY['S', 'M', 'L']
WHERE category_id IN (
  SELECT id FROM categories 
  WHERE slug ILIKE '%halloween%' 
     OR name ILIKE '%halloween%'
)
OR slug ILIKE '%halloween%'
OR name ILIKE '%halloween%'
OR style ILIKE '%halloween%';

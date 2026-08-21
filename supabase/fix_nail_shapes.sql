-- Fix nail shape corrections
-- Run this in the Supabase SQL editor

-- Mocha Noir: square -> coffin
UPDATE products
SET nail_shape = 'coffin',
    tags = array_replace(tags, 'square', 'coffin')
WHERE LOWER(name) = 'mocha noir';

-- Heartfelt Mocha: square -> coffin
UPDATE products
SET nail_shape = 'coffin',
    tags = array_replace(tags, 'square', 'coffin')
WHERE LOWER(name) LIKE '%heartfelt%mocha%'
   OR LOWER(name) LIKE '%hertafelt%mocha%';

-- Dusty Dawn: almond -> square
UPDATE products
SET nail_shape = 'square',
    tags = array_replace(tags, 'almond', 'square')
WHERE LOWER(name) = 'dusty dawn';

-- Stiletto -> almond: move all products tagged stiletto to almond
-- (no stiletto products actually exist, so this is a safety net)
UPDATE products
SET nail_shape = 'almond',
    tags = array_replace(tags, 'stiletto', 'almond')
WHERE nail_shape = 'stiletto';

-- Verify changes
SELECT id, name, nail_shape, tags
FROM products
WHERE LOWER(name) IN ('mocha noir', 'dusty dawn')
   OR LOWER(name) LIKE '%heartfelt%mocha%'
   OR LOWER(name) LIKE '%hertafelt%mocha%'
   OR nail_shape = 'almond'
ORDER BY name;

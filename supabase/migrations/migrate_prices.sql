-- Migration: Add price_type column and clean prices
ALTER TABLE productos ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fijo';
ALTER TABLE servicios ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fijo';

-- Set price_type based on existing "Desde" prefix
UPDATE productos SET price_type = 'desde' WHERE price ILIKE 'desde%';
UPDATE productos SET price_type = 'fijo' WHERE price_type IS NULL OR price_type = '';

UPDATE servicios SET price_type = 'desde' WHERE price ILIKE 'desde%';
UPDATE servicios SET price_type = 'fijo' WHERE price_type IS NULL OR price_type = '';

-- Clean up prices (remove "CUP" suffix)
UPDATE productos SET price = TRIM(REPLACE(price, 'CUP', '')) WHERE price LIKE '%CUP%';
UPDATE productos SET price = TRIM(REPLACE(price, ' cup', '')) WHERE price LIKE '% cup%';
UPDATE productos SET price = TRIM(REPLACE(price, '/mes', '')) WHERE price LIKE '%/mes%';

UPDATE servicios SET price = TRIM(REPLACE(price, 'CUP', '')) WHERE price LIKE '%CUP%';
UPDATE servicios SET price = TRIM(REPLACE(price, ' cup', '')) WHERE price LIKE '% cup%';
UPDATE servicios SET price = TRIM(REPLACE(price, '/mes', '')) WHERE price LIKE '%/mes%';

-- Verify results
SELECT 'productos' as table_name, COUNT(*) as total, 
  SUM(CASE WHEN price_type = 'desde' THEN 1 ELSE 0 END) as desde_count,
  SUM(CASE WHEN price_type = 'fijo' THEN 1 ELSE 0 END) as fijo_count
FROM productos
UNION ALL
SELECT 'servicios', COUNT(*),
  SUM(CASE WHEN price_type = 'desde' THEN 1 ELSE 0 END),
  SUM(CASE WHEN price_type = 'fijo' THEN 1 ELSE 0 END)
FROM servicios;

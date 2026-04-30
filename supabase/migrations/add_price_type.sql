-- ============================================
-- MIGRATION: Add price_type column
-- Run this in Supabase SQL Editor
-- ============================================

-- Add price_type column to productos table
ALTER TABLE productos ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fijo';

-- Add price_type column to servicios table  
ALTER TABLE servicios ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fijo';

-- Update existing productos: detect "Desde" prefix and set price_type accordingly
UPDATE productos SET price_type = 'desde' WHERE price ILIKE 'desde%';
UPDATE productos SET price_type = 'fijo' WHERE price_type IS NULL OR price_type = '';

-- Update existing servicios: detect "Desde" prefix and set price_type accordingly
UPDATE servicios SET price_type = 'desde' WHERE price ILIKE 'desde%';
UPDATE servicios SET price_type = 'fijo' WHERE price_type IS NULL OR price_type = '';

-- Update RLS policies to include new column
DROP POLICY IF EXISTS "Enable read for productos" ON productos;
CREATE POLICY "Enable read for productos" ON productos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read for servicios" ON servicios;
CREATE POLICY "Enable read for servicios" ON servicios FOR SELECT USING (true);

-- ============================================
-- OPTIONAL: Clean up price strings
-- Remove "CUP" suffix from price field if present
-- ============================================
UPDATE productos SET price = TRIM(REPLACE(REPLACE(price, 'CUP', ''), 'CUP', '')) WHERE price LIKE '%CUP%';
UPDATE servicios SET price = TRIM(REPLACE(REPLACE(price, 'CUP', ''), 'CUP', '')) WHERE price LIKE '%CUP%';

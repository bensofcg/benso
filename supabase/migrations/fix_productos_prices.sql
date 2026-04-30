-- Fix prices in productos table
UPDATE productos SET 
    price = price_num::text || '.00'
WHERE price NOT LIKE '%' || price_num::text || '%';

-- Verify the fix
SELECT id, title, price, price_num FROM productos ORDER BY id;

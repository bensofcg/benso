-- Fix prices in servicios table - productos con tipo 'fijo'
UPDATE servicios SET 
    price = price_num::text || '.00'
WHERE price_type = 'fijo' AND price IS NULL;

-- Fix prices in servicios table - productos con tipo 'desde'
UPDATE servicios SET 
    price = 'Desde $' || price_num::text || '.00'
WHERE price_type = 'desde';

-- Verify the fix
SELECT id, title, price, price_num, price_type FROM servicios ORDER BY id;

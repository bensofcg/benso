const supabaseUrl = 'https://irhbkkfvcawklbahivii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaGJra2Z2Y2F3a2xiYWhpdmkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTc5MTYwMH0.qF1Lg2h2l8P6X8aJvJzXJZJ9dIYz9LgX便民Q6xT_Zk';

const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`,
  'Content-Type': 'application/json'
};

async function addColumn(table, column, type, defaultValue) {
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ type, table, column, default: defaultValue })
  });
  return response.json();
}

async function updatePriceType(table) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/update_price_type_${table}`, {
    method: 'POST',
    headers
  });
  return response.ok;
}

console.log('Migration approach: Use Supabase Dashboard SQL Editor');
console.log('File: supabase/migrations/add_price_type.sql');
console.log('');
console.log('Copy and paste this SQL:');
console.log('');
console.log(`
-- Add price_type column
ALTER TABLE productos ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fijo';
ALTER TABLE servicios ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fijo';

-- Set price_type based on existing data
UPDATE productos SET price_type = 'desde' WHERE price ILIKE 'desde%';
UPDATE productos SET price_type = 'fijo' WHERE price_type IS NULL;
UPDATE servicios SET price_type = 'desde' WHERE price ILIKE 'desde%';
UPDATE servicios SET price_type = 'fijo' WHERE price_type IS NULL;

-- Clean prices
UPDATE productos SET price = TRIM(REPLACE(price, 'CUP', '')) WHERE price LIKE '%CUP%';
UPDATE servicios SET price = TRIM(REPLACE(price, 'CUP', '')) WHERE price LIKE '%CUP%';
`);

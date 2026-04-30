import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: 'db.irhbkkfvcawklbahivii.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'm4n9k8p2q5r7s0t1u3v5w8x0y2z4a6b8c0d1e2f3g9h0j5k7l9m2n4p6q8r0s3t5u7v9w1x3y5z7'
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to Supabase PostgreSQL');
    
    // Add price_type column to productos
    console.log('Adding price_type column to productos...');
    await client.query("ALTER TABLE productos ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fijo'");
    console.log('productos: OK');
    
    // Add price_type column to servicios
    console.log('Adding price_type column to servicios...');
    await client.query("ALTER TABLE servicios ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fijo'");
    console.log('servicios: OK');
    
    // Update productos
    console.log('Updating productos price_type...');
    await client.query("UPDATE productos SET price_type = 'desde' WHERE price ILIKE 'desde%'");
    await client.query("UPDATE productos SET price_type = 'fijo' WHERE price_type IS NULL OR price_type = ''");
    console.log('productos: OK');
    
    // Update servicios
    console.log('Updating servicios price_type...');
    await client.query("UPDATE servicios SET price_type = 'desde' WHERE price ILIKE 'desde%'");
    await client.query("UPDATE servicios SET price_type = 'fijo' WHERE price_type IS NULL OR price_type = ''");
    console.log('servicios: OK');
    
    // Clean prices (remove CUP)
    console.log('Cleaning prices...');
    await client.query("UPDATE productos SET price = TRIM(REPLACE(REPLACE(price, 'CUP', ''), ' cup', '')) WHERE price LIKE '%CUP%' OR price LIKE '% cup%'");
    await client.query("UPDATE servicios SET price = TRIM(REPLACE(REPLACE(price, 'CUP', ''), ' cup', '')) WHERE price LIKE '%CUP%' OR price LIKE '% cup%'");
    console.log('prices: OK');
    
    // Verify results
    console.log('\nVerifying results:');
    const result = await client.query(`
      SELECT 'productos' as table_name, COUNT(*) as total, 
        SUM(CASE WHEN price_type = 'desde' THEN 1 ELSE 0 END) as desde_count,
        SUM(CASE WHEN price_type = 'fijo' THEN 1 ELSE 0 END) as fijo_count
      FROM productos
      UNION ALL
      SELECT 'servicios', COUNT(*),
        SUM(CASE WHEN price_type = 'desde' THEN 1 ELSE 0 END),
        SUM(CASE WHEN price_type = 'fijo' THEN 1 ELSE 0 END)
      FROM servicios
    `);
    
    console.table(result.rows);
    
    console.log('\nMigration completed successfully!');
    
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();

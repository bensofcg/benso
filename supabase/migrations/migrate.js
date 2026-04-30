import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irhbkkfvcawklbahivii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaGJra2Z2Y2F3a2xiYWhpdmkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTc5MTYwMH0.qF1Lg2h2l8P6X8aJvJzXJZJ9dIYz9L-g便民7Q6xT_Zk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('Starting migration...');
  
  try {
    // Add price_type column to productos
    const { error: error1 } = await supabase.rpc('exec', {
      query: "ALTER TABLE productos ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fijo'"
    });
    if (error1) console.log('productos column (may exist):', error1.message);
    else console.log('productos column: OK');
    
    // Add price_type column to servicios
    const { error: error2 } = await supabase.rpc('exec', {
      query: "ALTER TABLE servicios ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'fijo'"
    });
    if (error2) console.log('servicios column (may exist):', error2.message);
    else console.log('servicios column: OK');
    
    // Update productos price_type
    const { error: error3 } = await supabase.rpc('exec', {
      query: "UPDATE productos SET price_type = 'desde' WHERE price ILIKE 'desde%'"
    });
    if (error3) console.log('Update productos desde:', error3.message);
    else console.log('Update productos desde: OK');
    
    const { error: error4 } = await supabase.rpc('exec', {
      query: "UPDATE productos SET price_type = 'fijo' WHERE price_type IS NULL OR price_type = ''"
    });
    if (error4) console.log('Update productos fijo:', error4.message);
    else console.log('Update productos fijo: OK');
    
    // Update servicios price_type
    const { error: error5 } = await supabase.rpc('exec', {
      query: "UPDATE servicios SET price_type = 'desde' WHERE price ILIKE 'desde%'"
    });
    if (error5) console.log('Update servicios desde:', error5.message);
    else console.log('Update servicios desde: OK');
    
    const { error: error6 } = await supabase.rpc('exec', {
      query: "UPDATE servicios SET price_type = 'fijo' WHERE price_type IS NULL OR price_type = ''"
    });
    if (error6) console.log('Update servicios fijo:', error6.message);
    else console.log('Update servicios fijo: OK');
    
    console.log('Migration completed!');
  } catch (err) {
    console.error('Migration error:', err);
  }
}

runMigration();

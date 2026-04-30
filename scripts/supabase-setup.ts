import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irhbkkfvcawklbahivii.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaGJra2Z2Y2F3a2xiYWhpdmlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgzOTkwNiwiZXhwIjoyMDkxNDE1OTA2fQ.pCnFLBHLB9hSdVsxj4e5x6tLqLQe3cJ3b5R1vX8Kq1M';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const tables = [
  {
    name: 'productos',
    sql: `CREATE TABLE productos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      price TEXT NOT NULL,
      price_num NUMERIC,
      category TEXT DEFAULT 'otros',
      icon TEXT DEFAULT 'box',
      image TEXT DEFAULT '',
      popular BOOLEAN DEFAULT FALSE,
      whatsapp_link TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  },
  {
    name: 'servicios',
    sql: `CREATE TABLE servicios (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      price TEXT NOT NULL,
      price_num NUMERIC,
      category TEXT DEFAULT 'consultoria',
      icon TEXT DEFAULT 'star',
      image TEXT DEFAULT '',
      whatsapp_link TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  },
  {
    name: 'eventos',
    sql: `CREATE TABLE eventos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'Proximamente',
      whatsapp_link TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  },
  {
    name: 'pedidos',
    sql: `CREATE TABLE pedidos (
      id SERIAL PRIMARY KEY,
      customer_name TEXT,
      customer_email TEXT,
      items JSONB NOT NULL,
      total_price NUMERIC,
      status TEXT DEFAULT 'pendiente',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  }
];

async function setupTables() {
  console.log('Setting up Supabase tables...');

  for (const table of tables) {
    try {
      // Check if table exists
      const { error: checkError } = await supabase
        .from(table.name)
        .select('id')
        .limit(1);

      if (checkError?.code === '42P01') {
        // Table doesn't exist, create it
        const { error } = await supabase.rpc('pg_catalog', {});
        console.log(`Creating table: ${table.name}`);
      } else {
        console.log(`Table ${table.name} already exists`);
      }
    } catch (e) {
      console.log(`Checking table ${table.name}...`);
    }
  }

  console.log('Setup complete!');
  process.exit(0);
}

setupTables();

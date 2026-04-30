const supabaseUrl = 'https://irhbkkfvcawklbahivii.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaGJra2Z2Y2F3a2xiYWhpdmlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgzOTkwNiwiZXhwIjoyMDkxNDE1OTA2fQ.pCnFLBHLB9hSdVsxj4e5x6tLqLQe3cJ3b5R1vX8Kq1M';

async function query(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
    body: JSON.stringify({ sql })
  });
  return response.json();
}

async function insert(table, data) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
  return { status: response.status };
}

async function setup() {
  console.log('🔧 Configurando tablas en Supabase...\n');

  const tables = [
    {
      name: 'productos',
      columns: `id serial primary key, title text not null, description text, price text default '0', price_num numeric default 0, category text default 'otros', icon text default 'box', image text default '', popular boolean default false, whatsapp_link text default 'https://wa.me/5355609099', is_active boolean default true, created_at timestamptz default now(), updated_at timestamptz default now()`
    },
    {
      name: 'servicios',
      columns: `id serial primary key, title text not null, description text, price text default '0', price_num numeric default 0, category text default 'consultoria', icon text default 'star', image text default '', whatsapp_link text default 'https://wa.me/5355609099', is_active boolean default true, created_at timestamptz default now(), updated_at timestamptz default now()`
    },
    {
      name: 'eventos',
      columns: `id serial primary key, title text not null, description text, date text not null, status text default 'Proximamente', whatsapp_link text default 'https://wa.me/5355609099', is_active boolean default true, created_at timestamptz default now(), updated_at timestamptz default now()`
    },
    {
      name: 'pedidos',
      columns: `id serial primary key, customer_name text, customer_email text, items jsonb not null default '[]', total_price numeric default 0, status text default 'pendiente', created_at timestamptz default now()`
    }
  ];

  for (const table of tables) {
    console.log(`📦 Creando tabla: ${table.name}`);
    try {
      const createSql = `CREATE TABLE IF NOT EXISTS ${table.name} (${table.columns})`;
      await query(createSql);
      console.log(`   ✅ Tabla ${table.name} creada`);
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
    }
  }

  console.log('\n📝 Insertando datos...');

  // Productos
  const productos = [
    { title: 'Stickers 5x5 cm', description: 'Stickers adhesivos de 5x5 cm, perfectos para sellos, packaging y detalles de marca.', price: '60.00', price_num: 60, category: 'pegatinas', icon: 'box', popular: true },
    { title: 'Lonas 20x15', description: 'Mini lona, resistente para colgar.', price: '540.00', price_num: 540, category: 'lonas', icon: 'box', popular: false },
    { title: 'Tarjetas de Presentación 1 cara (Cartulina)', description: 'Tarjeta en cartulina 180g impresa a una cara.', price: '25.00', price_num: 25, category: 'tarjetas', icon: 'box', popular: false },
  ];

  console.log('   📦 Insertando productos...');
  for (const p of productos) {
    await insert('productos', p);
  }

  // Servicios
  const servicios = [
    { title: 'Consultoría Experta', description: 'Servicio inicial de análisis que incluye informes y evaluaciones rápidas sobre el estado actual de tu negocio.', price: 'Desde $0 CUP', price_num: 0, category: 'consultoria', icon: 'star' },
    { title: 'Marketing Digital', description: 'Creación de contenido multiplataforma, diseño de identidad visual y estrategias de marketing digital.', price: 'Desde $5,000 CUP/mes', price_num: 5000, category: 'capacitacion', icon: 'trending' },
    { title: 'Automatización', description: 'Bot de WhatsApp, páginas web, funnel de ventas multicanal y más soluciones para automatizar tu negocio.', price: 'Desde $5,000 CUP', price_num: 5000, category: 'herramientas', icon: 'bolt' },
  ];

  console.log('   📦 Insertando servicios...');
  for (const s of servicios) {
    await insert('servicios', s);
  }

  // Eventos
  const eventos = [
    { title: 'Masterclass de E-commerce', description: 'Todo lo que necesitas saber para vender online y escalar tu negocio digital.', date: 'Enero 2025', status: 'Proximamente' },
    { title: 'Bootcamp Emprendedor', description: 'Programa intensivo de 4 semanas para acelerar el crecimiento de tu emprendimiento.', date: 'Febrero 2025', status: 'Proximamente' },
  ];

  console.log('   📦 Insertando eventos...');
  for (const e of eventos) {
    await insert('eventos', e);
  }

  console.log('\n🎉 ¡Setup completo!');

  // Verificar
  console.log('\n🔍 Verificando datos...');
  for (const table of ['productos', 'servicios', 'eventos']) {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });
    const data = await response.json();
    console.log(`   ✅ ${table}: ${data.length} registros`);
  }
}

setup().catch(console.error);

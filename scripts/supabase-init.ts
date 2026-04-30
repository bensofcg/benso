import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irhbkkfvcawklbahivii.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaGJra2Z2Y2F3a2xiYWhpdmlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgzOTkwNiwiZXhwIjoyMDkxNDE1OTA2fQ.pCnFLBHLB9hSdVsxj4e5x6tLqLQe3cJ3b5R1vX8Kq1M';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setup() {
  console.log('🔧 Configurando tablas en Supabase...\n');

  // Crear tabla productos
  console.log('📦 Creando tabla: productos');
  await supabase.rpc('pg_catalog.exec', { 
    sql: `CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      price TEXT NOT NULL DEFAULT '0',
      price_num NUMERIC DEFAULT 0,
      category TEXT DEFAULT 'otros',
      icon TEXT DEFAULT 'box',
      image TEXT DEFAULT '',
      popular BOOLEAN DEFAULT FALSE,
      whatsapp_link TEXT DEFAULT 'https://wa.me/5355609099',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  });

  // Crear tabla servicios
  console.log('📦 Creando tabla: servicios');
  await supabase.rpc('pg_catalog.exec', {
    sql: `CREATE TABLE IF NOT EXISTS servicios (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      price TEXT NOT NULL DEFAULT '0',
      price_num NUMERIC DEFAULT 0,
      category TEXT DEFAULT 'consultoria',
      icon TEXT DEFAULT 'star',
      image TEXT DEFAULT '',
      whatsapp_link TEXT DEFAULT 'https://wa.me/5355609099',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  });

  // Crear tabla eventos
  console.log('📦 Creando tabla: eventos');
  await supabase.rpc('pg_catalog.exec', {
    sql: `CREATE TABLE IF NOT EXISTS eventos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'Proximamente',
      whatsapp_link TEXT DEFAULT 'https://wa.me/5355609099',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  });

  // Crear tabla pedidos
  console.log('📦 Creando tabla: pedidos');
  await supabase.rpc('pg_catalog.exec', {
    sql: `CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      customer_name TEXT,
      customer_email TEXT,
      items JSONB NOT NULL DEFAULT '[]',
      total_price NUMERIC DEFAULT 0,
      status TEXT DEFAULT 'pendiente',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  });

  // Insertar datos de ejemplo
  console.log('\n📝 Insertando datos de ejemplo...');

  // Productos
  const { error: prodError } = await supabase.from('productos').upsert([
    { title: 'Stickers 5x5 cm', description: 'Stickers adhesivos de 5x5 cm, perfectos para sellos, packaging y detalles de marca.', price: '60.00', price_num: 60, category: 'pegatinas', icon: 'box', popular: true },
    { title: 'Lonas 20x15', description: 'Mini lona, resistente para colgar.', price: '540.00', price_num: 540, category: 'lonas', icon: 'box', popular: false },
    { title: 'Tarjetas de Presentación 1 cara (Cartulina)', description: 'Tarjeta en cartulina 180g impresa a una cara.', price: '25.00', price_num: 25, category: 'tarjetas', icon: 'box', popular: false },
  ], { onConflict: 'title' });

  // Servicios
  const { error: servError } = await supabase.from('servicios').upsert([
    { title: 'Consultoría Experta', description: 'Servicio inicial de análisis que incluye informes y evaluaciones rápidas sobre el estado actual de tu negocio.', price: 'Desde $0 CUP', price_num: 0, category: 'consultoria', icon: 'star' },
    { title: 'Marketing Digital', description: 'Creación de contenido multiplataforma, diseño de identidad visual y estrategias de marketing digital.', price: 'Desde $5,000 CUP/mes', price_num: 5000, category: 'capacitacion', icon: 'trending' },
    { title: 'Automatización', description: 'Bot de WhatsApp, páginas web, funnel de ventas multicanal y más soluciones para automatizar tu negocio.', price: 'Desde $5,000 CUP', price_num: 5000, category: 'herramientas', icon: 'bolt' },
  ], { onConflict: 'title' });

  // Eventos
  const { error: eventError } = await supabase.from('eventos').upsert([
    { title: 'Masterclass de E-commerce', description: 'Todo lo que necesitas saber para vender online y escalar tu negocio digital.', date: 'Enero 2025', status: 'Proximamente' },
    { title: 'Bootcamp Emprendedor', description: 'Programa intensivo de 4 semanas para acelerar el crecimiento de tu emprendimiento.', date: 'Febrero 2025', status: 'Proximamente' },
  ], { onConflict: 'title' });

  if (prodError || servError || eventError) {
    console.log('⚠️ Algunos datos ya existen o hubo errores menores');
  } else {
    console.log('✅ Datos insertados correctamente');
  }

  // Verificar tablas
  console.log('\n🔍 Verificando tablas...');
  const tables = ['productos', 'servicios', 'eventos', 'pedidos'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id');
    if (error) {
      console.log(`❌ ${table}: Error - ${error.message}`);
    } else {
      console.log(`✅ ${table}: ${data?.length || 0} registros`);
    }
  }

  console.log('\n🎉 ¡Setup completo!');
}

setup().catch(console.error);

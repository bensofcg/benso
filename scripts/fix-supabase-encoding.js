/**
 * Fix encoding issues in Supabase database.
 * Replaces corrupted UTF-8 characters () with proper Spanish accented characters.
 * Also fixes missing dollar signs and digit placeholders in descriptions.
 * 
 * Run with: node scripts/fix-supabase-encoding.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://irhbkkfvcawklbahivii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaGJra2Z2Y2F3a2xiYWhpdmlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgzOTkwNiwiZXhwIjoyMDkxNDE1OTA2fQ.oVBr-qOn1D04ho8uzkTuayOnyLJYrGpq2QMDWwxVWfQ';

const supabase = createClient(supabaseUrl, supabaseKey);

// Known corrections for servicios table
const serviciosCorrections = [
  {
    id: 7,
    updates: {
      title: 'Asesoramiento Técnico y Profesional',
      description: 'Implementación de soluciones personalizadas para problemas detectados en áreas clave. Contabilidad desde $1,500 CUP / Marketing desde $3,000 CUP.',
      whatsapp_link: 'https://wa.me/5355609099?text=Quiero%20solicitar%20asesor%C3%ADa%20t%C3%A9cnica'
    }
  },
  {
    id: 8,
    updates: {
      title: 'Sistemas de Contabilidad',
      description: 'Implementación de estándares (Versat, Desfot, SAP, Odoo, etc.) desde $5,000 CUP. Personalizados de Microsoft desde $3,800 CUP. Software único a medida desde $25,000 CUP.'
    }
  },
  {
    id: 9,
    updates: {
      title: 'Automatización de Procesos',
      description: 'Bot de WhatsApp: $15,000 CUP. Páginas Web: $6,500 CUP/mes (plan de mantenimiento y hosting). Funnel de Ventas Multicanal: $5,000 CUP.',
      whatsapp_link: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Automatizaci%C3%B3n%20de%20Procesos'
    }
  },
  {
    id: 10,
    updates: {
      title: 'Taller de Negociación',
      description: 'Programa de capacitación en técnicas de negociación aplicadas al entorno empresarial. Duración: 2 semanas.',
      whatsapp_link: 'https://wa.me/5355609099?text=Quiero%20inscribirme%20al%20Taller%20de%20Negociaci%C3%B3n'
    }
  },
  {
    id: 11,
    updates: {
      title: 'Taller de Marketing Digital',
      description: 'Aprende estrategias de marketing digital para posicionar tu negocio en redes sociales. Duración: 2 semanas.',
      whatsapp_link: 'https://wa.me/5355609099?text=Quiero%20inscribirme%20al%20Taller%20de%20Marketing%20Digital'
    }
  }
];

// Known corrections for productos table
const productosCorrections = [
  { id: 12, updates: { description: 'Pegatinas de gran formato (aprox. A4). Ideales para promociones y decoración de vitrinas.' } },
  { id: 13, updates: { title: 'Pósters en vinilo 21x14', description: 'Póster en vinilo de alta resistencia. Perfecto para interiores.' } },
  { id: 14, updates: { title: 'Pósters en vinilo 20x20' } },
  { id: 15, updates: { title: 'Pósters en vinilo 40x20', description: 'Tamaño mediano. Ideal para expositores y eventos.' } },
  { id: 16, updates: { title: 'Pósters en vinilo 50x30', description: 'Tamaño mediano. Ideal para expositores y eventos.' } },
  { id: 17, updates: { title: 'Pósters en vinilo 60x40', description: 'Tamaño mediano. Ideal para exteriores y eventos.' } },
  { id: 18, updates: { description: 'Cuadro rígido en PVC, acabado mate.' } },
  { id: 19, updates: { description: 'Cuadro rígido en PVC, acabado mate.' } },
  { id: 21, updates: { description: 'Formato mediano. Ideal para señalética y carteles de bienvenida.' } },
  { id: 22, updates: { description: 'Formato mediano. Ideal para señalética y carteles de bienvenida.' } },
  { id: 23, updates: { title: 'Tarjetas de Presentación 1 cara (Cartulina)', description: 'Tarjeta en cartulina 180g impresa a una cara.' } },
  { id: 24, updates: { title: 'Tarjetas de Presentación 2 caras (Cartulina)', description: 'Impresión a doble cara en cartulina. Acabado mate.' } },
  { id: 25, updates: { title: 'Tarjetas de Presentación 1 cara (Mica)', description: 'Mica con acabado brillante, impresión una cara.' } },
  { id: 26, updates: { title: 'Tarjetas de Presentación 2 caras (Mica)', description: 'Mica con acabado brillante, máxima calidad.' } },
  { id: 27, updates: { description: 'Invitaciones personalizadas en cartulina de diseño fotográfica o cromada.' } },
  { id: 29, updates: { description: 'Lona cuadrada, impresión en alta resolución.' } },
  { id: 32, updates: { title: 'Ampliación 1.30x90', description: 'Gran lona, impresión en Lona Front. Ideal para exteriores.' } },
  { id: 33, updates: { description: 'Credenciales plastificadas con cordón, personalizadas.' } },
  { id: 34, updates: { description: 'Soporte expositor para celular en PVC rígido, personalizable.' } },
  { id: 35, updates: { title: 'Cartas con código QR en PVC', description: 'Ideal para vincular a menú digital, pago en línea o redes sociales.' } }
];

async function fixServices() {
  console.log('\n=== Fixing Servicios ===');
  for (const { id, updates } of serviciosCorrections) {
    const { error } = await supabase.from('servicios').update(updates).eq('id', id);
    if (error) {
      console.error(`  ERROR updating servicio ${id}:`, error.message);
    } else {
      console.log(`  OK servicio ${id}: ${Object.keys(updates).join(', ')}`);
    }
  }
}

async function fixProductos() {
  console.log('\n=== Fixing Productos ===');
  for (const { id, updates } of productosCorrections) {
    const { error } = await supabase.from('productos').update(updates).eq('id', id);
    if (error) {
      console.error(`  ERROR updating producto ${id}:`, error.message);
    } else {
      console.log(`  OK producto ${id}: ${Object.keys(updates).join(', ')}`);
    }
  }
}

async function main() {
  await fixServices();
  await fixProductos();
  console.log('\n=== Done ===');
}

main().catch(console.error);

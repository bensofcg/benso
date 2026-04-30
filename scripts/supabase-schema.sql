-- ============================================
-- BENSO - Supabase Database Setup
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: productos
-- ============================================
CREATE TABLE IF NOT EXISTS productos (
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
);

-- ============================================
-- TABLE: servicios
-- ============================================
CREATE TABLE IF NOT EXISTS servicios (
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
);

-- ============================================
-- TABLE: eventos
-- ============================================
CREATE TABLE IF NOT EXISTS eventos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'Proximamente',
  whatsapp_link TEXT DEFAULT 'https://wa.me/5355609099',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: pedidos
-- ============================================
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  customer_name TEXT,
  customer_email TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total_price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES (Public read for all)
-- ============================================

-- Productos: anyone can read
CREATE POLICY "Public can read productos" ON productos
  FOR SELECT USING (is_active = TRUE);

-- Servicios: anyone can read
CREATE POLICY "Public can read servicios" ON servicios
  FOR SELECT USING (is_active = TRUE);

-- Eventos: anyone can read
CREATE POLICY "Public can read eventos" ON eventos
  FOR SELECT USING (is_active = TRUE);

-- Pedidos: anyone can insert (for placing orders)
CREATE POLICY "Public can insert pedidos" ON pedidos
  FOR INSERT WITH CHECK (true);

-- ============================================
-- SEED DATA - Productos
-- ============================================
INSERT INTO productos (title, description, price, price_num, category, icon, popular) VALUES
('Stickers 5x5 cm', 'Stickers adhesivos de 5x5 cm, perfectos para sellos, packaging y detalles de marca.', '60.00', 60, 'pegatinas', 'box', TRUE),
('Lonas 20x15', 'Mini lona, resistente para colgar.', '540.00', 540, 'lonas', 'box', FALSE),
('Tarjetas de Presentación 1 cara (Cartulina)', 'Tarjeta en cartulina 180g impresa a una cara.', '25.00', 25, 'tarjetas', 'box', FALSE),
('Posters A3', 'Poster de alta calidad en papel couché brillante.', '120.00', 120, 'posters', 'box', FALSE),
('Cuadros Personalizados', 'Cuadros con marco de aluminio y impresión de alta resolución.', '850.00', 850, 'cuadros', 'box', FALSE)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA - Servicios
-- ============================================
INSERT INTO servicios (title, description, price, price_num, category, icon) VALUES
('Consultoría Experta', 'Servicio inicial de análisis que incluye informes y evaluaciones rápidas sobre el estado actual de tu negocio.', 'Desde $0 CUP', 0, 'consultoria', 'star'),
('Marketing Digital', 'Creación de contenido multiplataforma, diseño de identidad visual y estrategias de marketing digital.', 'Desde $5,000 CUP/mes', 5000, 'capacitacion', 'trending'),
('Automatización', 'Bot de WhatsApp, páginas web, funnel de ventas multicanal y más soluciones para automatizar tu negocio.', 'Desde $5,000 CUP', 5000, 'herramientas', 'bolt')
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA - Eventos
-- ============================================
INSERT INTO eventos (title, description, date, status) VALUES
('Masterclass de E-commerce', 'Todo lo que necesitas saber para vender online y escalar tu negocio digital.', 'Enero 2025', 'Proximamente'),
('Bootcamp Emprendedor', 'Programa intensivo de 4 semanas para acelerar el crecimiento de tu emprendimiento.', 'Febrero 2025', 'Proximamente')
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCTION: Update timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS: Auto-update timestamp
-- ============================================
CREATE TRIGGER update_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicios_updated_at
  BEFORE UPDATE ON servicios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eventos_updated_at
  BEFORE UPDATE ON eventos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

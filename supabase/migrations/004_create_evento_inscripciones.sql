-- Table for event/course registrations
CREATE TABLE IF NOT EXISTS evento_inscripciones (
  id SERIAL PRIMARY KEY,
  evento_id INTEGER REFERENCES eventos(id) ON DELETE CASCADE,
  evento_titulo TEXT,
  correo_electronico TEXT NOT NULL,
  telefono TEXT NOT NULL,
  nivel_estudios TEXT NOT NULL,
  tiene_negocio BOOLEAN NOT NULL DEFAULT false,
  nombre_negocio TEXT,
  sector TEXT NOT NULL,
  motivacion TEXT NOT NULL,
  acuerdo_aprendizaje BOOLEAN NOT NULL DEFAULT false,
  notificaciones BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE evento_inscripciones ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (registration is public)
CREATE POLICY "Anyone can register" ON evento_inscripciones
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can view
CREATE POLICY "Authenticated users can view" ON evento_inscripciones
  FOR SELECT
  TO authenticated
  USING (true);

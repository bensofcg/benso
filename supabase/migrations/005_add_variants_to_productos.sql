-- Add variants JSONB column to productos
ALTER TABLE productos ADD COLUMN IF NOT EXISTS variants JSONB NOT NULL DEFAULT '[]'::jsonb;

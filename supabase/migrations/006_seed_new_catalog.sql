-- Update product categories to new taxonomy
UPDATE productos SET category = 'adhesivos' WHERE category IN ('pegatinas');
UPDATE productos SET category = 'carteleria' WHERE category IN ('posters', 'cuadros');
UPDATE productos SET category = 'papeleria' WHERE category IN ('tarjetas');

-- Upsert products with variants
INSERT INTO productos (title, description, price, price_num, category, image, popular, is_active, variants)
VALUES
  -- Adhesivos
  ('Stickers', 'Stickers adhesivos personalizados. Vinilo adhesivo, acabado brillante.', '$65.00', 65, 'adhesivos', '/images/products/stickers.webp', true, true,
   '[{"label":"Lote de 50","unit_price":65,"total_price":3250,"description":"$65 por unidad"},{"label":"Lote de 100","unit_price":60,"total_price":6000,"description":"$60 por unidad"},{"label":"Lote de 150","unit_price":55,"total_price":8250,"description":"$55 por unidad"}]'),
  ('Etiquetas 4x8cm', 'Etiquetas adhesivas de 4x8 cm. Vinilo adhesivo, acabado brillante.', '$80.00', 80, 'adhesivos', '/images/products/etiquetas.webp', false, true,
   '[{"label":"Lote de 30","unit_price":80,"total_price":2400,"description":"$80 por unidad"},{"label":"Lote de 50","unit_price":75,"total_price":3750,"description":"$75 por unidad"},{"label":"Lote de 100","unit_price":70,"total_price":7000,"description":"$70 por unidad"}]'),
  ('Pegatina Grande', 'Pegatina de gran formato, hasta 20x30 cm. Vinilo adhesivo de alta resistencia.', '$35.00', 35, 'adhesivos', '/images/products/pegatinas-grandes.webp', false, true,
   '[{"label":"Único","unit_price":35,"total_price":35,"description":"$35 por unidad"}]'),

  -- Cartelería
  ('Flyer', 'Flyer publicitario. Acabado semi-brillante.', '$3,000.00', 3000, 'carteleria', '/images/products/flyer.webp', false, true,
   '[{"label":"Único","unit_price":3000,"total_price":3000,"description":"Acabado semi-brillante"}]'),
  ('Cartel PVC', 'Cartel en PVC rígido con vinilo adhesivo. Ideal para interiores y exteriores.', '$750.00', 750, 'carteleria', '/images/products/cartel-pvc.webp', false, true,
   '[{"label":"15x10 cm","unit_price":750,"total_price":750},{"label":"21x15 cm","unit_price":1000,"total_price":1000},{"label":"20x20 cm","unit_price":1350,"total_price":1350},{"label":"30x20 cm","unit_price":2250,"total_price":2250},{"label":"35x25 cm","unit_price":2750,"total_price":2750}]'),
  ('Cuadro Acrílico', 'Cuadro en acrílico con efecto translúcido. Ideal para decoración de interiores.', '$1,650.00', 1650, 'carteleria', '/images/products/cuadro-acrilico.webp', false, true,
   '[{"label":"21x14 cm","unit_price":1650,"total_price":1650,"description":"Efecto translúcido"}]'),
  ('Letras Caladas', 'Letras decorativas caladas para interiores premium.', '$700.00', 700, 'carteleria', '', false, true,
   '[{"label":"12 cm","unit_price":700,"total_price":700},{"label":"15 cm","unit_price":1000,"total_price":1000},{"label":"25 cm","unit_price":1500,"total_price":1500}]'),

  -- Papelería
  ('Tarjeta Presentación 1 cara mate', 'Tarjeta de presentación impresa a una cara. Acabado mate.', '$35.00', 35, 'papeleria', '/images/products/tarjetas-presentacion.webp', false, true,
   '[{"label":"Lote de 50","unit_price":35,"total_price":1750,"description":"$35 por unidad"},{"label":"Lote de 100","unit_price":33,"total_price":3300,"description":"$33 por unidad"}]'),
  ('Tarjeta Presentación 2 caras mate', 'Tarjeta de presentación impresa a doble cara. Acabado mate.', '$45.00', 45, 'papeleria', '/images/products/tarjetas-presentacion.webp', false, true,
   '[{"label":"Lote de 50","unit_price":45,"total_price":2250,"description":"$45 por unidad"},{"label":"Lote de 100","unit_price":40,"total_price":4000,"description":"$40 por unidad"}]'),
  ('Postal de Invitación', 'Invitaciones personalizadas en cartulina de diseño.', '$55.00', 55, 'papeleria', '/images/products/invitaciones.webp', false, true,
   '[{"label":"Lote de 50","unit_price":55,"total_price":2750,"description":"$55 por unidad"},{"label":"Lote de 100","unit_price":49,"total_price":4900,"description":"$49 por unidad"}]'),
  ('Plegables', 'Plegables publicitarios personalizados.', '$300.00', 300, 'papeleria', '/images/products/plegables.webp', false, true,
   '[{"label":"Único","unit_price":300,"total_price":300}]'),
  ('Agenda', 'Agenda personalizable con canutillo.', '$2,000.00', 2000, 'papeleria', '', false, true,
   '[{"label":"70 hojas","unit_price":2000,"total_price":2000},{"label":"50 hojas","unit_price":1500,"total_price":1500}]'),
  ('Credenciales', 'Credenciales plastificadas con cordón, personalizables con canutillo.', '$600.00', 600, 'papeleria', '/images/products/credenciales.webp', false, true,
   '[{"label":"Único","unit_price":600,"total_price":600}]'),

  -- Indumentaria
  ('Pullover 1 cara', 'Pullover personalizado impreso a una cara.', '$2,450.00', 2450, 'indumentaria', '/images/products/pulover-1cara.webp', false, true,
   '[{"label":"Único","unit_price":2450,"total_price":2450}]'),
  ('Pullover 2 caras', 'Pullover personalizado impreso a dos caras.', '$3,000.00', 3000, 'indumentaria', '', false, true,
   '[{"label":"Único","unit_price":3000,"total_price":3000}]'),
  ('Enguatadas', 'Chaqueta enguatada personalizada.', '$3,500.00', 3500, 'indumentaria', '', false, true,
   '[{"label":"Único","unit_price":3500,"total_price":3500}]'),
  ('Gorra', 'Gorra personalizada con diseño bordado o impreso.', '$2,300.00', 2300, 'indumentaria', '/images/products/gorras.webp', false, true,
   '[{"label":"Único","unit_price":2300,"total_price":2300}]'),
  ('Bolsos', 'Bolso personalizado con diseño impreso.', '$2,000.00', 2000, 'indumentaria', '', false, true,
   '[{"label":"Único","unit_price":2000,"total_price":2000}]'),
  ('Porta Celular', 'Soporte expositor para celular en PVC + Vinilo adhesivo.', '$850.00', 850, 'indumentaria', '/images/products/porta-celular.webp', false, true,
   '[{"label":"Único","unit_price":850,"total_price":850}]'),

  -- Merchandising
  ('Lapicero Personalizado', 'Lapicero personalizado con impresión.', '$1,500.00', 1500, 'merchandising', '', false, true,
   '[{"label":"Único","unit_price":1500,"total_price":1500}]'),
  ('Jarra', 'Jarra personalizada con diseño impreso.', '$2,250.00', 2250, 'merchandising', '/images/products/jarras.webp', false, true,
   '[{"label":"Único","unit_price":2250,"total_price":2250}]'),
  ('Termo 500ml', 'Termo de 500ml personalizado.', '$3,250.00', 3250, 'merchandising', '', false, true,
   '[{"label":"Único","unit_price":3250,"total_price":3250}]'),
  ('Termo 250ml', 'Termo de 250ml personalizado.', '$2,250.00', 2250, 'merchandising', '', false, true,
   '[{"label":"Único","unit_price":2250,"total_price":2250}]'),
  ('Llavero', 'Llavero personalizado con diseño.', '$640.00', 640, 'merchandising', '/images/products/llavero.webp', false, true,
   '[{"label":"Único","unit_price":640,"total_price":640}]')

ON CONFLICT (title) DO UPDATE SET
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_num = EXCLUDED.price_num,
  image = EXCLUDED.image,
  variants = EXCLUDED.variants,
  is_active = true;

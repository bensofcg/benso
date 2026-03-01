import { useState } from 'react';
import { Link } from 'react-router-dom';

export function PromoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="promo-banner">
      <p>🎓 ¡Nuevo curso de Marketing Digital disponible! Inscríbete con un 20% de descuento.</p>
      <Link to="/eventos" className="promo-banner-cta">
        Ver más
      </Link>
      <button
        className="promo-banner-close"
        onClick={() => setVisible(false)}
        aria-label="Cerrar banner"
      >
        ✕
      </button>
    </div>
  );
}

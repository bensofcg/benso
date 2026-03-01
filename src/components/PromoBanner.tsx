import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

export function PromoBanner() {
  const [visible, setVisible] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    document.documentElement.style.setProperty('--banner-height', '0px');
  }, []);

  useEffect(() => {
    const timer = setTimeout(dismiss, 8000);
    return () => clearTimeout(timer);
  }, [dismiss]);

  useEffect(() => {
    if (visible && bannerRef.current) {
      const height = bannerRef.current.offsetHeight;
      document.documentElement.style.setProperty('--banner-height', `${height}px`);
    }
    return () => {
      document.documentElement.style.setProperty('--banner-height', '0px');
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="promo-banner" ref={bannerRef}>
      <p>🎓 ¡Nuevo curso de Marketing Digital disponible! Inscríbete con un 20% de descuento.</p>
      <Link to="/eventos" className="promo-banner-cta" onClick={dismiss}>
        Ver más
      </Link>
      <button
        className="promo-banner-close"
        onClick={dismiss}
        aria-label="Cerrar banner"
      >
        ✕
      </button>
    </div>
  );
}

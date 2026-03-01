import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function PromoBanner() {
  const [visible, setVisible] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const dismiss = useCallback(() => {
    setVisible(false);
    document.documentElement.style.setProperty('--banner-height', '0px');
  }, []);

  const handleBannerClick = useCallback(() => {
    dismiss();
    navigate('/eventos');
  }, [dismiss, navigate]);

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
    <div className="promo-banner" ref={bannerRef} onClick={handleBannerClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleBannerClick(); } }}>
      <p>🎓 ¡Nuevo curso de Marketing Digital disponible! Inscríbete con un <strong>20% de descuento</strong>.</p>
      <button
        className="promo-banner-close"
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        aria-label="Cerrar banner"
      >
        ✕
      </button>
    </div>
  );
}

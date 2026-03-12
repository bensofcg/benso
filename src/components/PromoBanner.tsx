import { useEffect, useRef } from 'react';

export function PromoBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current) {
      const height = bannerRef.current.offsetHeight;
      document.documentElement.style.setProperty('--banner-height', `${height}px`);
    }
    return () => {
      document.documentElement.style.setProperty('--banner-height', '0px');
    };
  }, []);

  return (
    <div className="promo-banner" ref={bannerRef}>
      <div className="promo-banner-track">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="promo-banner-item">
            ¡Nuevo curso de Marketing Digital! <span className="promo-highlight">20% de descuento</span>
          </span>
        ))}
      </div>
    </div>
  );
}

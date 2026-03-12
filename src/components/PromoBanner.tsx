import { useEffect, useRef } from 'react';

const BANNER_LINK = 'https://wa.me/5355609099?text=Hola%2C%20me%20interesa%20el%20curso%20de%20Marketing%20Digital%20con%2020%25%20de%20descuento';

export function PromoBanner() {
  const bannerRef = useRef<HTMLAnchorElement>(null);

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
    <a
      className="promo-banner"
      ref={bannerRef}
      href={BANNER_LINK}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="promo-banner-track">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="promo-banner-item">
            ¡Nuevo curso de Marketing Digital! <span className="promo-highlight">20% de descuento</span>
          </span>
        ))}
      </div>
    </a>
  );
}

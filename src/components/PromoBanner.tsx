'use client';

import { useEffect, useRef } from 'react';

const BANNER_LINK = '/contacto';

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
      aria-label="Acceder a la promoción de Marketing Digital con 20% de descuento"
    >
      <div className="promo-banner-track">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="promo-banner-item">
            Nuevo curso de Marketing Digital! <span className="promo-highlight">20% de descuento</span>
          </span>
        ))}
      </div>
    </a>
  );
}

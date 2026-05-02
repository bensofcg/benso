'use client';

import { useState, useEffect } from 'react';

export function PageLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const hideLoader = async () => {
      try {
        // Esperar a que las fuentes estén listas
        await document.fonts.ready;
        // Un poco más para el grainient/CSS crítico
        setTimeout(() => setShow(false), 300);
      } catch {
        // Fallback si algo falla
        setTimeout(() => setShow(false), 1500);
      }
    };

    hideLoader();
  }, []);

  if (!show) return null;

  return (
    <div className="page-loader-overlay">
      <div className="page-loader">
        <div className="page-loader-logo">
          <img 
            src="/benso/assets/logos/Isotipo Benso Oscuro.svg" 
            alt="Benso" 
            className="page-loader-benso-logo"
          />
        </div>
      </div>
    </div>
  );
}

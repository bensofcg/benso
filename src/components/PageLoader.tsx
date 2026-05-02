'use client';

import { useState, useEffect } from 'react';

export function PageLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Ocultar rápidamente cuando el DOM esté listo
    if (document.readyState === 'complete') {
      setShow(false);
    } else {
      const hide = () => setShow(false);
      if (document.readyState === 'interactive') {
        hide();
      } else {
        window.addEventListener('DOMContentLoaded', hide);
        return () => window.removeEventListener('DOMContentLoaded', hide);
      }
    }
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

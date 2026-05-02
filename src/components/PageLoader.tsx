'use client';

import { useState, useEffect } from 'react';

export function PageLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 1200);
    
    return () => clearTimeout(timer);
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

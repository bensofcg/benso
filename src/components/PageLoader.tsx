'use client';

import { useState, useEffect } from 'react';

export function PageLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <img 
        src="/benso/assets/logos/Isotipo Benso Oscuro.svg" 
        alt="" 
        style={{ width: 80, height: 80 }} 
      />
      <style>{`
        img {
          animation: reactbits-pulse 2s ease-in-out infinite;
        }
        @keyframes reactbits-pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.92); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
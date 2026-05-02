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
        style={{ 
          width: 70, 
          height: 70, 
          opacity: 0.7,
          transform: 'scale(0.95)',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} 
      />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
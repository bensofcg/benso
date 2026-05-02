'use client';

import { useState, useEffect } from 'react';

export function PageLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 800);
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
          width: 100, 
          height: 100,
          filter: 'drop-shadow(0 0 8px rgba(0, 44, 106, 0.3))'
        }} 
      />
      <style>{`
        img {
          animation: pulse-glow 1.5s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0.6; 
            transform: scale(0.88); 
            filter: drop-shadow(0 0 4px rgba(0, 44, 106, 0.2));
          }
          50% { 
            opacity: 1; 
            transform: scale(1); 
            filter: drop-shadow(0 0 16px rgba(0, 44, 106, 0.5));
          }
        }
      `}</style>
    </div>
  );
}
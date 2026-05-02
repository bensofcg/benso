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
          width: 80, 
          height: 80, 
        }} 
      />
      <style>{`
        img {
          animation: reactbits-bounce 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }
        @keyframes reactbits-bounce {
          0%, 100% { transform: scale(0.88); opacity: 0.6; }
          50% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
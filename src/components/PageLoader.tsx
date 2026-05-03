'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function PageLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1200);
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
      zIndex: 99999,
    }}>
      <div style={{
        animation: 'fadeInOut 1s ease-in-out infinite',
      }}>
        <Image 
          src="/benso/assets/logos/Isotipo Benso Oscuro.svg"
          alt="BENSO"
          width={80}
          height={53}
          style={{
            objectFit: 'contain',
            display: 'block',
          }}
          unoptimized
        />
      </div>
      
      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
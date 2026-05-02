'use client';

import { useState, useEffect } from 'react';

function PageLoader() {
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
        style={{ width: 60, height: 60, opacity: 0.8 }}
      />
    </div>
  );
}

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      {children}
    </>
  );
}
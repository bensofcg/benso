'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { EventRegistrationForm } from './EventRegistrationForm';

export function PromoBanner() {
  const bannerRef = useRef<HTMLButtonElement>(null);
  const [evento, setEvento] = useState<{ id: number; title: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Measure banner height for layout
  useEffect(() => {
    if (bannerRef.current) {
      const height = bannerRef.current.offsetHeight;
      document.documentElement.style.setProperty('--banner-height', `${height}px`);
    }
    return () => {
      document.documentElement.style.setProperty('--banner-height', '0px');
    };
  }, []);

  // Look up the Marketing Digital event from the database
  useEffect(() => {
    supabase
      .from('eventos')
      .select('id, title')
      .ilike('title', '%Marketing%')
      .eq('is_active', true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setEvento(data);
        }
      });
  }, []);

  const handleClick = () => {
    if (evento) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        className="promo-banner"
        ref={bannerRef}
        onClick={handleClick}
        aria-label="Acceder a la promoción de curso de Marketing Digital"
      >
        <div className="promo-banner-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="promo-banner-item">
              Nuevo curso de Marketing Digital! <span className="promo-highlight">20% de descuento</span>
            </span>
          ))}
        </div>
      </button>

      {evento && (
        <EventRegistrationForm
          eventoId={evento.id}
          eventoTitle={evento.title}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { BentoCard, ScrollReveal, AnimatedCard, StatusIcon, CalendarIcon, EventsGridSkeleton, EventRegistrationForm, RequestModal, ShinyText } from '@/components';
import { useEventos } from '@/hooks/useData';

interface RequestItem {
  title: string;
  price: string;
  priceNum: number;
  whatsappLink: string;
  type: 'servicio' | 'producto' | 'evento';
}

export function EventsPage() {
  const [mounted, setMounted] = useState(false);
  const { eventos, loading } = useEventos();
  const [registrationEvent, setRegistrationEvent] = useState<{ id: number; title: string } | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [requestItem, setRequestItem] = useState<RequestItem | null>(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  const showLoading = !mounted || loading;
  const currentEvents = eventos.filter(e => e.status === 'En Curso');
  const upcomingEvents = eventos.filter(e => e.status === 'Proximamente');

  return (
    <>
      <ScrollReveal>
        <div className="container">
          <div className="section-title page-intro-title">
            <h2>Eventos actuales</h2>
          </div>
          
          {showLoading ? (
            <EventsGridSkeleton count={2} />
          ) : (
          <div className="bento-grid-events">
            {currentEvents.map((event, index) => (
              <AnimatedCard key={event.id} index={index}>
                <BentoCard className="interactive-card">
                  <h3>{event.title}</h3>
                  <div className="event-tags-row">
                    <span className="event-status-tag"><StatusIcon status={event.status} />{event.status}</span>
                    <span className="event-date-tag">
                      <CalendarIcon />
                      {event.date}
                    </span>
                  </div>
                  <p>{event.description}</p>
                  <div className="card-actions event-card-actions">
                    <button
                      className="event-cta-link"
                      onClick={() => {
                        setRegistrationEvent({ id: event.id, title: event.title });
                        setIsRegistrationOpen(true);
                      }}
                    >
                      <span>Inscribirme</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </div>
                </BentoCard>
              </AnimatedCard>
            ))}
          </div>
          )}
        </div>
      </ScrollReveal>

      {upcomingEvents.length > 0 && (
      <ScrollReveal>
        <div className="container">
          <div className="section-title">
            <h2>Próximamente</h2>
          </div>
          
          {showLoading ? (
            <EventsGridSkeleton count={2} />
          ) : (
          <div className="bento-grid-events">
            {upcomingEvents.map((event, index) => (
              <AnimatedCard key={event.id} index={index}>
                <BentoCard className="interactive-card">
                  <h3>{event.title}</h3>
                  <div className="event-tags-row">
                    <span className="event-status-tag"><StatusIcon status={event.status} />{event.status}</span>
                    <span className="event-date-tag">
                      <CalendarIcon />
                      {event.date}
                    </span>
                  </div>
                  <p>{event.description}</p>
                  <div className="card-actions event-card-actions">
                    <button
                      className="event-cta-link"
                      onClick={() => {
                        setRegistrationEvent({ id: event.id, title: event.title });
                        setIsRegistrationOpen(true);
                      }}
                    >
                      <span>Inscribirme</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </div>
                </BentoCard>
              </AnimatedCard>
            ))}
          </div>
          )}
        </div>
      </ScrollReveal>
      )}

      <ScrollReveal>
        <div className="container section-cta">
          <h2>¿Listo para transformar tu negocio?</h2>
          <p>Agenda una cita y descubre cómo podemos ayudarte a alcanzar tus metas.</p>
          <button 
            className="cta-button"
            onClick={() => {
              setRequestItem({
                title: 'Cita de consulta',
                price: '',
                priceNum: 0,
                whatsappLink: '',
                type: 'servicio'
              });
              setIsRequestOpen(true);
            }}
          >
            <Calendar size={18} />
            Agendar cita
          </button>
        </div>
      </ScrollReveal>

      <EventRegistrationForm
        eventoId={registrationEvent?.id ?? 0}
        eventoTitle={registrationEvent?.title ?? ''}
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />

      <RequestModal
        item={requestItem}
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
      />
    </>
  );
}
'use client';

import { useState } from 'react';
import { Calendar, Ticket } from 'lucide-react';
import { BentoCard, ScrollReveal, AnimatedCard, StatusIcon, CalendarIcon, EventsGridSkeleton, RequestModal, ShinyText } from '@/components';
import { useEventos } from '@/hooks/useData';

interface RequestItem {
  title: string;
  price: string;
  priceNum: number;
  whatsappLink: string;
  type: 'servicio' | 'producto' | 'evento';
}

export function EventsPage() {
  const { eventos, loading } = useEventos();
  const [requestItem, setRequestItem] = useState<RequestItem | null>(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const openRequest = (item: RequestItem) => {
    setRequestItem(item);
    setIsRequestOpen(true);
  };

  const currentEvents = eventos.filter(e => e.status === 'En Curso');
  const upcomingEvents = eventos.filter(e => e.status === 'Proximamente');

  return (
    <>
      <ScrollReveal>
        <div className="container">
          <div className="section-title page-intro-title">
            <h2>Eventos actuales</h2>
          </div>
          
          {loading ? (
            <EventsGridSkeleton count={2} />
          ) : (
          <div className="bento-grid">
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
                  <div className="card-actions">
                    <button
                      className="btn-consult"
                      onClick={() => openRequest({
                        title: event.title,
                        price: event.date,
                        priceNum: 0,
                        whatsappLink: event.whatsapp_link,
                        type: 'evento'
                      })}
                    >
                      <Ticket size={16} />
                      <span>Inscribirme</span>
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
          
          {loading ? (
            <EventsGridSkeleton count={2} />
          ) : (
          <div className="bento-grid">
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
                  <div className="card-actions">
                    <button
                      className="btn-consult"
                      onClick={() => openRequest({
                        title: event.title,
                        price: event.date,
                        priceNum: 0,
                        whatsappLink: event.whatsapp_link,
                        type: 'evento'
                      })}
                    >
                      <Ticket size={16} />
                      <span>Inscribirme</span>
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
            <ShinyText text="Agendar cita" speed={3.5} />
          </button>
        </div>
      </ScrollReveal>

      <RequestModal
        item={requestItem}
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
      />
    </>
  );
}
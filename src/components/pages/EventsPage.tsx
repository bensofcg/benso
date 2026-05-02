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
                <BentoCard>
                  <h3>{event.title}</h3>
                  <div className="event-tags-row">
                    <span className="event-status-tag"><StatusIcon status={event.status} />{event.status}</span>
                    <span className="event-date-tag">
                      <CalendarIcon />
                      {event.date}
                    </span>
                  </div>
                  <p>{event.description}</p>
                </BentoCard>
              </AnimatedCard>
            ))}
            {currentEvents.length === 0 && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
                No hay eventos en curso actualmente
              </p>
            )}
          </div>
          )}
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="container">
          <div className="section-title">
            <h2>Próximos eventos</h2>
          </div>
          
          {loading ? (
            <EventsGridSkeleton count={2} />
          ) : (
          <div className="bento-grid">
            {upcomingEvents.map((event, index) => (
              <AnimatedCard key={event.id} index={index}>
                <BentoCard>
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
            {upcomingEvents.length === 0 && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
                No hay eventos próximos programados
              </p>
            )}
          </div>
          )}
        </div>
      </ScrollReveal>

      {loading ? (
        <EventsGridSkeleton count={4} />
      ) : (
      <ScrollReveal>
        <div className="container">
          <div className="section-title-center">
            <h2 style={{ margin: 0, color: 'var(--primary)' }}>Línea del Tiempo</h2>
          </div>

          <div className="timeline">
            {(() => {
              // Combine all events and sort chronologically
              const allEvents = [...currentEvents, ...upcomingEvents].sort((a, b) => {
                // Parse dates for comparison (e.g. "Diciembre 2024", "Enero 2025")
                const parseDate = (dateStr: string): Date => {
                  const months: Record<string, number> = {
                    'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3,
                    'Mayo': 4, 'Junio': 5, 'Julio': 6, 'Agosto': 7,
                    'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11,
                  };
                  const parts = dateStr.split(' ');
                  const month = months[parts[0]] ?? 0;
                  const year = parts[1] ? parseInt(parts[1]) : 2024;
                  return new Date(year, month, 1);
                };
                return parseDate(a.date).getTime() - parseDate(b.date).getTime();
              });

              // Render with month/year separation
              let lastYear: string | null = null;
              return allEvents.map((event) => {
                // Parse date into month and year
                const dateParts = event.date.split(' ');
                const month = dateParts[0] || '';
                const year = dateParts[1] || '2024';
                const showYear = year !== lastYear;
                lastYear = year;

                return (
                  <div key={event.id} className="timeline-item">
                    <div className="timeline-date-label">
                      <span className="timeline-month">{month}</span>
                      {showYear && <span className="timeline-year">{year}</span>}
                    </div>
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <h4>{event.title}</h4>
                      <span className={`timeline-status ${event.status === 'En Curso' ? 'active' : ''}`}>{event.status}</span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </ScrollReveal>
      )}

      <ScrollReveal>
        <div className="container section-cta">
          <h2>¿Listo para transformar tu negocio?</h2>
          <p>Agenda una cita y descubre cómo podemos ayudarte a alcanzar tus metas.</p>
          <a href="/contacto" className="cta-button">
            <Calendar size={18} />
            <ShinyText text="Agendar cita" speed={3.5} />
          </a>
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

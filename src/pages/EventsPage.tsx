import { BentoCard, Icon } from '../components';

const currentEvents = [
  {
    title: 'Taller de Gestión Financiera',
    status: 'En Curso',
    date: 'Diciembre 2024',
    description: 'Capacitación intensiva sobre control de flujo de caja, análisis de costos y planificación presupuestaria para PyMEs.'
  },
  {
    title: 'Programa de Mentoría Empresarial',
    status: 'En Curso',
    date: 'Noviembre - Enero',
    description: 'Acompañamiento personalizado de 3 meses para emprendedores en etapa de crecimiento.'
  }
];

const upcomingEvents = [
  {
    title: 'Masterclass de E-commerce',
    status: 'Próximamente',
    date: 'Enero 2025',
    description: 'Todo lo que necesitas saber para vender online y escalar tu negocio digital.',
    whatsappLink: 'https://wa.me/5355609099?text=Hola%2C%20quiero%20inscribirme%20al%20evento%20Masterclass%20de%20E-commerce'
  },
  {
    title: 'Bootcamp Emprendedor',
    status: 'Próximamente',
    date: 'Febrero 2025',
    description: 'Programa intensivo de 4 semanas para acelerar el crecimiento de tu emprendimiento.',
    whatsappLink: 'https://wa.me/5355609099?text=Hola%2C%20quiero%20inscribirme%20al%20evento%20Bootcamp%20Emprendedor'
  },
  {
    title: 'Taller de Transformación Digital',
    status: 'Próximamente',
    date: 'Marzo 2025',
    description: 'Aprende a implementar tecnología en tu negocio para optimizar procesos y reducir costos.',
    whatsappLink: 'https://wa.me/5355609099?text=Hola%2C%20quiero%20inscribirme%20al%20evento%20Taller%20de%20Transformación%20Digital'
  }
];

const galleryItems = [
  { title: 'Taller de Gestión Financiera', date: 'Octubre 2024', description: 'Capacitación intensiva para emprendedores.', icon: 'document' },
  { title: 'Seminario de Marketing Digital', date: 'Septiembre 2024', description: 'Estrategias para redes sociales.', icon: 'info' },
  { title: 'Networking Empresarial', date: 'Agosto 2024', description: 'Encuentro de emprendedores locales.', icon: 'people' },
  { title: 'Workshop Excel Avanzado', date: 'Julio 2024', description: 'Automatización y análisis de datos.', icon: 'chart' },
  { title: 'Lanzamiento Programa PyMEs', date: 'Junio 2024', description: 'Presentación de nuevos servicios.', icon: 'bolt' },
  { title: 'Graduación Primer Grupo', date: 'Mayo 2024', description: 'Certificación de participantes.', icon: 'graduation' }
];

export function EventsPage() {
  return (
    <>
      {/* Current Events Section */}
      <section style={{ paddingTop: '7rem' }}>
        <div className="container">
          <div className="section-title">
            <h2>Eventos Actuales</h2>
            <p>Capacitaciones y actividades en curso</p>
          </div>
          
          <div className="bento-grid">
            {currentEvents.map((event, index) => (
              <BentoCard key={index}>
                <h3>{event.title}</h3>
                <div>
                  <span className="event-status-tag">{event.status}</span>
                  <span className="event-date-tag">{event.date}</span>
                </div>
                <p>{event.description}</p>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="alt-bg">
        <div className="container">
          <div className="section-title">
            <h2>Próximos Eventos</h2>
            <p>No te pierdas nuestras próximas capacitaciones</p>
          </div>
          
          <div className="bento-grid">
            {upcomingEvents.map((event, index) => (
              <BentoCard key={index}>
                <h3>{event.title}</h3>
                <div>
                  <span className="event-status-tag" style={{ background: 'var(--accent)' }}>{event.status}</span>
                  <span className="event-date-tag">{event.date}</span>
                </div>
                <p>{event.description}</p>
                <a 
                  href={event.whatsappLink} 
                  className="btn-consult" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Inscribirme
                </a>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Gallery */}
      <section>
        <div className="container">
          <div className="section-title">
            <h2>Mini Galería</h2>
            <p>Revive los mejores momentos</p>
          </div>
          
          <div className="gallery-grid">
            {galleryItems.map((item, index) => (
              <div key={index} className="gallery-item">
                <div className="placeholder-img">
                  <Icon 
                    name={item.icon} 
                    style={{ width: '64px', height: '64px', color: 'var(--white)' }} 
                  />
                </div>
                <div className="gallery-content">
                  <h4>{item.title}</h4>
                  <p>{item.date} - {item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="container text-center">
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>¿Listo para transformar tu negocio?</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>Agenda una cita y descubre cómo podemos ayudarte a alcanzar tus metas.</p>
          <a 
            href="https://wa.me/5355609099?text=Hola%2C%20me%20gustaría%20agendar%20una%20cita%20para%20consultoría" 
            className="hero-cta" 
            style={{ background: '#25D366', color: 'var(--white)' }}
            target="_blank" 
            rel="noopener noreferrer"
          >
            Agenda tu cita
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}

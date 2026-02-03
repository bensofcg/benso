import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BentoCard, FAQAccordion, Icon } from '../components';

const faqItems = [
  {
    question: '¿Cómo funciona la primera consulta?',
    answer: 'La primera consulta es gratuita. Agendamos una videollamada de 30 minutos para conocer tu negocio, entender tus desafíos y explicarte cómo podemos ayudarte. No hay compromiso y recibirás recomendaciones iniciales sin costo.'
  },
  {
    question: '¿Trabajan con negocios de cualquier tamaño?',
    answer: 'Nos especializamos en PyMEs y emprendimientos. Si tienes un negocio pequeño o mediano, somos la opción ideal. Nuestros servicios están diseñados específicamente para las necesidades y presupuestos de este tipo de empresas.'
  },
  {
    question: '¿Cuánto tiempo toma ver resultados?',
    answer: 'Depende del servicio contratado. Generalmente, comenzarás a ver mejoras en los primeros 30-60 días de trabajo conjunto. En capacitaciones, el impacto puede ser inmediato al aplicar los conocimientos adquiridos.'
  },
  {
    question: '¿Ofrecen planes de pago?',
    answer: 'Sí, ofrecemos opciones de financiamiento y planes de pago flexibles para que puedas acceder a nuestros servicios. Consultanos por las opciones disponibles según el servicio que te interese.'
  },
  {
    question: '¿Qué incluye el diagnóstico empresarial?',
    answer: 'Incluye análisis FODA completo, revisión de procesos operativos, análisis financiero, identificación de áreas de mejora y un plan de acción personalizado con recomendaciones específicas para tu negocio.'
  },
  {
    question: '¿Trabajan de forma presencial o remota?',
    answer: 'Ofrecemos ambas modalidades. Podemos trabajar de forma remota mediante videollamadas y herramientas digitales, o presencial según tu ubicación y preferencia. La mayoría de nuestros servicios pueden realizarse completamente online.'
  }
];

const services = [
  {
    title: 'Formación Empresarial',
    tags: ['Capacitación', 'Consultar precio'],
    description: 'Programas de capacitación diseñados para desarrollar las habilidades digitales y financieras de tu equipo.',
    icon: 'document',
    whatsappLink: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Formación%20Empresarial'
  },
  {
    title: 'Consultoría Personalizada',
    tags: ['Asesoramiento', 'Consultar precio'],
    description: 'Análisis profundo de tu negocio con estrategias personalizadas para maximizar tu rentabilidad.',
    icon: 'info',
    whatsappLink: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Consultoría%20Personalizada'
  },
  {
    title: 'Soluciones a Medida',
    tags: ['Herramientas Digitales', 'Consultar precio'],
    description: 'Desarrollo de herramientas digitales personalizadas que automatizan y optimizan tus procesos.',
    icon: 'computer',
    whatsappLink: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Soluciones%20a%20Medida'
  }
];

const events = [
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
  }
];

const testimonials = [
  {
    quote: 'Benso transformó nuestra gestión financiera completamente. En solo tres meses logramos optimizar nuestros costos operativos en un 30% y mejorar nuestro flujo de caja significativamente.',
    author: 'María González',
    position: 'CEO, Logística Global'
  },
  {
    quote: 'La capacitación que recibió nuestro equipo fue excepcional. Los conceptos complejos se explicaron de manera clara y práctica. Ahora tenemos herramientas concretas para crecer.',
    author: 'Carlos Ramírez',
    position: 'Director, Tech Innovations'
  },
  {
    quote: 'El diagnóstico empresarial que nos brindaron fue revelador. Identificaron oportunidades que no habíamos considerado y nos dieron un plan de acción claro para implementar.',
    author: 'Ana Patricia Silva',
    position: 'Fundadora, Consultoría Empresarial Plus'
  }
];

const words = ['Rentabilidad', 'Crecimiento', 'Futuro'];

export function HomePage() {
  const [rotatingWord, setRotatingWord] = useState('Rentabilidad');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingWord(prev => {
        const currentIndex = words.indexOf(prev);
        return words[(currentIndex + 1) % words.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>BENSO</h1>
            <p className="slogan">
              Consultoría y Soluciones Digitales para la{' '}
              <span className="rotating-text">{rotatingWord}</span>{' '}
              Sostenible
            </p>
            <Link to="/contacto" className="hero-cta">
              Agendar cita
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section>
        <div className="container">
          <div className="section-title">
            <h2>Nuestros Servicios</h2>
            <p>Soluciones integrales para potenciar tu negocio</p>
          </div>
          
          <div className="bento-grid">
            {services.map((service, index) => (
              <BentoCard key={index} className="service-card">
                <Icon name={service.icon} />
                <h3>{service.title}</h3>
                <div>
                  {service.tags.map((tag, i) => (
                    <span key={i} className="category-tag">{tag}</span>
                  ))}
                </div>
                <p>{service.description}</p>
                <a 
                  href={service.whatsappLink} 
                  className="btn-consult" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Solicitar servicio
                </a>
              </BentoCard>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/servicios" className="hero-cta" style={{ background: 'var(--primary)', color: 'var(--white)' }}>
              Ver Todos los Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Current Events Section */}
      <section className="alt-bg">
        <div className="container">
          <div className="section-title">
            <h2>Próximos Eventos</h2>
            <p>Próximas capacitaciones y actividades</p>
          </div>
          
          <div className="bento-grid">
            {events.map((event, index) => (
              <BentoCard key={index}>
                <h3>{event.title}</h3>
                <div>
                  <span className="event-status-tag">{event.status}</span>
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
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/eventos" className="hero-cta" style={{ background: 'var(--primary)', color: 'var(--white)' }}>
              Ver Más Eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <div className="container">
          <div className="section-title">
            <h2>Lo que dicen nuestros clientes</h2>
            <p>Testimonios reales de empresas que han confiado en nosotros</p>
          </div>
          
          <div className="bento-grid">
            {testimonials.map((testimonial, index) => (
              <BentoCard key={index} className="testimonial-card">
                <div className="testimonial-quote">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="quote-icon">
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" fill="currentColor"/>
                  </svg>
                </div>
                <p>"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.position}</span>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div className="container">
          <div className="section-title">
            <h2>Preguntas Frecuentes</h2>
            <p>Encuentra respuestas a las dudas más comunes</p>
          </div>
          
          <FAQAccordion items={faqItems} />
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

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BentoCard, Icon, FAQAccordion, ScrollReveal, StatusIcon, CalendarIcon } from '../components';
import { useCart } from '../hooks/useCart';
import faqItems from '../data/faqs.json';
import servicesData from '../data/services.json';
import productsData from '../data/products.json';
import eventsData from '../data/events.json';
import testimonials from '../data/testimonials.json';

const services = servicesData.featured;
const events = eventsData.upcoming.slice(0, 2);

const brands = ['AfroDiSíAcá', 'Estilo Natural', 'Marayosva', 'Sarandonga', "D'Sara", "Divas'Store"];

const featuredProducts = [
  productsData.find(p => p.category === 'pegatinas'),
  productsData.find(p => p.category === 'lonas'),
  productsData.find(p => p.category === 'tarjetas'),
].filter(Boolean) as typeof productsData;

export function HomePage() {
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrollIndicatorHidden(true);
      } else {
        setScrollIndicatorHidden(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Asesoramiento, Herramientas y Capacitación para Emprendedores</h1>
            <p className="slogan">
              Te enseñamos cómo posicionar un negocio y te acompañamos en cada paso del camino
            </p>
            <div className="hero-buttons">
              <Link to="/nosotros" className="hero-cta-outline">
                Sobre nosotros
              </Link>
              <Link to="/contacto" className="hero-cta">
                Agendar cita gratis
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className={`scroll-down-indicator${scrollIndicatorHidden ? ' hidden' : ''}`} aria-hidden="true">
          <span className="scroll-down-text">Desliza</span>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* Brands Marquee Section */}
      <ScrollReveal>
        <div className="container">
          <div className="section-title">
            <h2>Emprendimientos que confían en nosotros</h2>
          </div>
        </div>
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[...brands, ...brands].map((brand, index) => (
              <div key={index} className="marquee-item">{brand}</div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Services Preview Section */}
      <ScrollReveal>
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
                <p>{service.description}</p>
                <span className="card-price">{service.price}</span>
                <div className="card-actions">
                  <a 
                    href={service.whatsappLink} 
                    className="btn-consult" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Solicitar servicio
                  </a>
                  <button
                    className="btn-add-cart"
                    onClick={() => addItem(service.title, service.price.replace(/[^0-9.,]/g, ''))}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    Añadir
                  </button>
                </div>
              </BentoCard>
            ))}
          </div>
          <div className="section-text-cta">
            <Link to="/servicios" className="text-cta-link">
              Ver Todos los Servicios →
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Featured Products Section */}
      <ScrollReveal className="alt-bg">
        <div className="container">
          <div className="section-title">
            <h2>Productos Destacados</h2>
            <p>Impresión profesional para potenciar tu marca</p>
          </div>
          
          <div className="bento-grid">
            {featuredProducts.map((product, index) => (
              <BentoCard key={index} className="service-card">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <span className="card-price">{product.price} CUP</span>
                <div className="card-actions">
                  <a 
                    href={product.whatsappLink} 
                    className="btn-consult" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Solicitar producto
                  </a>
                  <button
                    className="btn-add-cart"
                    onClick={() => addItem(product.title, product.price.replace(/[^0-9.,]/g, ''))}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    Añadir
                  </button>
                </div>
              </BentoCard>
            ))}
          </div>
          <div className="section-text-cta">
            <Link to="/productos" className="text-cta-link">
              Ver más →
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Current Events Section */}
      <ScrollReveal className="alt-bg">
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
                  <span className="event-status-tag"><StatusIcon status={event.status} />{event.status}</span>
                  <span className="event-date-tag">
                    <CalendarIcon />
                    {event.date}
                  </span>
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
          <div className="section-text-cta">
            <Link to="/eventos" className="text-cta-link">
              Ver Más Eventos →
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Testimonials Section */}
      <ScrollReveal>
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
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal>
        <div className="container">
          <div className="section-title">
            <h2>Preguntas Frecuentes</h2>
            <p>Encuentra respuestas a las dudas más comunes</p>
          </div>
          
          <FAQAccordion items={faqItems} />
        </div>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal>
        <div className="container text-center">
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>¿Listo para transformar tu negocio?</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>Agenda una cita y descubre cómo podemos ayudarte a alcanzar tus metas.</p>
          <a 
            href="https://wa.me/5355609099?text=Hola%2C%20me%20gustaría%20agendar%20una%20cita%20para%20consultoría" 
            className="cta-whatsapp" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
            </svg>
            Agendar cita
          </a>
        </div>
      </ScrollReveal>
    </>
  );
}

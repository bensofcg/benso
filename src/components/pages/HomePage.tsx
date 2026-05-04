'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Send, Calendar, Ticket } from 'lucide-react';
import { BentoCard, Icon, FAQAccordion, ScrollReveal, AnimatedCard, AnimatedSection, StatusIcon, CalendarIcon, PriceDisplay, RequestModal, ShinyText, LogoLoop, Grainient, ProductsGridSkeleton, ServicesGridSkeleton, EventsGridSkeleton } from '@/components';
import TestimonialsLoop from '@/components/TestimonialsLoop';
import { useCart } from '@/hooks/useCart';
import { useProductos, useServicios, useEventos } from '@/hooks/useData';
import faqItems from '@/data/faqs.json';
import testimonials from '@/data/testimonials.json';

// Placeholder images for products
const PLACEHOLDER_IMAGES: Record<string, string> = {
  pegatinas: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=180&fit=crop',
  posters: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&h=180&fit=crop',
  cuadros: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&h=180&fit=crop',
  tarjetas: 'https://images.unsplash.com/photo-1607013407639-82f999279328?w=600&h=180&fit=crop',
  lonas: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=180&fit=crop',
  otros: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=180&fit=crop',
};

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=180&fit=crop';

function getProductImage(category: string, productImage: string): string {
  if (productImage && productImage.trim() !== '') {
    return productImage;
  }
  return PLACEHOLDER_IMAGES[category] || DEFAULT_PLACEHOLDER;
}

interface RequestItem {
  title: string;
  price: string;
  priceNum: number;
  whatsappLink: string;
  type: 'servicio' | 'producto' | 'evento';
}

export function HomePage() {
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const [requestItem, setRequestItem] = useState<RequestItem | null>(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const { addItem } = useCart();
  const { productos, loading: productosLoading } = useProductos();
  const { servicios, loading: serviciosLoading } = useServicios();
  const { eventos, loading: eventosLoading } = useEventos();

  const openRequest = (item: RequestItem) => {
    setRequestItem(item);
    setIsRequestOpen(true);
  };

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

  const featuredProducts = productos
    .filter(p => p.popular)
    .slice(0, 3);

  const upcomingEvents = eventos
    .filter(e => e.status === 'Proximamente')
    .slice(0, 2);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-grainient-bg">
          <Grainient className="absolute inset-0" />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content">
            <h1>
              <span>Asesoramiento, Herramientas y Capacitación para</span>{' '}
              <span className="hero-highlight">
                Emprendedores
              </span>
            </h1>
            <p className="slogan">
              Te enseñamos cómo posicionar un negocio y te acompañamos en cada paso del camino
            </p>
            <div className="hero-buttons">
              <Link href="/contacto" className="hero-cta">
                Agendar cita gratis
              </Link>
              <Link href="/nosotros" className="hero-cta-outline">
                Sobre nosotros
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
            <h2 style={{ margin: 0, color: 'var(--primary)', marginBottom: '1rem' }}>
              Emprendimientos que confían en nosotros
            </h2>
          </div>
        </div>
<LogoLoop
            logos={[
              { node: <img src="/benso/assets/logos/MARAYOSVA (1).svg" alt="MARAYOSVA" /> },
              { node: <img src="/benso/assets/logos/Info Impress.svg" alt="Info Impress" /> },
              { node: <img src="/benso/assets/logos/Divas'Store.svg" alt="Divas Store" /> },
              { node: <img src="/benso/assets/logos/Estilo Natural3.svg" alt="Estilo Natural" /> },
              { node: <img src="/benso/assets/logos/AfroDiSiAcá .svg" alt="AfroDiSiAcá" /> },
            ]}
            direction="left"
            speed={50}
          />
      </ScrollReveal>

      {/* Services Preview Section */}
      <ScrollReveal>
        <div className="container">
          <div className="section-title">
            <h2>Nuestros servicios</h2>
            <Link href="/servicios" className="text-cta-link">
              Ver todos →
            </Link>
          </div>
          
          {serviciosLoading ? (
            <ServicesGridSkeleton count={3} />
          ) : (
          <div className="bento-grid bento-grid-center">
            {servicios.slice(0, 3).map((service, index) => (
              <AnimatedCard key={service.id} index={index}>
                <BentoCard className="interactive-card service-card">
                  <div className="service-card-header">
                    <Icon name={service.icon} />
                    <h3>{service.title}</h3>
                  </div>
                  <p>{service.description}</p>
                  <span className="card-price"><PriceDisplay price={service.price} priceNum={service.price_num} /></span>
                  <div className="card-actions">
                    <button
                      className="btn-add-cart btn-add-cart-full"
                      onClick={() => addItem(service.title, String(service.price_num))}
                    >
                      <ShoppingCart size={16} />
                      <span>Añadir al carrito</span>
                    </button>
                  </div>
                </BentoCard>
              </AnimatedCard>
            ))}
          </div>
          )}
        </div>
      </ScrollReveal>

{/* Featured Products Section */}
      <ScrollReveal>
        <div className="container">
          <div className="section-title">
            <h2>Productos destacados</h2>
            <Link href="/productos" className="text-cta-link">
              Ver más →
            </Link>
          </div>
          
          {productosLoading ? (
            <ProductsGridSkeleton count={3} />
          ) : (
          <div className="bento-grid bento-grid-center">
            {featuredProducts.map((product, index) => (
              <AnimatedCard key={product.id} index={index}>
                <BentoCard className="interactive-card service-card">
                  {product.popular && <span className="popular-badge">Más popular</span>}
                  <div className="product-image-container">
                    <img src={getProductImage(product.category, product.image)} alt={product.title} loading="lazy" />
                  </div>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <span className="card-price"><PriceDisplay price={product.price} priceNum={product.price_num} /></span>
                  <div className="card-actions">
                    <button
                      className="btn-add-cart btn-add-cart-full"
                      onClick={() => addItem(product.title, String(product.price_num))}
                    >
                      <ShoppingCart size={16} />
                      <span>Añadir al carrito</span>
                    </button>
                  </div>
                </BentoCard>
              </AnimatedCard>
))}
          </div>
          )}
        </div>
      </ScrollReveal>

{/* Current Events Section */}
      <ScrollReveal>
        <div className="container">
          <div className="section-title">
            <h2>Próximos eventos</h2>
            <Link href="/eventos" className="text-cta-link">
              Ver más →
            </Link>
          </div>
          
          {eventosLoading ? (
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

{/* Testimonials Section */}
      <ScrollReveal>
        <div className="container">
          <div className="section-title">
            <h2>Lo que dicen nuestros clientes</h2>
          </div>

          <div className="testimonials-section">
            {/* Fila 1: primeros 4 testimonios */}
            <TestimonialsLoop testimonials={testimonials.slice(0, 4)} direction="left" speed={50} />
            {/* Fila 2: últimos 3 testimonios */}
            <TestimonialsLoop testimonials={testimonials.slice(4)} direction="right" speed={50} />
          </div>
        </div>
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal>
        <div className="container">
          <div className="section-title-center">
            <h2 style={{ margin: 0, color: 'var(--primary)' }}>
              Preguntas Frecuentes
            </h2>
          </div>
          
          <AnimatedSection>
            <FAQAccordion items={faqItems} />
          </AnimatedSection>
        </div>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal>
        <div className="container section-cta">
          <h2>¿Listo para transformar tu negocio?</h2>
          <p>Agenda una cita y descubre cómo podemos ayudarte a alcanzar tus metas.</p>
          <a
            href="/contacto"
            className="cta-button"
          >
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

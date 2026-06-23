'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Send, Calendar, Ticket } from 'lucide-react';
import { BentoCard, Icon, FAQAccordion, ScrollReveal, AnimatedCard, AnimatedSection, StatusIcon, CalendarIcon, PriceDisplay, RequestModal, LogoLoop, ProductsGridSkeleton, ServicesGridSkeleton, EventsGridSkeleton } from '@/components';
import Grainient from '@/components/Grainient';
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
              <button
                className="hero-cta"
                onClick={() => {
                  setRequestItem({ title: 'Cita de consulta', price: '', priceNum: 0, whatsappLink: '', type: 'servicio' });
                  setIsRequestOpen(true);
                }}
              >
                Agendar cita gratis
              </button>
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

      {/* ✨ HIDDEN — Brands Marquee Section (restore by removing the comment wrapper)
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
      */}

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
                  {product.popular && <div className="popular-sticker">
                    <svg viewBox="0 0 1280 1280" xmlns="http://www.w3.org/2000/svg">
                      <g transform="translate(0,1280) scale(0.1,-0.1)" fill="currentColor">
                        <path d="M6790 12340 c-228 -253 -418 -458 -422 -457 -4 1 -195 205 -424 452 -229 248 -417 451 -419 453 -2 2 -130 -245 -285 -547 -155 -303 -286 -551 -291 -551 -6 0 -242 146 -526 325 -284 179 -519 322 -523 318 -4 -4 -12 -30 -17 -58 -6 -27 -64 -295 -128 -595 -65 -300 -118 -546 -120 -548 -4 -4 17 -10 -636 192 -295 91 -541 166 -545 166 -5 0 5 -278 22 -617 17 -340 30 -619 29 -621 -2 -2 -110 1 -241 7 -132 6 -365 15 -519 21 -154 5 -327 12 -384 15 -82 5 -102 3 -99 -7 31 -81 379 -1171 375 -1174 -4 -5 -174 -44 -972 -224 -126 -29 -231 -54 -233 -55 -2 -1 149 -237 334 -524 185 -287 335 -523 333 -525 -2 -2 -251 -133 -552 -291 -301 -159 -544 -292 -540 -296 4 -4 211 -190 458 -414 248 -223 450 -411 450 -415 0 -5 -202 -196 -448 -424 -247 -228 -447 -418 -446 -423 1 -4 246 -133 543 -285 297 -152 542 -281 544 -287 2 -5 -143 -243 -323 -527 -179 -285 -322 -521 -318 -524 4 -4 148 -37 318 -73 541 -116 880 -189 883 -192 4 -4 2 -9 -213 -704 -80 -260 -144 -476 -140 -479 5 -6 1126 44 1198 53 31 4 37 2 37 -12 0 -10 -11 -290 -24 -623 -14 -333 -23 -606 -22 -607 1 -2 76 22 167 52 90 29 292 95 449 145 157 51 347 112 423 137 76 25 141 43 143 40 3 -2 66 -274 141 -603 75 -330 137 -600 138 -602 2 -2 237 149 524 334 287 185 523 335 525 333 2 -2 133 -250 292 -552 226 -430 291 -545 300 -535 6 7 193 213 414 458 221 245 406 445 411 445 5 0 167 -171 360 -380 194 -209 382 -413 420 -453 l67 -72 282 551 c222 432 286 550 299 546 9 -2 245 -149 525 -326 281 -177 513 -318 517 -314 3 5 22 85 42 178 87 410 220 1020 222 1023 4 4 1 5 687 -207 267 -83 490 -151 495 -151 4 0 -6 278 -23 618 -17 339 -30 618 -29 620 1 1 281 -9 621 -22 340 -13 620 -23 621 -22 1 1 -20 69 -47 151 -169 517 -330 1028 -326 1032 4 4 250 61 951 219 138 31 251 58 253 59 2 2 -148 238 -333 525 -186 286 -336 523 -334 524 2 2 250 133 552 292 431 227 545 290 535 300 -7 6 -213 193 -458 414 -245 221 -445 406 -445 411 0 5 201 194 446 421 245 227 447 417 448 422 1 5 -242 134 -541 287 -417 214 -543 283 -542 296 1 10 146 247 323 527 177 280 318 513 314 517 -7 6 -280 66 -1033 226 -91 19 -167 37 -168 38 -4 4 21 86 232 767 69 223 126 409 126 412 0 10 -153 5 -700 -23 -294 -15 -536 -27 -538 -26 -1 1 9 280 22 621 14 340 23 620 22 621 -1 2 -63 -17 -137 -42 -388 -128 -1042 -335 -1046 -332 -2 3 -65 274 -140 603 -75 330 -137 600 -138 602 -2 2 -238 -148 -525 -333 -286 -186 -522 -336 -524 -334 -2 2 -124 234 -271 514 -147 281 -278 527 -289 547 l-22 37 -414 -459z"/>
                      </g>
                    </svg>
                    <span>Popular</span>
                  </div>}
                  <div className="product-image-container">
                    <Image src={getProductImage(product.category, product.image)} alt={product.title} width={600} height={180} loading="lazy" unoptimized />
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

      <ScrollReveal>
        <div className="container section-cta">
          <h2>¿Listo para transformar tu negocio?</h2>
          <p>Agenda una cita y descubre cómo podemos ayudarte a alcanzar tus metas.</p>
          <button
            className="cta-button"
            onClick={() => {
              setRequestItem({ title: 'Cita de consulta', price: '', priceNum: 0, whatsappLink: '', type: 'servicio' });
              setIsRequestOpen(true);
            }}
          >
            <Calendar size={18} />
            Agendar cita
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

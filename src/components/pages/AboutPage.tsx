'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { BentoCard, Icon, ScrollReveal, AnimatedCard, ShinyText, RequestModal } from '@/components';

interface RequestItem {
  title: string;
  price: string;
  priceNum: number;
  whatsappLink: string;
  type: 'servicio' | 'producto' | 'evento';
}

const values = [
  { title: 'Ética', icon: 'star' },
  { title: 'Profesionalismo', icon: 'bolt' },
  { title: 'Innovación', icon: 'info' },
  { title: 'Compromiso con el Cliente', icon: 'heart' },
  { title: 'Aprendizaje Continuo', icon: 'document' }
];

const coloredCardStyle = {
  primary: { background: 'var(--primary)', color: 'var(--white)', textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
  secondary: { background: 'var(--secondary)', color: 'var(--white)', textShadow: '0 1px 2px rgba(0,0,0,0.2)' },
  accent: { background: 'var(--accent)', color: 'var(--white)', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }
};

const whiteH3Style = { color: 'var(--white)', textShadow: '0 1px 2px rgba(0,0,0,0.3)' };
const whitePStyle = { color: 'var(--white)', textShadow: '0 1px 2px rgba(0,0,0,0.2)' };
const whiteIconStyle = { color: 'var(--white)', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' };

export function AboutPage() {
  const [requestItem, setRequestItem] = useState<RequestItem | null>(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  return (
    <>
      <ScrollReveal>
        <div className="container">
          <div className="section-title page-intro-title">
            <h2>Sobre nosotros</h2>
          </div>
          
          <div className="bento-grid mission-vision-grid">
            <AnimatedCard>
              <BentoCard className="horizontal-card" style={coloredCardStyle.primary as any}>
                <Icon name="starFilled" style={whiteIconStyle} />
                <div className="horizontal-card-text">
                  <h3 style={{ ...whiteH3Style, fontSize: '1.5rem' }}>Nuestra Misión</h3>
                  <p style={{ ...whitePStyle, fontSize: '1.05rem', lineHeight: 1.8 }}>
                    El Proyecto Benso ofrece servicios profesionales de asesoramiento, herramientas y capacitación estratégica para impulsar la rentabilidad de emprendimientos en cualquier sector. Nos especializamos en áreas tales como la contabilidad, el marketing digital y la automatización de procesos.
                  </p>
                </div>
              </BentoCard>
            </AnimatedCard>

            <AnimatedCard index={1}>
              <BentoCard className="horizontal-card" style={coloredCardStyle.secondary as any}>
                <Icon name="globe" style={whiteIconStyle} />
                <div className="horizontal-card-text">
                  <h3 style={{ ...whiteH3Style, fontSize: '1.5rem' }}>Nuestra Visión</h3>
                  <p style={{ ...whitePStyle, fontSize: '1.05rem', lineHeight: 1.8 }}>
                    Aspiramos a convertirnos en el primer referente para aquellas empresas que persiguen la calidad, la excelencia y el crecimiento sostenible.
                  </p>
                </div>
              </BentoCard>
            </AnimatedCard>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="container">
          <div className="section-title">
            <h2>Nuestros valores</h2>
          </div>
          
          <div className="bento-grid">
            {values.map((value, index) => (
              <AnimatedCard key={index} index={index}>
                <BentoCard className="horizontal-card">
                  <Icon name={value.icon} />
                  <div className="horizontal-card-text">
                    <h3>{value.title}</h3>
                  </div>
                </BentoCard>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="container">
          <div className="section-title">
            <h2>¿Por qué elegirnos?</h2>
          </div>
          
          <div className="bento-grid">
            <AnimatedCard>
              <BentoCard style={coloredCardStyle.secondary as any}>
                <Icon name="money" style={whiteIconStyle} />
                <h3 style={whiteH3Style}>Inversión Accesible</h3>
                <p style={whitePStyle}>Ofrecemos servicios de máxima calidad con facilidades de pago justas y personalizables.</p>
              </BentoCard>
            </AnimatedCard>
            
            <AnimatedCard index={1}>
              <BentoCard style={coloredCardStyle.accent as any}>
                <Icon name="people" style={whiteIconStyle} />
                <h3 style={whiteH3Style}>Atención Personalizada</h3>
                <p style={whitePStyle}>Nuestro asesoramiento se basa en conocer tu negocio en profundidad y ajustar las estrategias a tu realidad única.</p>
              </BentoCard>
            </AnimatedCard>
            
            <AnimatedCard index={2}>
              <BentoCard style={coloredCardStyle.primary as any}>
                <Icon name="check" style={whiteIconStyle} />
                <h3 style={whiteH3Style}>Acompañamiento Continuo</h3>
                <p style={whitePStyle}>Te mostramos el camino y te acompañamos en cada paso de la implementación.</p>
              </BentoCard>
            </AnimatedCard>
            
            <AnimatedCard index={3}>
              <BentoCard style={coloredCardStyle.secondary as any}>
                <Icon name="chart" style={whiteIconStyle} />
                <h3 style={whiteH3Style}>Resultados Medibles</h3>
                <p style={whitePStyle}>Medimos el rendimiento de nuestras estrategias por el impacto real que tengan sobre tu proyecto.</p>
              </BentoCard>
            </AnimatedCard>
          </div>
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

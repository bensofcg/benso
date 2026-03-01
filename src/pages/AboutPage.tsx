import { BentoCard, Icon, ScrollReveal } from '../components';

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
  return (
    <>
      {/* Sobre Nosotros - Mission & Vision */}
      <ScrollReveal style={{ paddingTop: '7rem' }}>
        <div className="container">
          <div className="section-title">
            <h2>Sobre Nosotros</h2>
            <p>Empoderamos a PyMEs con soluciones digitales y estrategias para lograr una rentabilidad sostenible.</p>
          </div>
          
          <div className="bento-grid">
            <BentoCard className="horizontal-card" style={coloredCardStyle.primary}>
              <Icon name="starFilled" style={whiteIconStyle} />
              <div className="horizontal-card-text">
                <h3 style={{ ...whiteH3Style, fontSize: '2rem' }}>Nuestra Misión</h3>
                <p style={{ ...whitePStyle, fontSize: '1.1rem', lineHeight: 1.9 }}>
                  El Proyecto Benso ofrece servicios profesionales de asesoramiento, herramientas y capacitación estratégica para impulsar la rentabilidad de emprendimientos en cualquier sector. Nos especializamos en áreas tales como la contabilidad, el marketing digital y la automatización de procesos.
                </p>
              </div>
            </BentoCard>

            <BentoCard className="horizontal-card" style={coloredCardStyle.secondary}>
              <Icon name="globe" style={whiteIconStyle} />
              <div className="horizontal-card-text">
                <h3 style={whiteH3Style}>Nuestra Visión</h3>
                <p style={{ ...whitePStyle, fontSize: '1.1rem', lineHeight: 1.9 }}>
                  Aspiramos a convertirnos en el primer referente para aquellas empresas que persiguen la calidad, la excelencia y el crecimiento sostenible.
                </p>
              </div>
            </BentoCard>
          </div>
        </div>
      </ScrollReveal>

      {/* Values Section */}
      <ScrollReveal>
        <div className="container">
          <div className="section-title">
            <h2>Nuestros Valores</h2>
          </div>
          
          <div className="bento-grid">
            {values.map((value, index) => (
              <BentoCard key={index} className="horizontal-card">
                <Icon name={value.icon} />
                <div className="horizontal-card-text">
                  <h3>{value.title}</h3>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Diferenciación Section */}
      <ScrollReveal className="alt-bg">
        <div className="container">
          <div className="section-title">
            <h2>¿Por qué elegirnos?</h2>
          </div>
          
          <div className="bento-grid">
            <BentoCard style={coloredCardStyle.secondary}>
              <Icon name="money" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Inversión Accesible</h3>
              <p style={whitePStyle}>Ofrecemos servicios de máxima calidad con facilidades de pago justas y personalizables.</p>
            </BentoCard>
            
            <BentoCard style={coloredCardStyle.accent}>
              <Icon name="people" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Atención Personalizada</h3>
              <p style={whitePStyle}>Nuestro asesoramiento se basa en conocer tu negocio en profundidad y ajustar las estrategias a tu realidad única.</p>
            </BentoCard>
            
            <BentoCard style={coloredCardStyle.primary}>
              <Icon name="check" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Soporte Continuo</h3>
              <p style={whitePStyle}>Te mostramos el camino y te acompañamos en cada paso de la implementación.</p>
            </BentoCard>
            
            <BentoCard style={coloredCardStyle.secondary}>
              <Icon name="chart" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Resultados Medibles</h3>
              <p style={whitePStyle}>Medimos el rendimiento de nuestras estrategias por el impacto real que tengan sobre tu proyecto.</p>
            </BentoCard>
          </div>
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

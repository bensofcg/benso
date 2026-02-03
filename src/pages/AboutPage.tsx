import { BentoCard, Icon } from '../components';

const values = [
  { title: 'Integridad', description: 'Actuamos con honestidad y transparencia en cada proyecto.', icon: 'star' },
  { title: 'Innovación', description: 'Buscamos nuevas formas de resolver problemas con agilidad.', icon: 'info' },
  { title: 'Compromiso con el Cliente', description: 'Cada cliente merece atención personalizada y dedicada.', icon: 'heart' },
  { title: 'Excelencia', description: 'Buscamos superar expectativas en cada proyecto.', icon: 'bolt' },
  { title: 'Responsabilidad Social', description: 'Promovemos prácticas sostenibles y éticas.', icon: 'leaf' },
  { title: 'Aprendizaje Continuo', description: 'Nos actualizamos para ofrecer las mejores soluciones.', icon: 'document' }
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
      {/* Mission Section */}
      <section style={{ paddingTop: '7rem' }}>
        <div className="container">
          <div className="section-title">
            <h2>Sobre Nosotros</h2>
            <p>Transformando negocios con consultoría de excelencia</p>
          </div>
          
          <div className="bento-grid">
            <BentoCard large style={coloredCardStyle.primary}>
              <Icon name="starFilled" style={whiteIconStyle} />
              <h3 style={{ ...whiteH3Style, fontSize: '2rem' }}>Nuestra Misión</h3>
              <p style={{ ...whitePStyle, fontSize: '1.1rem', lineHeight: 1.9 }}>
                Empoderar a PyMEs con soluciones digitales y estrategias para lograr rentabilidad sostenible.
              </p>
            </BentoCard>
            
            <BentoCard style={coloredCardStyle.secondary}>
              <Icon name="star" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Innovación</h3>
              <p style={whitePStyle}>Soluciones creativas que agregan valor real.</p>
            </BentoCard>
            
            <BentoCard style={coloredCardStyle.accent}>
              <Icon name="people" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Compromiso</h3>
              <p style={whitePStyle}>Tu éxito es nuestro éxito.</p>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="alt-bg">
        <div className="container">
          <div className="section-title">
            <h2>Nuestra Visión</h2>
            <p>Ser líderes en consultoría digital para PyMEs</p>
          </div>
          
          <div className="bento-grid">
            <BentoCard large style={coloredCardStyle.secondary}>
              <Icon name="info" style={{ ...whiteIconStyle, fontSize: '4rem' }} />
              <h3 style={whiteH3Style}>Excelencia Accesible</h3>
              <p style={{ ...whitePStyle, fontSize: '1.1rem', lineHeight: 1.9 }}>
                Alcanzar estándares de excelencia con un enfoque humanizado y accesible para PyMEs.
              </p>
            </BentoCard>
            
            <BentoCard style={coloredCardStyle.primary}>
              <Icon name="trending" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Crecimiento Sostenible</h3>
              <p style={whitePStyle}>Relaciones a largo plazo basadas en resultados tangibles.</p>
            </BentoCard>
            
            <BentoCard style={coloredCardStyle.accent}>
              <Icon name="globe" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Impacto Regional</h3>
              <p style={whitePStyle}>Expandir nuestra presencia llevando soluciones a más empresarios.</p>
            </BentoCard>
            
            <BentoCard style={coloredCardStyle.primary}>
              <Icon name="tools" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Tecnología de Punta</h3>
              <p style={whitePStyle}>A la vanguardia en herramientas y metodologías.</p>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section>
        <div className="container">
          <div className="section-title">
            <h2>Nuestros Valores</h2>
            <p>Principios que guían nuestras acciones</p>
          </div>
          
          <div className="bento-grid">
            {values.map((value, index) => (
              <BentoCard key={index}>
                <Icon name={value.icon} />
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciación Section */}
      <section className="alt-bg">
        <div className="container">
          <div className="section-title">
            <h2>Por Qué Elegirnos</h2>
            <p>Nuestro diferencial en el mercado</p>
          </div>
          
          <div className="bento-grid">
            <BentoCard large style={coloredCardStyle.primary}>
              <Icon name="info" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Enfoque en PyMEs</h3>
              <p style={{ ...whitePStyle, fontSize: '1.05rem', lineHeight: 1.9 }}>
                Entendemos los desafíos únicos de PyMEs. Cada estrategia está diseñada para tu realidad específica.
              </p>
            </BentoCard>
            
            <BentoCard style={coloredCardStyle.secondary}>
              <Icon name="money" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Inversión Accesible</h3>
              <p style={whitePStyle}>Servicios de calidad a precios justos para PyMEs.</p>
            </BentoCard>
            
            <BentoCard style={coloredCardStyle.accent}>
              <Icon name="people" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Atención Personalizada</h3>
              <p style={whitePStyle}>Asesor dedicado que conoce tu negocio.</p>
            </BentoCard>
            
            <BentoCard style={coloredCardStyle.primary}>
              <Icon name="chart" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Resultados Medibles</h3>
              <p style={whitePStyle}>Indicadores claros e impacto real en tu rentabilidad.</p>
            </BentoCard>
            
            <BentoCard style={coloredCardStyle.secondary}>
              <Icon name="check" style={whiteIconStyle} />
              <h3 style={whiteH3Style}>Soporte Continuo</h3>
              <p style={whitePStyle}>Te acompañamos en cada solución implementada.</p>
            </BentoCard>
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
          </a>
        </div>
      </section>
    </>
  );
}

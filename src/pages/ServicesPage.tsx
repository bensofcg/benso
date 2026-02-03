import { useState } from 'react';
import { BentoCard, Icon } from '../components';

type CategoryFilter = 'all' | 'capacitacion' | 'asesoramiento' | 'herramientas';

interface Service {
  title: string;
  tags: string[];
  description: string;
  icon: string;
  category: CategoryFilter;
  large?: boolean;
  whatsappLink: string;
}

const services: Service[] = [
  {
    title: 'Gestión Financiera para PyMEs',
    tags: ['Capacitación', 'Consultar precio'],
    description: 'Aprende a gestionar las finanzas de tu negocio de manera efectiva. Incluye control de flujo de caja, análisis de costos y planificación presupuestaria.',
    icon: 'money',
    category: 'capacitacion',
    whatsappLink: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Gestión%20Financiera%20para%20PyMEs'
  },
  {
    title: 'Marketing Digital Básico',
    tags: ['Capacitación', 'Consultar precio'],
    description: 'Domina las redes sociales y estrategias digitales para aumentar la visibilidad de tu negocio y captar más clientes.',
    icon: 'trending',
    category: 'capacitacion',
    whatsappLink: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Marketing%20Digital%20Básico'
  },
  {
    title: 'Excel Avanzado para Negocios',
    tags: ['Capacitación', 'Consultar precio'],
    description: 'Optimiza tu productividad con técnicas avanzadas de Excel aplicadas a la gestión empresarial.',
    icon: 'chart',
    category: 'capacitacion',
    whatsappLink: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Excel%20Avanzado%20para%20Negocios'
  },
  {
    title: 'Diagnóstico Empresarial Integral',
    tags: ['Asesoramiento', 'Consultar precio'],
    description: 'Analizamos a profundidad tu negocio para identificar áreas de mejora, oportunidades de crecimiento y estrategias para optimizar la rentabilidad. Incluye análisis FODA, revisión de procesos y plan de acción personalizado.',
    icon: 'globe',
    category: 'asesoramiento',
    large: true,
    whatsappLink: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Diagnóstico%20Empresarial%20Integral'
  },
  {
    title: 'Planificación Estratégica',
    tags: ['Asesoramiento', 'Consultar precio'],
    description: 'Definimos juntos los objetivos de tu negocio y diseñamos la ruta para alcanzarlos con indicadores claros y metas medibles.',
    icon: 'calendar',
    category: 'asesoramiento',
    whatsappLink: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Planificación%20Estratégica'
  },
  {
    title: 'Optimización de Costos',
    tags: ['Asesoramiento', 'Consultar precio'],
    description: 'Identificamos oportunidades para reducir gastos sin afectar la calidad, mejorando los márgenes de tu negocio.',
    icon: 'bolt',
    category: 'asesoramiento',
    whatsappLink: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Optimización%20de%20Costos'
  },
  {
    title: 'Dashboard de Control',
    tags: ['Herramientas Digitales', 'Consultar precio'],
    description: 'Panel de control personalizado para visualizar los indicadores clave de tu negocio en tiempo real.',
    icon: 'grid',
    category: 'herramientas',
    whatsappLink: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Dashboard%20de%20Control'
  },
  {
    title: 'Sistema de Gestión de Inventarios',
    tags: ['Herramientas Digitales', 'Consultar precio'],
    description: 'Herramienta digital para llevar el control de tu inventario, alertas de stock y reportes automáticos.',
    icon: 'box',
    category: 'herramientas',
    whatsappLink: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Sistema%20de%20Gestión%20de%20Inventarios'
  },
  {
    title: 'Automatización de Procesos',
    tags: ['Herramientas Digitales', 'Consultar precio'],
    description: 'Desarrollamos soluciones personalizadas para automatizar tareas repetitivas, integrar sistemas y optimizar el flujo de trabajo de tu empresa. Incluye análisis de procesos, desarrollo a medida e implementación.',
    icon: 'tools',
    category: 'herramientas',
    large: true,
    whatsappLink: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Automatización%20de%20Procesos'
  }
];

const filters: { label: string; value: CategoryFilter }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Capacitación', value: 'capacitacion' },
  { label: 'Asesoramiento', value: 'asesoramiento' },
  { label: 'Herramientas Digitales', value: 'herramientas' }
];

export function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredServices = services.filter(
    service => activeFilter === 'all' || service.category === activeFilter
  );

  return (
    <>
      {/* Services Section with Filters */}
      <section style={{ paddingTop: '7rem' }}>
        <div className="container">
          <div className="section-title">
            <h2>Nuestros Servicios</h2>
            <p>Filtra por categoría para encontrar lo que necesitas</p>
          </div>
          
          <div className="filter-container">
            {filters.map(filter => (
              <button
                key={filter.value}
                className={`filter-btn ${activeFilter === filter.value ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          
          <div className="bento-grid">
            {filteredServices.map((service, index) => (
              <BentoCard 
                key={index} 
                className="service-card"
                large={service.large}
                dataCategory={service.category}
              >
                <Icon name={service.icon} aria-label={`Icono de ${service.title}`} />
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

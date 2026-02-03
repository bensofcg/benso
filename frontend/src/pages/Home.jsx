const services = [
  {
    title: 'Formación Empresarial',
    desc: 'Programas de capacitación para desarrollar habilidades digitales y financieras.',
    tags: ['Capacitación', 'Consultar precio'],
    href: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Formación%20Empresarial',
  },
  {
    title: 'Consultoría Personalizada',
    desc: 'Estrategias personalizadas para maximizar tu rentabilidad.',
    tags: ['Asesoramiento', 'Consultar precio'],
    href: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Consultoría%20Personalizada',
  },
  {
    title: 'Soluciones a Medida',
    desc: 'Herramientas digitales que automatizan y optimizan procesos.',
    tags: ['Herramientas Digitales', 'Consultar precio'],
    href: 'https://wa.me/5355609099?text=Quiero%20solicitar%20el%20servicio%20de%20Soluciones%20a%20Medida',
  },
]

const eventos = [
  { title: 'Masterclass de E-commerce', status: 'Próximamente', date: 'Enero 2025' },
  { title: 'Bootcamp Emprendedor', status: 'Próximamente', date: 'Febrero 2025' },
]

const faqs = [
  { q: '¿Cómo funciona la primera consulta?', a: 'La primera consulta es gratuita: videollamada de 30 minutos sin compromiso.' },
  { q: '¿Trabajan con negocios de cualquier tamaño?', a: 'Nos especializamos en PyMEs y emprendimientos con planes flexibles.' },
  { q: '¿Cuánto tiempo toma ver resultados?', a: 'Suelen verse mejoras entre 30-60 días según el servicio contratado.' },
  { q: '¿Ofrecen planes de pago?', a: 'Sí, con opciones de financiamiento según el servicio.' },
]

const testimonios = [
  { quote: 'Benso transformó nuestra gestión financiera en 3 meses.', name: 'María González', role: 'CEO, Logística Global' },
  { quote: 'Capacitación excepcional y aplicable desde el primer día.', name: 'Carlos Ramírez', role: 'Director, Tech Innovations' },
  { quote: 'Diagnóstico revelador y plan de acción claro.', name: 'Ana Patricia Silva', role: 'Fundadora, Consultoría Empresarial Plus' },
]

function Home() {
  return (
    <div className="layout">
      <section className="hero">
        <div>
          <p className="pill">Consultoría & Innovación</p>
          <h1>BENSO</h1>
          <p>Consultoría y Soluciones Digitales para la rentabilidad sostenible.</p>
          <a className="cta" href="https://wa.me/5355609099?text=Hola,%20me%20gustaría%20agendar%20una%20cita">
            Agendar cita →
          </a>
        </div>
      </section>

      <div className="section-title">Servicios destacados</div>
      <div className="grid">
        {services.map((service) => (
          <div key={service.title} className="card">
            <h3>{service.title}</h3>
            <div className="tag-row">
              {service.tags.map((tag) => (
                <span key={tag} className="pill">{tag}</span>
              ))}
            </div>
            <p>{service.desc}</p>
            <a className="cta" href={service.href} target="_blank" rel="noopener">Solicitar servicio</a>
          </div>
        ))}
      </div>

      <div className="section-title">Próximos eventos</div>
      <div className="grid">
        {eventos.map((ev) => (
          <div key={ev.title} className="card">
            <h3>{ev.title}</h3>
            <div className="tag-row">
              <span className="pill">{ev.status}</span>
              <span className="pill">{ev.date}</span>
            </div>
            <a className="cta" href="https://wa.me/5355609099?text=Hola,%20quiero%20inscribirme">Inscribirme</a>
          </div>
        ))}
      </div>

      <div className="section-title">Testimonios</div>
      <div className="grid">
        {testimonios.map((t) => (
          <div key={t.name} className="card testimonial">
            <p>“{t.quote}”</p>
            <div>
              <strong>{t.name}</strong>
              <div><span>{t.role}</span></div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">Preguntas frecuentes</div>
      <div className="grid">
        {faqs.map((f) => (
          <details key={f.q} className="faq-item">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

export default Home

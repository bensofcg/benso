const servicios = [
  {
    title: 'Formación Empresarial',
    desc: 'Capacitaciones prácticas para equipos de negocio.',
    bullets: ['Workshops en vivo', 'Plantillas accionables', 'Soporte post sesión'],
  },
  {
    title: 'Consultoría Personalizada',
    desc: 'Diagnóstico y plan de acción para maximizar tu rentabilidad.',
    bullets: ['Análisis FODA', 'KPIs clave', 'Roadmap trimestral'],
  },
  {
    title: 'Soluciones a Medida',
    desc: 'Automatizaciones y herramientas digitales adaptadas a tu operación.',
    bullets: ['Integraciones', 'Dashboards', 'AI copilots operativos'],
  },
]

function Servicios() {
  return (
    <div className="layout">
      <div className="hero">
        <div>
          <p className="pill">Servicios</p>
          <h1>Soluciones que impulsan tu negocio</h1>
          <p>Elegimos la mejor combinación de consultoría, capacitación y tecnología para acelerar resultados.</p>
        </div>
      </div>

      <div className="grid">
        {servicios.map((s) => (
          <div key={s.title} className="card">
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <ul>
              {s.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <a className="cta" href="https://wa.me/5355609099?text=Quiero%20más%20información" target="_blank" rel="noopener">
              Hablar con un consultor
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Servicios

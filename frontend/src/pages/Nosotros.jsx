const valores = [
  { title: 'Ejecución ágil', desc: 'Iteramos rápido con entregables semanales y métricas claras.' },
  { title: 'Obsesión por el cliente', desc: 'Cada decisión se toma para mejorar tu rentabilidad sostenible.' },
  { title: 'Innovación aplicada', desc: 'Adoptamos IA y automatización donde genera impacto real.' },
]

function Nosotros() {
  return (
    <div className="layout">
      <div className="hero">
        <div>
          <p className="pill">Nosotros</p>
          <h1>Un equipo de estrategia y tecnología</h1>
          <p>Combinamos consultoría financiera, producto digital y datos para acompañar tu crecimiento.</p>
        </div>
      </div>

      <div className="section-title">Nuestros valores</div>
      <div className="grid">
        {valores.map((v) => (
          <div key={v.title} className="card">
            <h3>{v.title}</h3>
            <p>{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="section-title">Por qué Benso</div>
      <div className="two-col">
        <div className="card">
          <h3>Equipo senior</h3>
          <p>Consultores con experiencia en finanzas, growth y data.</p>
        </div>
        <div className="card">
          <h3>Stack moderno</h3>
          <p>Listo para incorporar UI kits como shadcn/ui y capacidades de IA generativa.</p>
        </div>
      </div>
    </div>
  )
}

export default Nosotros

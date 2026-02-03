const eventos = [
  { title: 'Masterclass de E-commerce', date: 'Enero 2025', status: 'Próximamente' },
  { title: 'Bootcamp Emprendedor', date: 'Febrero 2025', status: 'Próximamente' },
  { title: 'Taller de Finanzas para CEOs', date: 'Marzo 2025', status: 'Cupos limitados' },
]

function Galeria() {
  return (
    <div className="layout">
      <div className="hero">
        <div>
          <p className="pill">Eventos</p>
          <h1>Capacitaciones y experiencias</h1>
          <p>Agenda los próximos encuentros y recibe materiales exclusivos.</p>
        </div>
      </div>

      <div className="grid">
        {eventos.map((e) => (
          <div key={e.title} className="card">
            <h3>{e.title}</h3>
            <p className="pill">{e.status}</p>
            <p className="pill">{e.date}</p>
            <a className="cta" href="https://wa.me/5355609099?text=Quiero%20inscribirme" target="_blank" rel="noopener">
              Reservar cupo
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Galeria

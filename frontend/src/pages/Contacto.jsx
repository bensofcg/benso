function Contacto() {
  return (
    <div className="layout">
      <div className="hero">
        <div>
          <p className="pill">Contacto</p>
          <h1>Hablemos de tu próximo paso</h1>
          <p>Coordinemos una videollamada de 30 minutos para entender tus desafíos.</p>
          <a className="cta" href="https://wa.me/5355609099?text=Hola,%20quiero%20agendar%20una%20consulta" target="_blank" rel="noopener">
            Agenda por WhatsApp
          </a>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>Datos de contacto</h3>
          <p>Email: info@benso.com</p>
          <p>WhatsApp: +53 55609099</p>
        </div>
        <div className="card">
          <h3>Lo que cubriremos</h3>
          <ul>
            <li>Contexto de tu negocio</li>
            <li>Principales objetivos</li>
            <li>Primeras recomendaciones</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Contacto

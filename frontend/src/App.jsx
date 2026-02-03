import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Servicios from './pages/Servicios'
import Nosotros from './pages/Nosotros'
import Galeria from './pages/Galeria'
import Contacto from './pages/Contacto'

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/galeria', label: 'Eventos' },
  { to: '/contacto', label: 'Contacto' },
]

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">BEN<span>SO</span></div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {item.label}
              <span>→</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
        <div className="footer">© 2026 Benso. Todos los derechos reservados.</div>
      </main>
    </div>
  )
}

export default App

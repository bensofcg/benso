import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import isotipoLogo from '../assets/logos/Isotipo-Benso-Negativo-TP.svg';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header style={{ boxShadow: scrolled ? '0 4px 30px rgba(0, 44, 106, 0.3)' : undefined }}>
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={isotipoLogo} alt="BENSO" className="logo-img" />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-controls="main-nav"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav id="main-nav" className={isMenuOpen ? 'active' : ''}>
          <ul>
            <li><Link to="/" className={isActive('/')} onClick={closeMenu}>Inicio</Link></li>
            <li><Link to="/servicios" className={isActive('/servicios')} onClick={closeMenu}>Servicios</Link></li>
            <li><Link to="/productos" className={isActive('/productos')} onClick={closeMenu}>Productos</Link></li>
            <li><Link to="/nosotros" className={isActive('/nosotros')} onClick={closeMenu}>Nosotros</Link></li>
            <li><Link to="/eventos" className={isActive('/eventos')} onClick={closeMenu}>Eventos</Link></li>
            <li><Link to="/contacto" className={isActive('/contacto')} onClick={closeMenu}>Contacto</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

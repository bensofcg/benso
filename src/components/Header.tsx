import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
          BEN<span>SO</span>
        </Link>

        <div 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={isMenuOpen ? 'active' : ''}>
          <ul>
            <li><Link to="/" className={isActive('/')} onClick={closeMenu}>Inicio</Link></li>
            <li><Link to="/servicios" className={isActive('/servicios')} onClick={closeMenu}>Servicios</Link></li>
            <li><Link to="/nosotros" className={isActive('/nosotros')} onClick={closeMenu}>Nosotros</Link></li>
            <li><Link to="/eventos" className={isActive('/eventos')} onClick={closeMenu}>Eventos</Link></li>
            <li><Link to="/contacto" className={isActive('/contacto')} onClick={closeMenu}>Contacto</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

const navLinks = [
  { path: '/', label: 'Inicio' },
  { path: '/servicios', label: 'Servicios' },
  { path: '/nosotros', label: 'Nosotros' },
  { path: '/eventos', label: 'Eventos' },
  { path: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-primary sticky top-0 z-[1000] shadow-benso">
      <div className="flex justify-between items-center py-4 px-5 max-w-[1200px] mx-auto">
        <Link to="/" className="text-[1.8rem] font-bold text-white tracking-[2px]">
          BEN<span className="text-accent">SO</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer p-[10px] z-[1000] relative"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Navigation */}
        <nav
          className={cn(
            'md:block',
            isMenuOpen
              ? 'fixed top-0 left-0 w-full h-screen bg-primary z-[999] pt-20 block'
              : 'hidden'
          )}
        >
          <ul className={cn(
            'flex gap-8',
            isMenuOpen && 'flex-col p-8 gap-2'
          )}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={closeMenu}
                  className={cn(
                    'text-white font-medium py-2 px-4 rounded-lg transition-all hover:bg-secondary',
                    isMenuOpen && 'block text-center text-lg',
                    location.pathname === link.path && 'bg-secondary'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

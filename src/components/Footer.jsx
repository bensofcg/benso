import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12 px-0">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="mb-4 text-xl font-bold">BENSO</h4>
            <p className="opacity-80">Consultoría y Soluciones Digitales para la Rentabilidad Sostenible.</p>
            <h4 className="mt-8 mb-4 text-xl font-bold">Redes sociales</h4>
            <div className="flex gap-4 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:text-accent transition-all hover:scale-110"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://wa.me/5355609099"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:text-accent transition-all hover:scale-110"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:text-accent transition-all hover:scale-110"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xl font-bold">Enlaces</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-accent transition-colors">Inicio</Link></li>
              <li><Link to="/servicios" className="hover:text-accent transition-colors">Servicios</Link></li>
              <li><Link to="/nosotros" className="hover:text-accent transition-colors">Nosotros</Link></li>
              <li><Link to="/eventos" className="hover:text-accent transition-colors">Eventos</Link></li>
              <li><Link to="/contacto" className="hover:text-accent transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xl font-bold">Contacto</h4>
            <ul className="space-y-2">
              <li>Email: info@benso.com</li>
              <li>WhatsApp: +53 55609099</li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-6 border-t border-white/10 text-sm opacity-70">
          <p>&copy; 2026 Benso. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

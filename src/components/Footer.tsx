'use client';

import Link from 'next/link';
import Image from 'next/image';

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <Image 
              src="/benso/assets/logos/Logotipo Benso Claro.svg" 
              alt="BENSO" 
              className="footer-logo-top"
              width={120}
              height={30}
              unoptimized
            />
            <p>Consultoría y Soluciones Digitales para la Rentabilidad Sostenible.</p>
          </div>

          <div className="footer-right-blocks">
            <div className="footer-section footer-links-block">
              <h4>Enlaces</h4>
              <ul>
                <li><Link href="/">Inicio</Link></li>
                <li><Link href="/servicios">Servicios</Link></li>
                <li><Link href="/productos">Productos</Link></li>
                <li><Link href="/eventos">Eventos</Link></li>
                <li><Link href="/nosotros">Nosotros</Link></li>
                <li><Link href="/contacto">Contacto</Link></li>
              </ul>
            </div>

            <div className="footer-section footer-contact-block">
              <h4>Contacto</h4>
              <div className="footer-contact-details">
                <div className="footer-contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <a href="mailto:info@benso.com">info@benso.com</a>
                </div>
                <div className="footer-contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <a href="tel:+5355609099">+53 55609099</a>
                </div>
              </div>
              <h4 className="footer-social-title">Redes sociales</h4>
              <div className="social-links">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
                <a href="/contacto" target="_blank" rel="noopener noreferrer" aria-label="Contacto">
                  <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-logo-group">
              <Image 
                src="/benso/assets/logos/Isotipo Benso Claro.svg" 
                alt="BENSO" 
                className="footer-isotipo"
                width={28}
                height={28}
                unoptimized
              />
              <p className="footer-year">&copy; {currentYear}</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .footer {
          background: var(--dark);
          color: var(--white);
          padding: 3rem 0 1.5rem;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          margin-bottom: 3rem;
          align-items: start;
        }
        
        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          text-align: left;
        }
        
        .footer-brand {
          align-items: flex-start;
          text-align: left;
          max-width: 280px;
        }
        
        .footer-right-blocks {
          display: flex;
          gap: 4rem;
          justify-content: flex-end;
        }
        
        .footer-links-block {
          min-width: 80px;
        }
        
        .footer-contact-block {
          min-width: 140px;
        }
        
        .footer-section p {
          color: #b0b0b0;
        }
        
        .footer-section h4 {
          color: #ffffff;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-section ul li {
          margin-bottom: 0.4rem;
        }
        
        .footer-section ul li a {
          color: #b0b0b0;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        
        .footer-section ul li a:hover {
          color: #cccccc;
        }
        
        .footer-contact-details {
          margin-bottom: 1.5rem;
        }
        
.footer-contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: #b0b0b0;
          font-size: 0.8rem;
        }

        .footer-contact-item svg {
          width: 12px;
          height: 12px;
          flex-shrink: 0;
          fill: #b0b0b0;
        }

        .footer-contact-item a {
          color: #b0b0b0;
          transition: color 0.2s;
        }

        .footer-contact-item a:hover {
          color: #cccccc;
        }

        .footer-social-title {
          margin-top: 0.75rem;
        }

.social-links {
          display: flex;
          gap: 0.75rem;
        }
        
        .social-icon {
          width: 22px;
          height: 22px;
          fill: #c8c8c8;
          opacity: 0.9;
          transition: all 0.2s;
        }
        
        .social-icon:hover {
          opacity: 1;
          fill: #ffffff;
        }
        
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          text-align: center;
        }
        
        .footer-bottom-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }
        
.footer-logo-top {
          height: 24px;
          width: auto;
          margin-bottom: 0.5rem;
          filter: brightness(0) invert(1);
        }
        
        .footer-logo-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .footer-isotipo {
          height: 28px;
          width: auto;
          filter: brightness(0) invert(1);
        }
        
        .footer-year {
          color: #999999;
          font-size: 0.75rem;
        }
        
        /* Responsive: Tablet */
        @media (max-width: 992px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .footer-brand {
            max-width: 100%;
            text-align: center;
            align-items: center;
          }
          
          .footer-brand p {
            max-width: 300px;
          }
          
          .footer-right-blocks {
            gap: 3rem;
            justify-content: center;
            width: 100%;
          }
        }
        
        /* Responsive: Mobile - todo alineado a izquierda, espaciado coherente */
        @media (max-width: 768px) {
          .footer {
            padding: 2rem 1rem 1.5rem;
            text-align: left;
          }
          
          .footer-content {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            margin-bottom: 1.5rem;
          }
          
          .footer-brand {
            text-align: left;
            align-items: flex-start;
            max-width: 100%;
          }
          
          .footer-brand img {
            height: 18px;
            margin-bottom: 0.5rem;
          }
          
          .footer-brand p {
            text-align: left;
            font-size: 0.8rem;
            line-height: 1.5;
          }
          
          .footer-right-blocks {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
            width: 100%;
          }
          
          .footer-section {
            text-align: left;
            align-items: flex-start;
          }
          
          .footer-section h4 {
            font-size: 0.8rem;
            margin-bottom: 0.75rem;
          }
          
          .footer-links-block ul {
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            padding: 0;
            margin: 0;
          }
          
          .footer-links-block ul li {
            margin-bottom: 0;
          }
          
          .footer-links-block ul li a {
            font-size: 0.85rem;
          }
          
          .footer-contact-details {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 0;
          }
          
          .footer-contact-item {
            flex-direction: row;
            gap: 0.5rem;
            font-size: 0.85rem;
            margin-bottom: 0;
          }
          
          .footer-contact-item svg {
            width: 14px;
            height: 14px;
          }
          
.footer-social-title {
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
          
          .social-links {
            display: flex;
            gap: 0.75rem;
          }
          
          .social-icon {
            width: 18px;
            height: 18px;
          }
          
          .footer-bottom {
            padding-top: 1.5rem;
            text-align: center;
          }
          
          .footer-bottom-content {
            flex-direction: column;
            gap: 0.5rem;
            justify-content: center;
          }
          
          .footer-logo-group {
            flex-direction: row;
            gap: 0.5rem;
          }
          
          .footer-isotipo {
            height: 14px;
          }
          
          .footer-year {
            font-size: 0.7rem;
          }
        }
        
        /* Responsive: Very narrow screens */
        @media (max-width: 360px) {
          .footer {
            padding: 2rem 0 1rem;
          }
          
          .footer-brand p {
            font-size: 0.85rem;
          }
          
          .footer-section h4 {
            font-size: 0.75rem;
          }
          
          .footer-links-block ul {
            gap: 0.5rem 1rem;
          }
        }
      `}</style>
    </footer>
  );
}

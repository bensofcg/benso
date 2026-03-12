import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Header, Footer, Background, Cart, PromoBanner } from './components';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ProductsPage = lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const EventsPage = lazy(() => import('./pages/EventsPage').then(m => ({ default: m.EventsPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  const [topBarHidden, setTopBarHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      if (delta > 10 && currentScrollY > 100) {
        setTopBarHidden(true);
      } else if (delta < -10) {
        setTopBarHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <CartProvider>
      <HashRouter>
        <ScrollToTop />
        <Background />
        <div className={`top-bar${topBarHidden ? ' top-bar-hidden' : ''}`}>
          <PromoBanner />
          <Header />
        </div>
        <main>
          <Suspense fallback={<div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>Cargando…</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/servicios" element={<ServicesPage />} />
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/nosotros" element={<AboutPage />} />
              <Route path="/eventos" element={<EventsPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Cart />
        <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      </HashRouter>
    </CartProvider>
  );
}

export default App;

import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
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
  return (
    <CartProvider>
      <HashRouter>
        <ScrollToTop />
        <Background />
        <PromoBanner />
        <Header />
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

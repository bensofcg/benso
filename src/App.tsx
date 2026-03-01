import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header, Footer, Background, Cart, PromoBanner } from './components';
import { HomePage, ServicesPage, ProductsPage, AboutPage, EventsPage, ContactPage } from './pages';
import { CartProvider } from './context/CartContext';
import './index.css';

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
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/nosotros" element={<AboutPage />} />
            <Route path="/eventos" element={<EventsPage />} />
            <Route path="/contacto" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
        <Cart />
      </HashRouter>
    </CartProvider>
  );
}

export default App;

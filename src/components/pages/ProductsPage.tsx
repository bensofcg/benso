'use client';

import { useState } from 'react';
import { ShoppingCart, Send, Calendar, Search } from 'lucide-react';
import { BentoCard, PriceDisplay, PageLoader, RequestModal, ShinyText, ProductsGridSkeleton } from '@/components';
import { useCart } from '@/hooks/useCart';
import { useProductos } from '@/hooks/useData';

// Placeholder images - replace with real images later
const PLACEHOLDER_IMAGES: Record<string, string> = {
  pegatinas: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=180&fit=crop',
  posters: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&h=180&fit=crop',
  cuadros: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&h=180&fit=crop',
  tarjetas: 'https://images.unsplash.com/photo-1607013407639-82f999279328?w=600&h=180&fit=crop',
  lonas: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=180&fit=crop',
  otros: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=180&fit=crop',
};

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=180&fit=crop';

function getProductImage(category: string, productImage: string): string {
  if (productImage && productImage.trim() !== '') {
    return productImage;
  }
  return PLACEHOLDER_IMAGES[category] || DEFAULT_PLACEHOLDER;
}

interface RequestItem {
  title: string;
  price: string;
  priceNum: number;
  whatsappLink: string;
  type: 'servicio' | 'producto' | 'evento';
}

type CategoryFilter = 'all' | 'pegatinas' | 'posters' | 'cuadros' | 'tarjetas' | 'lonas' | 'otros';

const filters = [
  { label: 'Todos', value: 'all' as CategoryFilter },
  { label: 'Pegatinas', value: 'pegatinas' as CategoryFilter },
  { label: 'Posters', value: 'posters' as CategoryFilter },
  { label: 'Cuadros', value: 'cuadros' as CategoryFilter },
  { label: 'Tarjetas', value: 'tarjetas' as CategoryFilter },
  { label: 'Lonas', value: 'lonas' as CategoryFilter },
  { label: 'Otros', value: 'otros' as CategoryFilter },
];

export function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [requestItem, setRequestItem] = useState<RequestItem | null>(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { addItem } = useCart();
  const { productos, loading } = useProductos();

  const openRequest = (item: RequestItem) => {
    setRequestItem(item);
    setIsRequestOpen(true);
  };

  const filteredProducts = productos.filter(
    product => (activeFilter === 'all' || product.category === activeFilter) &&
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="reveal-section reveal-disabled">
      <div className="container">
        <div className="section-title-row page-intro-title">
          <div className="section-title">
            <h2>Nuestros productos</h2>
          </div>
          <div className="filter-controls">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                disabled={loading}
              />
            </div>
            <select
              className="filter-select"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as CategoryFilter)}
              disabled={loading}
            >
              {filters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <ProductsGridSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <div className="bento-grid">
            <div className="bento-card">
              <p>No hay productos disponibles</p>
            </div>
          </div>
        ) : (
          <div className="bento-grid">
            {filteredProducts.map((product) => (
              <div key={`${activeFilter}-${product.id}`}>
                <BentoCard 
                  className={`service-card${product.popular ? ' popular-card' : ''}`}
                  dataCategory={product.category}
                >
                  {product.popular && <span className="popular-badge">Más popular</span>}
                  <div className="product-image-container">
                    <img 
                      src={getProductImage(product.category, product.image)} 
                      alt={product.title} 
                      loading="lazy"
                    />
                  </div>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <span className="card-price"><PriceDisplay price={product.price} priceNum={product.price_num} /></span>
                  <div className="card-actions">
                    <button
                      className="btn-add-cart btn-add-cart-full"
                      onClick={() => addItem(product.title, String(product.price_num))}
                    >
                      <ShoppingCart size={16} />
                      <span>Añadir al carrito</span>
                    </button>
                  </div>
                </BentoCard>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="container section-cta">
        <h2>¿Listo para transformar tu negocio?</h2>
        <p>Agenda una cita y descubre cómo podemos ayudarte a alcanzar tus metas.</p>
        <a href="/contacto" className="cta-button">
          <Calendar size={18} />
          <ShinyText text="Agendar cita" speed={3.5} />
        </a>
      </div>

      <RequestModal
        item={requestItem}
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
      />
    </section>
  );
}
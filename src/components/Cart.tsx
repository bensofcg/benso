'use client';

import { useCart } from '@/hooks/useCart';
import { CheckoutModal } from './CheckoutModal';

export function Cart() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isOpen, setIsOpen, setIsCheckoutOpen } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCheckout = () => {
    setIsOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {totalItems > 0 && (
        <button
          className="cart-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir carrito"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span className="cart-fab-badge">{totalItems}</span>
        </button>
      )}

      <div
        className={`cart-overlay${isOpen ? ' open' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div 
        className={`cart-panel${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <div className="cart-panel-header">
          <h3>Carrito ({totalItems})</h3>
          <button className="cart-panel-close" onClick={() => setIsOpen(false)} aria-label="Cerrar carrito">
            ×
          </button>
        </div>

        <div className="cart-panel-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p>Tu carrito está vacío</p>
              <button 
                className="btn-browse"
                onClick={() => setIsOpen(false)}
              >
                Ver productos
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.title} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <span>{item.price} CUP</span>
                  <div className="cart-item-qty">
                    <button onClick={() => updateQuantity(item.title, item.quantity - 1)} aria-label="Reducir cantidad">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.title, item.quantity + 1)} aria-label="Aumentar cantidad">+</button>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => removeItem(item.title)} aria-label={`Eliminar ${item.title}`}>
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-panel-footer">
            <div className="cart-summary">
              <div className="cart-line">
                <span>Artículos:</span>
                <span>{totalItems}</span>
              </div>
              <div className="cart-total">
                <span>Total:</span>
                <span className="cart-total-amount">{formatPrice(totalPrice)} CUP</span>
              </div>
            </div>
            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Finalizar pedido
            </button>
          </div>
        )}
      </div>

      <CheckoutModal />

      <style jsx>{`
        .cart-empty {
          text-align: center;
          padding: 2rem 1rem;
        }
        
        .cart-empty svg {
          width: 64px;
          height: 64px;
          margin-bottom: 1rem;
          opacity: 0.4;
          color: var(--primary);
        }
        
        .cart-empty p {
          color: var(--dark);
          opacity: 0.6;
          margin: 0 0 1rem;
        }
        
        .btn-browse {
          background: transparent;
          color: var(--primary);
          border: 2px solid var(--primary);
          padding: 0.6rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-browse:hover {
          background: var(--primary);
          color: white;
        }
        
        .cart-checkout-btn {
          width: 100%;
          padding: 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        
        .cart-checkout-btn:hover {
          background: var(--secondary);
          transform: translateY(-2px);
        }
        
        .cart-checkout-btn svg {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </>
  );
}

import { useCart } from '../hooks/useCart';

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, isOpen, setIsOpen } = useCart();

  const buildWhatsAppMessage = () => {
    const lines = items.map(item => `• ${item.title} x${item.quantity} — ${item.price} CUP`);
    const message = `Hola, me gustaría hacer el siguiente pedido:\n\n${lines.join('\n')}\n\nGracias.`;
    return `https://wa.me/5355609099?text=${encodeURIComponent(message)}`;
  };

  return (
    <>
      {/* FAB Button */}
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

      {/* Overlay */}
      <div
        className={`cart-overlay${isOpen ? ' open' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div className={`cart-panel${isOpen ? ' open' : ''}`}>
        <div className="cart-panel-header">
          <h3>Carrito ({totalItems})</h3>
          <button className="cart-panel-close" onClick={() => setIsOpen(false)} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        <div className="cart-panel-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.title} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <span>{item.price} CUP</span>
                  <div className="cart-item-qty">
                    <button onClick={() => updateQuantity(item.title, item.quantity - 1)} aria-label="Reducir cantidad">−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.title, item.quantity + 1)} aria-label="Aumentar cantidad">+</button>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => removeItem(item.title)} aria-label={`Eliminar ${item.title}`}>
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-panel-footer">
            <div className="cart-total">
              <span>Total artículos:</span>
              <span>{totalItems}</span>
            </div>
            <a
              href={buildWhatsAppMessage()}
              className="cart-whatsapp-btn"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { clearCart(); setIsOpen(false); }}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
              </svg>
              Enviar pedido por WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}

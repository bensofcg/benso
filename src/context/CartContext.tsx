import { createContext, useState, type ReactNode } from 'react';

export interface CartItem {
  title: string;
  price: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (title: string, price: string) => void;
  removeItem: (title: string) => void;
  updateQuantity: (title: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (title: string, price: string) => {
    setItems(prev => {
      const existing = prev.find(item => item.title === title);
      if (existing) {
        return prev.map(item =>
          item.title === title ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { title, price, quantity: 1 }];
    });
  };

  const removeItem = (title: string) => {
    setItems(prev => prev.filter(item => item.title !== title));
  };

  const updateQuantity = (title: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(title);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.title === title ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

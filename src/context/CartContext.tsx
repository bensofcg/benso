'use client';

import { createContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export interface CartItem {
  title: string;
  price: string;
  priceNum: number;
  quantity: number;
}

export interface PedidoInsert {
  customer_name?: string;
  customer_email?: string;
  items: CartItem[];
  total_price: number;
  status: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (title: string, price: string) => void;
  removeItem: (title: string) => void;
  updateQuantity: (title: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  saveOrder: (customerName: string, customerEmail: string) => Promise<{ success: boolean; pedidoId?: number; error?: string }>;
}

const CART_STORAGE_KEY = 'benso-cart-items';

function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/[^0-9.,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return (parsed as CartItem[]).map(item => ({
          ...item,
          priceNum: item.priceNum || parsePrice(item.price)
        }));
      }
    }
  } catch {
    // Ignore
  }
  return [];
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    setItems(loadCartFromStorage());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (items.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (title: string, price: string) => {
    const priceNum = parsePrice(price);
    setItems(prev => {
      const existing = prev.find(item => item.title === title);
      if (existing) {
        return prev.map(item =>
          item.title === title ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { title, price, priceNum, quantity: 1 }];
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

  const clearCart = () => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  const saveOrder = async (customerName: string, customerEmail: string): Promise<{ success: boolean; pedidoId?: number; error?: string }> => {
    if (items.length === 0) {
      return { success: false, error: 'El carrito está vacío' };
    }

    const totalPrice = items.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);

    try {
      const { data, error } = await supabase
        .from('pedidos')
        .insert({
          customer_name: customerName || 'Cliente web',
          customer_email: customerEmail || null,
          items: items,
          total_price: totalPrice,
          status: 'pendiente'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving order:', error);
        return { success: false, error: error.message };
      }

      clearCart();
      return { success: true, pedidoId: data.id };
    } catch (e: any) {
      console.error('Error:', e);
      return { success: false, error: e.message || 'Error al procesar el pedido' };
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{ 
        items, addItem, removeItem, updateQuantity, clearCart, 
        totalItems, totalPrice, isOpen, setIsOpen,
        isCheckoutOpen, setIsCheckoutOpen,
        saveOrder 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

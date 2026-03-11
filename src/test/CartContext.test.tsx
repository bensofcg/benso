import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useContext, type ReactNode } from 'react';
import { CartProvider, CartContext, type CartContextType } from '../context/CartContext';

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty cart', () => {
    const { result } = renderHook(useCart, { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
  });

  it('adds an item to the cart', () => {
    const { result } = renderHook(useCart, { wrapper });

    act(() => {
      result.current.addItem('Test Product', '$10');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({ title: 'Test Product', price: '$10', quantity: 1 });
    expect(result.current.totalItems).toBe(1);
  });

  it('increments quantity when adding the same item twice', () => {
    const { result } = renderHook(useCart, { wrapper });

    act(() => {
      result.current.addItem('Test Product', '$10');
    });
    act(() => {
      result.current.addItem('Test Product', '$10');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it('removes an item from the cart', () => {
    const { result } = renderHook(useCart, { wrapper });

    act(() => {
      result.current.addItem('Test Product', '$10');
    });
    act(() => {
      result.current.removeItem('Test Product');
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('clears all items', () => {
    const { result } = renderHook(useCart, { wrapper });

    act(() => {
      result.current.addItem('Item A', '$5');
    });
    act(() => {
      result.current.addItem('Item B', '$15');
    });
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it('persists items to localStorage', () => {
    const { result } = renderHook(useCart, { wrapper });

    act(() => {
      result.current.addItem('Persisted Item', '$20');
    });

    const stored = JSON.parse(localStorage.getItem('benso-cart-items') ?? '[]') as CartContextType['items'];
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('Persisted Item');
  });

  it('loads items from localStorage on mount', () => {
    localStorage.setItem('benso-cart-items', JSON.stringify([
      { title: 'Saved Item', price: '$30', quantity: 2 },
    ]));

    const { result } = renderHook(useCart, { wrapper });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].title).toBe('Saved Item');
    expect(result.current.totalItems).toBe(2);
  });
});

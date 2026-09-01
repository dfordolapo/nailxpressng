import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CartProvider, useCart } from './CartContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const mockProduct = {
  id: 'prod-123',
  name: 'Bridal Bows',
  slug: 'bridal-bows',
  price: 10500,
  category: 'factory',
  images: ['/images/factory-made/EA05CA92-2DFF-4F43-8D58-A0E01BA15CBF.jpg'],
};

const mockHandmadeProduct = {
  id: 'prod-456',
  name: 'Amber Haze',
  slug: 'amber-haze',
  price: 26000,
  category: 'handmade',
  images: ['/images/Handmade/IMG_3174.jpg'],
};

describe('CartContext & E-Commerce State Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with an empty cart and zero counts', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('adds items to the cart and updates counts and pricing totals', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 1);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].name).toBe('Bridal Bows');
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.subtotal).toBe(10500);
    expect(result.current.itemCount).toBe(1);
  });

  it('increments quantity when identical product, size, and length are added', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockHandmadeProduct, 1, 'M', 'Long');
    });

    act(() => {
      result.current.addItem(mockHandmadeProduct, 2, 'M', 'Long');
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.subtotal).toBe(78000); // 26,000 * 3
  });

  it('treats items with different sizes or lengths as distinct cart items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockHandmadeProduct, 1, 'S', 'Medium');
      result.current.addItem(mockHandmadeProduct, 1, 'L', 'Long');
    });

    expect(result.current.items.length).toBe(2);
    expect(result.current.itemCount).toBe(2);
    expect(result.current.subtotal).toBe(52000); // 26,000 * 2
  });

  it('updates quantity of existing items accurately', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 1, 'M', 'medium');
    });

    act(() => {
      result.current.updateQuantity(mockProduct.id, 'M', 'medium', 4);
    });

    expect(result.current.items[0].quantity).toBe(4);
    expect(result.current.subtotal).toBe(42000); // 10,500 * 4
  });

  it('removes items completely when removeItem is called', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 1, 'M', 'medium');
    });

    act(() => {
      result.current.removeItem(mockProduct.id, 'M', 'medium');
    });

    expect(result.current.items.length).toBe(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('clears the entire cart with clearCart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 2);
      result.current.addItem(mockHandmadeProduct, 1, 'M', 'Medium');
    });

    expect(result.current.items.length).toBe(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items.length).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });
});

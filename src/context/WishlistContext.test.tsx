import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { WishlistProvider, useWishlist } from './WishlistContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WishlistProvider>{children}</WishlistProvider>
);

const mockProduct = {
  id: 'wish-1',
  name: 'Velvet Noir',
  slug: 'velvet-noir',
  price: 18000,
  category: 'handmade',
  image: '/images/Handmade/IMG_3267.jpg',
};

describe('WishlistContext State Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
  });

  it('toggles product into and out of wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    // Add to wishlist
    act(() => {
      result.current.toggleItem(mockProduct);
    });

    expect(result.current.isInWishlist(mockProduct.id)).toBe(true);
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].name).toBe('Velvet Noir');

    // Toggle off
    act(() => {
      result.current.toggleItem(mockProduct);
    });

    expect(result.current.isInWishlist(mockProduct.id)).toBe(false);
    expect(result.current.items.length).toBe(0);
  });
});

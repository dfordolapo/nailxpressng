import { describe, it, expect } from 'vitest';
import { formatPrice, calculateCartTotals, getDiscountPercent, slugify, truncateText } from './utils';

describe('E-Commerce Utility Functions', () => {
  describe('formatPrice', () => {
    it('formats numbers with Nigerian Naira symbol and commas', () => {
      expect(formatPrice(10500)).toBe('₦10,500');
      expect(formatPrice(0)).toBe('₦0');
      expect(formatPrice(1500000)).toBe('₦1,500,000');
    });

    it('handles null or undefined gracefully', () => {
      expect(formatPrice(null)).toBe('₦0');
      expect(formatPrice(undefined)).toBe('₦0');
    });
  });

  describe('calculateCartTotals', () => {
    it('calculates the correct subtotal, shipping, and total for items', () => {
      const items = [
        { price: 10000, quantity: 2 },
        { price: 5000, quantity: 1 },
      ];
      const totals = calculateCartTotals(items);
      expect(totals.subtotal).toBe(25000);
      expect(totals.shipping).toBe(2500);
      expect(totals.total).toBe(27500);
      expect(totals.itemCount).toBe(3);
    });

    it('returns zeroes/flat shipping for empty cart', () => {
      const totals = calculateCartTotals([]);
      expect(totals.subtotal).toBe(0);
      expect(totals.total).toBe(2500);
      expect(totals.itemCount).toBe(0);
    });
  });

  describe('getDiscountPercent', () => {
    it('calculates the correct discount percentage', () => {
      // getDiscountPercent(currentPrice, compareAtPrice)
      expect(getDiscountPercent(8000, 10000)).toBe(20);
      expect(getDiscountPercent(15000, 20000)).toBe(25);
    });

    it('returns 0 when there is no compareAtPrice or price is higher', () => {
      expect(getDiscountPercent(10000, 10000)).toBe(0);
      expect(getDiscountPercent(10000, null)).toBe(0);
    });
  });

  describe('slugify & truncateText', () => {
    it('correctly creates url-safe slugs', () => {
      expect(slugify('Bridal Bows & Pearls!')).toBe('bridal-bows-pearls');
      expect(slugify('Amber Haze Set')).toBe('amber-haze-set');
    });

    it('truncates text properly with ellipsis', () => {
      expect(truncateText('Short text', 20)).toBe('Short text');
      expect(truncateText('This is a longer description text', 10)).toBe('This is a…');
    });
  });
});


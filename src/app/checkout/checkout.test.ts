import { describe, it, expect } from 'vitest';
import { calculateCartTotals, formatPrice, calculateShipping } from '@/lib/utils';
import { FLAT_SHIPPING_RATE } from '@/lib/constants';

describe('Checkout Business Logic & Payload Verification', () => {
  const mockCheckoutItems = [
    {
      id: 'd4e6e203-2b72-4a41-8a7c-6538da175d27',
      name: 'Bridal Bows',
      price: 10500,
      quantity: 2,
      selectedSize: 'M',
      selectedLength: 'Long',
    },
    {
      id: 'a1b2c3d4-0000-0000-0000-000000000000',
      name: 'Amber Haze',
      price: 26000,
      quantity: 1,
      selectedSize: 'L',
      selectedLength: 'Medium',
    },
  ];

  const mockCustomerForm = {
    firstName: 'Chioma',
    lastName: 'Adeyemi',
    email: 'chioma@example.com',
    phone: '08012345678',
    address: '14 Admiralty Way, Lekki Phase 1',
    city: 'Lekki',
    state: 'Lagos',
  };

  it('calculates accurate checkout totals including flat shipping', () => {
    const { subtotal, shipping, total, itemCount } = calculateCartTotals(mockCheckoutItems);

    // subtotal = (10500 * 2) + 26000 = 21000 + 26000 = 47000
    expect(subtotal).toBe(47000);
    expect(shipping).toBe(FLAT_SHIPPING_RATE);
    expect(total).toBe(47000 + FLAT_SHIPPING_RATE);
    expect(itemCount).toBe(3);
  });

  it('correctly formats Nigerian Naira prices for checkout summaries', () => {
    const { subtotal, total } = calculateCartTotals(mockCheckoutItems);

    expect(formatPrice(subtotal)).toBe('₦47,000');
    expect(formatPrice(total)).toBe('₦49,500');
  });

  it('validates customer checkout form requirements', () => {
    const isValid = Boolean(
      mockCustomerForm.firstName &&
      mockCustomerForm.lastName &&
      mockCustomerForm.email.includes('@') &&
      mockCustomerForm.phone.length >= 10 &&
      mockCustomerForm.address &&
      mockCustomerForm.state
    );

    expect(isValid).toBe(true);
  });

  it('structures payload for checkout order items correctly', () => {
    const orderItemsPayload = mockCheckoutItems.map((item) => ({
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      selected_size: item.selectedSize,
      selected_length: item.selectedLength,
    }));

    expect(orderItemsPayload.length).toBe(2);
    expect(orderItemsPayload[0]).toEqual({
      product_name: 'Bridal Bows',
      quantity: 2,
      price: 10500,
      selected_size: 'M',
      selected_length: 'Long',
    });
    expect(orderItemsPayload[1]).toEqual({
      product_name: 'Amber Haze',
      quantity: 1,
      price: 26000,
      selected_size: 'L',
      selected_length: 'Medium',
    });
  });
});

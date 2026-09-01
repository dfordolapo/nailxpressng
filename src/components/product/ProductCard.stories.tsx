import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ProductCard from './ProductCard';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CartProvider>
        <WishlistProvider>
          <div style={{ maxWidth: '340px', margin: '40px auto' }}>
            <Story />
          </div>
        </WishlistProvider>
      </CartProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

const sampleProduct = {
  id: 'd4e6e203-2b72-4a41-8a7c-6538da175d27',
  name: 'Bridal Bows',
  slug: 'bridal-bows',
  description: 'Pink square nails with white French tips, 3D white bows, and rhinestones.',
  price: 10500,
  compareAtPrice: 12500,
  category: 'factory',
  categoryName: 'Factory Made',
  nailShape: 'square',
  style: '3d',
  lengths: ['Long'],
  sizes: [],
  images: ['/images/factory-made/EA05CA92-2DFF-4F43-8D58-A0E01BA15CBF.jpg'],
  image: '/images/factory-made/EA05CA92-2DFF-4F43-8D58-A0E01BA15CBF.jpg',
  newArrival: true,
  bestseller: true,
  inStock: true,
  stockCount: 5,
  createdAt: '2026-08-21T13:27:13.364515+00:00',
  color: 'White',
  colors: ['White', 'Nude'],
  discountPercent: 16,
};

export const FactoryCardDefault: Story = {
  args: {
    product: sampleProduct as any,
    viewMode: 'grid',
  },
};

export const FactoryCardListView: Story = {
  args: {
    product: sampleProduct as any,
    viewMode: 'list',
  },
};

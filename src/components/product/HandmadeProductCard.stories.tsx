import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import HandmadeProductCard from './HandmadeProductCard';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

const meta: Meta<typeof HandmadeProductCard> = {
  title: 'Components/HandmadeProductCard',
  component: HandmadeProductCard,
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
type Story = StoryObj<typeof HandmadeProductCard>;

const sampleHandmadeProduct = {
  id: 'handmade-1',
  name: 'Amber Haze',
  slug: 'amber-haze',
  description: 'Handcrafted luxury press-on nail set with salon-grade strength.',
  price: 26000,
  compareAtPrice: 30000,
  category: 'handmade',
  categoryName: 'Handmade Artistry',
  nailShape: 'almond',
  style: 'artistic',
  lengths: ['Medium', 'Long'],
  sizes: ['S', 'M', 'L'],
  images: ['/images/Handmade/IMG_3174.jpg'],
  image: '/images/Handmade/IMG_3174.jpg',
  newArrival: true,
  bestseller: true,
  inStock: true,
  stockCount: 3,
  createdAt: '2026-08-21T13:27:13.364515+00:00',
  color: 'Amber',
  colors: ['Amber', 'Gold'],
  discountPercent: 13,
};

export const HandmadeCardFrontAndBack: Story = {
  args: {
    product: sampleHandmadeProduct as any,
    viewMode: 'grid',
  },
};

export const HandmadeListView: Story = {
  args: {
    product: sampleHandmadeProduct as any,
    viewMode: 'list',
  },
};

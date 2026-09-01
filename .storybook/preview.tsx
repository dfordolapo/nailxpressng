import React from 'react';
import type { Preview } from '@storybook/react';
import { ToastProvider } from '../src/context/ToastContext';
import { CartProvider } from '../src/context/CartContext';
import { WishlistProvider } from '../src/context/WishlistContext';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#FAF8F5' },
        { name: 'dark', value: '#1a1614' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <Story />
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    ),
  ],
};

export default preview;


import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FindYourFitQuiz from './FindYourFitQuiz';

const meta: Meta<typeof FindYourFitQuiz> = {
  title: 'Components/FindYourFitQuiz',
  component: FindYourFitQuiz,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FindYourFitQuiz>;

const mockProducts = [
  {
    id: '1',
    name: 'Bridal Bows',
    slug: 'bridal-bows',
    price: 10500,
    category: 'factory',
    lengths: ['Long'],
    image: '/images/factory-made/EA05CA92-2DFF-4F43-8D58-A0E01BA15CBF.jpg',
    images: ['/images/factory-made/EA05CA92-2DFF-4F43-8D58-A0E01BA15CBF.jpg'],
    color: 'White',
    inStock: true,
  },
  {
    id: '2',
    name: 'Amber Haze',
    slug: 'amber-haze',
    price: 26000,
    category: 'handmade',
    lengths: ['Medium'],
    image: '/images/Handmade/IMG_3174.jpg',
    images: ['/images/Handmade/IMG_3174.jpg'],
    color: 'Nude',
    inStock: true,
  },
];

export const DefaultBanner: Story = {
  args: {
    allProducts: mockProducts as any,
    hideBanner: false,
  },
};

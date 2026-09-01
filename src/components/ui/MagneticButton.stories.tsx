import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MagneticButton from './MagneticButton';
import { NailIcon } from '@/components/ui/NailIcon';

const meta: Meta<typeof MagneticButton> = {
  title: 'Components/MagneticButton',
  component: MagneticButton,
  tags: ['autodocs'],
  argTypes: {
    href: { control: 'text' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof MagneticButton>;

export const Default: Story = {
  args: {
    href: '/shop',
    children: (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <span>Shop bestsellers</span>
        <NailIcon size={20} />
      </span>
    ),
  },
};

export const CustomOrderCTA: Story = {
  args: {
    href: '/custom-order',
    children: (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <span>Customize your set</span>
        <NailIcon size={20} />
      </span>
    ),
  },
};

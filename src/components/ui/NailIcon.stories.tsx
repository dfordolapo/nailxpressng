import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NailIcon } from './NailIcon';

const meta: Meta<typeof NailIcon> = {
  title: 'Components/NailIcon',
  component: NailIcon,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'range', min: 16, max: 80, step: 2 } },
    color: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof NailIcon>;

export const Default: Story = {
  args: {
    size: 32,
    color: '#D4AF7A',
  },
};

export const LuxuryGold: Story = {
  args: {
    size: 48,
    color: '#D4AF7A',
  },
};

export const RosePink: Story = {
  args: {
    size: 48,
    color: '#E07A8B',
  },
};

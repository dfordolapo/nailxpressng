import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import OfflineBanner from './OfflineBanner';

const meta: Meta<typeof OfflineBanner> = {
  title: 'Components/OfflineBanner',
  component: OfflineBanner,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OfflineBanner>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '20px', background: '#FAF8F5' }}>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
        This component renders when the user loses internet connectivity in the PWA.
      </p>
      <OfflineBanner />
    </div>
  ),
};

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ShapeFilterBar from './ShapeFilterBar';

const meta: Meta<typeof ShapeFilterBar> = {
  title: 'Components/ShapeFilterBar',
  component: ShapeFilterBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ShapeFilterBar>;

export const Interactive: Story = {
  render: () => {
    const [selectedShapes, setSelectedShapes] = useState<string[]>(['almond']);
    const [selectedLengths, setSelectedLengths] = useState<string[]>(['Medium']);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', background: '#FAF8F5' }}>
        <ShapeFilterBar
          selectedShapes={selectedShapes}
          onToggleShape={(shape) =>
            setSelectedShapes((prev) =>
              prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape]
            )
          }
          selectedLengths={selectedLengths}
          onToggleLength={(length) =>
            setSelectedLengths((prev) =>
              prev.includes(length) ? prev.filter((l) => l !== length) : [...prev, length]
            )
          }
          selectedColors={selectedColors}
          onToggleColor={(color) =>
            setSelectedColors((prev) =>
              prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
            )
          }
        />
      </div>
    );
  },
};

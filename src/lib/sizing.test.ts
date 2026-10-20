import { describe, it, expect } from 'vitest';

// Sizing resolution helper function matching the logic in api.js and ProductsClient
function resolveProductSizes(product: {
  category?: string;
  categoryName?: string;
  name?: string;
  sizes?: string[] | string | null;
}) {
  let parsed: string[] = [];
  if (Array.isArray(product.sizes)) {
    parsed = product.sizes.map(s => String(s).trim()).filter(Boolean);
  } else if (typeof product.sizes === 'string' && product.sizes.trim()) {
    try {
      const j = JSON.parse(product.sizes);
      if (Array.isArray(j)) parsed = j.map(s => String(s).trim()).filter(Boolean);
      else parsed = product.sizes.split(',').map(s => s.trim()).filter(Boolean);
    } catch {
      parsed = product.sizes.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  if (parsed.length > 0) return parsed;

  const resolvedCategory = (product.category || '').toLowerCase().trim();
  const resolvedCategoryName = (product.categoryName || '').toLowerCase().trim();
  const productName = (product.name || '').toLowerCase().trim();

  const isHalloween = resolvedCategory === 'halloween' || 
    resolvedCategoryName.includes('halloween') ||
    productName.includes('halloween');

  if (isHalloween) return ["S", "M", "L"];

  const isFactory = resolvedCategory === 'factory' || resolvedCategoryName.includes('factory');
  if (isFactory) return [];

  return ["S", "M", "L"];
}

describe('Product Sizing Rules', () => {
  it('assigns S, M, L sizes to Halloween collection sets by default', () => {
    const halloweenSet = {
      category: 'halloween',
      categoryName: 'Halloween Capsule',
      name: 'Vampire Stiletto Nails',
      sizes: [],
    };
    expect(resolveProductSizes(halloweenSet)).toEqual(['S', 'M', 'L']);
  });

  it('assigns S, M, L sizes when category is not set but product name includes halloween', () => {
    const unnamedHalloween = {
      name: 'Halloween Ghost Glow Set',
      sizes: null,
    };
    expect(resolveProductSizes(unnamedHalloween)).toEqual(['S', 'M', 'L']);
  });

  it('respects custom sizes provided in bulk upload (array or string)', () => {
    const customArraySet = {
      category: 'halloween',
      sizes: ['XS', 'S', 'M'],
    };
    expect(resolveProductSizes(customArraySet)).toEqual(['XS', 'S', 'M']);

    const customStringSet = {
      category: 'handmade',
      sizes: 'S, M, L, Custom',
    };
    expect(resolveProductSizes(customStringSet)).toEqual(['S', 'M', 'L', 'Custom']);
  });

  it('sets empty sizes for standard Factory Made products', () => {
    const factorySet = {
      category: 'factory',
      categoryName: 'Factory Made',
      name: 'Neutral French Pack',
      sizes: [],
    };
    expect(resolveProductSizes(factorySet)).toEqual([]);
  });

  it('defaults to S, M, L for Handmade products without explicit sizes', () => {
    const handmadeSet = {
      category: 'handmade',
      name: 'Floral Handpainted Set',
      sizes: [],
    };
    expect(resolveProductSizes(handmadeSet)).toEqual(['S', 'M', 'L']);
  });
});

import { cache } from 'react';
import { supabase } from './supabase';

// Fetch the sitewide discount % from store settings (0 = no discount)
// Wrapped in React cache to ensure it only runs once per server request
export const getSitewideDiscount = cache(async () => {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('sitewide_discount')
      .eq('id', 1)
      .single();
    if (error || data == null) return 0;
    return Number(data.sitewide_discount) || 0;
  } catch {
    return 0;
  }
});

// Helper to map DB snake_case fields to camelCase for the frontend components
// discount: number 0–100 (percent)
const mapProduct = (p, discount = 0) => {
  let rawPrice = Number(p.price);
  const rawCompare = p.compare_at_price ? Number(p.compare_at_price) : null;

  let price = rawPrice;
  let compareAtPrice = rawCompare;

  // (Factory price overrides removed per requirements)

  if (discount > 0) {
    // Apply discount: discounted becomes the new price, original becomes compareAtPrice
    price = Math.round(rawPrice * (1 - discount / 100));
    compareAtPrice = rawPrice; // always show original as strikethrough
  }

  // Relational Category Mapping (Honors DB foreign key relation):
  let resolvedCategory = p.categories?.slug || null;
  let resolvedCategoryName = p.categories?.name || null;

  if (!resolvedCategory) {
    const rawCatSlug = (p.category || '').toLowerCase().trim();
    const rawCatName = (p.category_name || '').toLowerCase().trim();
    const rawTags = (p.style || p.tags || '').toLowerCase();

    if (rawCatSlug.includes('factory') || rawCatName.includes('factory') || rawTags.includes('factory')) {
      resolvedCategory = 'factory';
      resolvedCategoryName = 'Factory Made';
    } else if (rawCatSlug.includes('handmade') || rawCatName.includes('handmade') || rawTags.includes('handmade')) {
      resolvedCategory = 'handmade';
      resolvedCategoryName = 'Handmade';
    } else {
      resolvedCategory = rawCatSlug || 'handmade';
      resolvedCategoryName = p.category_name || (resolvedCategory === 'factory' ? 'Factory Made' : 'Handmade');
    }
  }

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price,
    compareAtPrice,
    category: resolvedCategory,
    categoryName: resolvedCategoryName,
    nailShape: p.nail_shape,
    style: p.style,
    lengths: Array.isArray(p.lengths) ? p.lengths : [],
    sizes: (() => {
      // 1. Parse sizes if provided in DB
      let parsed = [];
      if (Array.isArray(p.sizes)) {
        parsed = p.sizes.map(s => String(s).trim()).filter(Boolean);
      } else if (typeof p.sizes === 'string' && p.sizes.trim()) {
        try {
          const j = JSON.parse(p.sizes);
          if (Array.isArray(j)) parsed = j.map(s => String(s).trim()).filter(Boolean);
          else parsed = p.sizes.split(',').map(s => s.trim()).filter(Boolean);
        } catch {
          parsed = p.sizes.split(',').map(s => s.trim()).filter(Boolean);
        }
      }

      // 1. If explicit sizes exist in DB, preserve them exactly (some sets are only in one size)
      if (parsed.length > 0) return parsed;

      // 2. Factory Made press-ons are 24-piece full covers (only factory made cards don't have sizing)
      const isFactory = resolvedCategory === 'factory' || resolvedCategoryName?.toLowerCase().includes('factory');
      if (isFactory) return [];

      // 3. For all other products (handmade, Halloween, capsules), default to S, M, L
      return ["S", "M", "L"];
    })(),
    images: p.images,
    image: p.images?.[0] || null,
    videoUrl: p.video_url || null,
    newArrival: p.new_arrival,
    bestseller: p.bestseller,
    featured: Boolean(p.featured || p.bestseller),
    inStock: p.stock_count > 0,
    stockCount: p.stock_count,
    createdAt: p.created_at,
    color: (() => {
      if (Array.isArray(p.color) && p.color.length > 0) return String(p.color[0]).trim();
      if (typeof p.color === 'string' && p.color.trim()) return p.color.split(',')[0].trim();
      if (Array.isArray(p.colors) && p.colors.length > 0) return String(p.colors[0]).trim();
      return null;
    })(),
    colors: (() => {
      const list = [];
      if (Array.isArray(p.color)) list.push(...p.color);
      else if (typeof p.color === 'string' && p.color.trim()) list.push(...p.color.split(','));
      if (Array.isArray(p.colors)) list.push(...p.colors);
      else if (typeof p.colors === 'string' && p.colors.trim()) list.push(...p.colors.split(','));
      return Array.from(new Set(list.map(c => String(c).trim()).filter(Boolean)));
    })(),
    discountPercent: discount > 0 ? discount : null,
  };
};

import { FALLBACK_RAW_PRODUCTS } from './fallbackData';

// Fisher-Yates shuffle to randomize products
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const getProducts = cache(async () => {
  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");
  const discount = await getSitewideDiscount();

  if (!isPlaceholder) {
    try {
      const { data, error } = await supabase.from('products').select('*, categories(slug, name)');
      if (!error && data && data.length > 0) {
        return shuffleArray(data.map((p) => mapProduct(p, discount)));
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local dataset:', e.message);
    }
  }

  // Graceful local development fallback
  return shuffleArray(FALLBACK_RAW_PRODUCTS.map((p) => mapProduct(p, discount)));
});

export async function getProductBySlug(slug) {
  if (!slug) return null;
  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");
  const discount = await getSitewideDiscount();

  if (!isPlaceholder) {
    try {
      const { data, error } = await supabase.from('products').select('*, categories(slug, name)').eq('slug', slug).maybeSingle();
      if (!error && data) {
        return mapProduct(data, discount);
      }
    } catch (e) {
      console.warn(`Supabase getProductBySlug(${slug}) failed, checking local dataset:`, e.message);
    }
  }

  const found = FALLBACK_RAW_PRODUCTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  return found ? mapProduct(found, discount) : null;
}

export async function getProductsByCategory(categorySlug) {
  const all = await getProducts();
  const filtered = all.filter((p) => p.category === categorySlug);
  return filtered;
}

export async function getProductsByIds(ids) {
  if (!ids || ids.length === 0) return [];
  const all = await getProducts();
  return all.filter((p) => ids.includes(p.id) || ids.includes(String(p.id)));
}

export async function getFeaturedProducts() {
  const all = await getProducts();
  return all.filter((p) => p.featured || p.bestseller);
}

export async function getBestsellers() {
  const all = await getProducts();
  return all.filter((p) => p.bestseller);
}

export async function searchProducts(query) {
  if (!query) return [];
  const all = await getProducts();
  const q = query.toLowerCase();
  return all.filter((p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
}

export async function getCategories() {
  try {
    const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");
    if (isPlaceholder) {
      const { getLocalCollections } = await import('./collectionsStore');
      return getLocalCollections();
    }
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true });
    if (error || !data || data.length === 0) {
      const { getLocalCollections } = await import('./collectionsStore');
      return getLocalCollections();
    }
    return data;
  } catch {
    const { getLocalCollections } = await import('./collectionsStore');
    return getLocalCollections();
  }
}

export async function getPublishedCategories() {
  const all = await getCategories();
  return all.filter((c) => c.is_published !== false);
}

export async function getCategoryBySlug(slug) {
  if (!slug) return null;
  const categories = await getCategories();
  const match = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  return match || null;
}

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

  // Relational Category Mapping (Foolproof & Independent of Prices):
  const rawCatSlug = (p.categories?.slug || p.category || '').toLowerCase().trim();
  const rawCatName = (p.categories?.name || p.category_name || '').toLowerCase().trim();
  const rawTags = (p.style || p.tags || '').toLowerCase();

  let resolvedCategory = 'handmade';
  if (rawCatSlug.includes('factory') || rawCatName.includes('factory') || rawTags.includes('factory')) {
    resolvedCategory = 'factory';
  } else if (rawCatSlug.includes('handmade') || rawCatName.includes('handmade') || rawTags.includes('handmade')) {
    resolvedCategory = 'handmade';
  } else if (p.categories?.slug) {
    resolvedCategory = p.categories.slug;
  }

  const resolvedCategoryName = resolvedCategory === 'factory' ? 'Factory Made' : 'Handmade';

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
    sizes: resolvedCategory === 'handmade' 
      ? (Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ["S", "M", "L"]) 
      : [],
    images: p.images,
    image: p.images?.[0] || null,
    videoUrl: p.video_url || null,
    newArrival: p.new_arrival,
    bestseller: p.bestseller,
    inStock: p.stock_count > 0,
    stockCount: p.stock_count,
    createdAt: p.created_at,
    tags: [],
    color: p.color ? p.color.split(',')[0].trim() : null,
    colors: (() => {
      if (!p.color) return [];
      return p.color.split(',').map(c => c.trim()).filter(Boolean);
    })(),
    discountPercent: discount > 0 ? discount : null,
  };
};

// Fisher-Yates shuffle to randomize products
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export async function getProducts() {
  const [{ data, error }, discount] = await Promise.all([
    supabase.from('products').select('*, categories(slug, name)'),
    getSitewideDiscount(),
  ]);
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return shuffleArray(data.map((p) => mapProduct(p, discount)));
}

export async function getProductBySlug(slug) {
  const [{ data, error }, discount] = await Promise.all([
    supabase.from('products').select('*, categories(slug, name)').eq('slug', slug).maybeSingle(),
    getSitewideDiscount(),
  ]);
  if (error || !data) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
  return mapProduct(data, discount);
}

export async function getProductsByCategory(categorySlug) {
  const [{ data, error }, discount] = await Promise.all([
    supabase.from('products').select('*, categories(slug, name)'),
    getSitewideDiscount(),
  ]);
  if (error || !data) return [];
  
  const mapped = data.map((p) => mapProduct(p, discount));
  const filtered = mapped.filter((p) => p.category === categorySlug);
  return shuffleArray(filtered);
}

export async function getProductsByIds(ids) {
  if (!ids || ids.length === 0) return [];
  const [{ data, error }, discount] = await Promise.all([
    supabase.from('products').select('*, categories(slug, name)').in('id', ids),
    getSitewideDiscount(),
  ]);
  if (error) return [];
  return data.map((p) => mapProduct(p, discount));
}

export async function getFeaturedProducts() {
  const [{ data, error }, discount] = await Promise.all([
    supabase.from('products').select('*, categories(slug, name)').eq('bestseller', true),
    getSitewideDiscount(),
  ]);
  if (error) return [];
  return shuffleArray(data.map((p) => mapProduct(p, discount)));
}

export async function getBestsellers() {
  const [{ data, error }, discount] = await Promise.all([
    supabase.from('products').select('*, categories(slug, name)').eq('bestseller', true),
    getSitewideDiscount(),
  ]);
  if (error) return [];
  return shuffleArray(data.map((p) => mapProduct(p, discount)));
}

export async function searchProducts(query) {
  if (!query) return [];
  const [{ data, error }, discount] = await Promise.all([
    supabase.from('products').select('*, categories(slug, name)').ilike('name', `%${query}%`),
    getSitewideDiscount(),
  ]);
  if (error) return [];
  return data.map((p) => mapProduct(p, discount));
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  if (error) return [];
  return data;
}

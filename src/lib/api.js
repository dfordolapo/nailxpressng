import { supabase } from './supabase';

// Helper to map DB snake_case fields to camelCase for the frontend components
const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  description: p.description,
  price: Number(p.price),
  compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : null,
  category: p.categories?.slug || null,
  categoryName: p.categories?.name || null,
  nailShape: p.nail_shape,
  style: p.style,
  lengths: ["Short", "Medium", "Long", "Extra Long"],
  sizes: ["S", "M", "L"],
  images: p.images,
  image: p.images?.[0] || null,
  newArrival: p.new_arrival,
  bestseller: p.bestseller,
  inStock: p.stock_count > 0,
  stockCount: p.stock_count,
  createdAt: p.created_at,
  tags: [],
  colors: []
});

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)');
    
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data.map(mapProduct);
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .eq('slug', slug)
    .single();
    
  if (error || !data) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
  return mapProduct(data);
}

export async function getProductsByCategory(categorySlug) {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (!category) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .eq('category_id', category.id);
    
  if (error) return [];
  return data.map(mapProduct);
}

export async function getFeaturedProducts() {
  // Using bestseller or newArrival as a proxy for featured if we don't have a featured flag
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .eq('bestseller', true)
    .limit(8);
    
  if (error) return [];
  return data.map(mapProduct);
}

export async function getBestsellers() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .eq('bestseller', true);
    
  if (error) return [];
  return data.map(mapProduct);
}

export async function searchProducts(query) {
  if (!query) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .ilike('name', `%${query}%`);
    
  if (error) return [];
  return data.map(mapProduct);
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
    
  if (error) return [];
  return data;
}

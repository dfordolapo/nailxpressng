import { getProducts } from '@/lib/api';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng';

  // Core Static Routes
  const routes = [
    '',
    '/shop',
    '/handmade',
    '/factory',
    '/custom-order',
    '/collection-hub',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '' || route === '/shop' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Product URLs from live Supabase / local catalog
  let allProducts = [];
  try {
    allProducts = await getProducts();
  } catch (err) {
    console.error('Sitemap product fetch error:', err);
  }

  const productRoutes = (allProducts || []).map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...routes, ...productRoutes];
}

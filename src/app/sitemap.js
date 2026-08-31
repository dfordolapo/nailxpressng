import { getProducts } from '@/lib/api';

// Cache/revalidate the sitemap once every hour to prevent cold-start DB timeouts for Googlebot
export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nailexpress.ng';

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

  const productRoutes = (allProducts || [])
    .filter((product) => Boolean(product?.slug)) // Filter out any empty/invalid slugs
    .map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  return [...routes, ...productRoutes];
}


import { products } from '@/data/products';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nailxpressng.vercel.app';

  // Static route mappings
  const routes = [
    '',
    '/shop',
    '/handmade',
    '/factory',
    '/custom-order',
    '/collection-hub',
    '/terms',
    '/checkout',
    '/checkout/success',
    '/search',
    '/wishlist',
    '/cart',

  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic product routes
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...routes, ...productRoutes];
}

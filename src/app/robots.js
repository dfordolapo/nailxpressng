export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/cart',
          '/wishlist',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/.*\.mp4$/],
  publicExcludes: ["!images/salon-tutorial.mp4", "!videos/salon-tutorial.mp4"],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'nailexpress.ng' }],
        destination: 'https://www.nailexpress.ng/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:* https://*.vercel.app https://dolapo.design https://*.dolapo.design;",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ukfwpourkksctwmdgrci.supabase.co' }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default withPWA(nextConfig);

export const metadata = {
  title: "Custom Press-On Nails — Nailexpress",
  description: "Create your custom press-on nail set. Send us your dream nail art design, preferred shape, and exact sizing for bespoke handcrafted perfection.",
  alternates: {
    canonical: "https://www.nailexpress.ng/custom-order",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Custom Press-On Nails — Nailexpress",
    description: "Create your custom press-on nail set. Send us your dream nail art design, preferred shape, and exact sizing for bespoke handcrafted perfection.",
    url: "https://www.nailexpress.ng/custom-order",
    images: [{ url: "/images/custom-orders.png", width: 1200, height: 630, alt: "Custom Press-On Nails" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Press-On Nails — Nailexpress",
    description: "Create your custom press-on nail set. Send us your dream nail art design, preferred shape, and exact sizing for bespoke handcrafted perfection.",
    images: ["/images/custom-orders.png"],
  },
};

export default function CustomOrderLayout({ children }) {
  return children;
}

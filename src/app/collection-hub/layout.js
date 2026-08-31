export const metadata = {
  title: "Explore All Collections — Nailexpress",
  description: "Browse all press-on nail collections. From signature handmade designs to factory styles and bespoke custom sets.",
  openGraph: {
    title: "Explore All Collections — Nailexpress",
    description: "Browse all press-on nail collections. From signature handmade designs to factory styles and bespoke custom sets.",
    images: [{ url: "/images/og-preview.jpg", width: 1200, height: 630, alt: "Nailexpress Collections" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore All Collections — Nailexpress",
    description: "Browse all press-on nail collections. From signature handmade designs to factory styles and bespoke custom sets.",
    images: ["/images/og-preview.jpg"],
  },
};

export default function CollectionHubLayout({ children }) {
  return children;
}

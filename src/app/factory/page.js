import { getProductsByCategory, getFeaturedProducts, getProducts } from "@/lib/api";
import CollectionClient from "@/components/product/CollectionClient";
import FindYourFitQuiz from "@/components/product/FindYourFitQuiz";

export const metadata = {
  title: "Factory Made Nails — Nailexpress",
  description: "Affordable, durable, salon-ready press-on nails. Instant 10-minute application, trendy designs, and long-lasting wear. Order your set today.",
  alternates: {
    canonical: "https://www.nailexpress.ng/factory",
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
    title: "Factory Made Nails — Nailexpress",
    description: "Affordable, durable, salon-ready press-on nails. Instant 10-minute application, trendy designs, and long-lasting wear. Order your set today.",
    url: "https://www.nailexpress.ng/factory",
    images: [{ url: "/images/factory-collection.png", width: 1200, height: 630, alt: "Factory Made Nails Collection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Factory Made Nails — Nailexpress",
    description: "Affordable, durable, salon-ready press-on nails. Instant 10-minute application, trendy designs, and long-lasting wear. Order your set today.",
    images: ["/images/factory-collection.png"],
  },
};

export default async function FactoryPage() {
  const category = { slug: "factory", name: "Factory Made", description: "Precision-crafted nails for perfect consistency and durability." };
  
  // Fetch data on the server
  const allProducts = await getProductsByCategory("factory");
  // Fetch full catalog for the quiz
  const fullCatalog = await getProducts();

  // Specifically select 7 featured designs for the factory marquee (matching handmade's 7 items)
  const marqueeNames = [
    "Bridal Bows", "Rose Pearl", "Cherry Bomb", 
    "Sunset Drops", "Gilded Waves", "Classic French", "Blush Petal"
  ];
  let featuredProducts = allProducts.filter(p => marqueeNames.includes(p.name));
  if (featuredProducts.length < 7) {
    const existingIds = new Set(featuredProducts.map(p => p.id));
    const fallback = allProducts.filter(p => !existingIds.has(p.id));
    featuredProducts = [...featuredProducts, ...fallback].slice(0, 7);
  }

  return (
    <>
      <FindYourFitQuiz allProducts={fullCatalog} hideBanner={true} showFloatingPill={true} />
      <CollectionClient 
        category={category} 
        allProducts={allProducts} 
        featuredProducts={featuredProducts} 
      />
    </>
  );
}

import { getProductsByCategory, getFeaturedProducts, getProducts, getCategoryBySlug } from "@/lib/api";
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

export const revalidate = 3600; // Cache the page for 1 hour for instant load times

export default async function FactoryPage() {
  const dbCategory = await getCategoryBySlug("factory");
  const category = dbCategory || { slug: "factory", name: "Factory Made", description: "Precision-crafted nails for perfect consistency and durability." };
  
  // Fetch data on the server
  const allProducts = await getProductsByCategory("factory");
  // Fetch full catalog for the quiz
  const fullCatalog = await getProducts();

  // Dynamically select products marked featured/bestseller in admin first,
  // supplemented by curated marquee designs so the marquee is always vibrant
  const marqueeNames = [
    "Bridal Bows", "Rose Pearl", "Cherry Bomb", 
    "Sunset Drops", "Gilded Waves", "Classic French", "Blush Petal"
  ];
  const dynamicallyFeatured = allProducts.filter(p => p.featured || p.bestseller);
  const curatedFallback = allProducts.filter(p => marqueeNames.includes(p.name));

  const featuredMap = new Map();
  dynamicallyFeatured.forEach(p => featuredMap.set(p.id, p));
  curatedFallback.forEach(p => { if (!featuredMap.has(p.id)) featuredMap.set(p.id, p); });
  allProducts.forEach(p => { if (!featuredMap.has(p.id) && featuredMap.size < 7) featuredMap.set(p.id, p); });

  const featuredProducts = Array.from(featuredMap.values()).slice(0, Math.max(7, dynamicallyFeatured.length));

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

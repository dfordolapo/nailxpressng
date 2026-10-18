import { getProductsByCategory, getProducts, getCategoryBySlug } from "@/lib/api";
import CollectionClient from "@/components/product/CollectionClient";
import FindYourFitQuiz from "@/components/product/FindYourFitQuiz";

export const metadata = {
  title: "Handmade Nails — Nailexpress",
  description: "Discover our signature handmade press-on nails. Individually hand-painted in-house with salon-grade strength, custom sizing, and reusable wear.",
  alternates: {
    canonical: "https://www.nailexpress.ng/handmade",
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
    title: "Handmade Nails — Nailexpress",
    description: "Discover our signature handmade press-on nails. Individually hand-painted in-house with salon-grade strength, custom sizing, and reusable wear.",
    url: "https://www.nailexpress.ng/handmade",
    images: [{ url: "/images/handmade-collection.png", width: 1200, height: 630, alt: "Handmade Nails Collection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Handmade Nails — Nailexpress",
    description: "Discover our signature handmade press-on nails. Individually hand-painted in-house with salon-grade strength, custom sizing, and reusable wear.",
    images: ["/images/handmade-collection.png"],
  },
};

export const revalidate = 3600; // Cache the page for 1 hour for instant load times

export default async function HandmadePage() {
  const dbCategory = await getCategoryBySlug("handmade");
  const category = dbCategory || { slug: "handmade", name: "Handmade", description: "Artisan-crafted nail sets painted by hand. Each piece is unique." };
  
  // Fetch data on the server
  const allProducts = await getProductsByCategory("handmade");
  
  // Fetch full catalog for the quiz
  const fullCatalog = await getProducts();
  
  // Dynamically select products marked featured/bestseller in admin first,
  // supplemented by curated marquee designs so the marquee is always vibrant
  const marqueeNames = [
    "Fierce Bloom", "Glazed Pearl", "Vibrant Bloom", 
    "Glazed Dawn", "Matte Dawn", "Velvet Aura", "Vibrant Gem"
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

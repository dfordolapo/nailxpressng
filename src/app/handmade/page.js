import { getProductsByCategory, getProducts } from "@/lib/api";
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

export default async function HandmadePage() {
  const category = { slug: "handmade", name: "Handmade", description: "Artisan-crafted nail sets painted by hand. Each piece is unique." };
  
  // Fetch data on the server
  const allProducts = await getProductsByCategory("handmade");
  
  // Fetch full catalog for the quiz
  const fullCatalog = await getProducts();
  
  // Specifically select the ones requested for the marquee
  const marqueeNames = [
    "Fierce Bloom", "Glazed Pearl", "Vibrant Bloom", 
    "Glazed Dawn", "Matte Dawn", "Velvet Aura", "Vibrant Gem"
  ];
  const featuredProducts = allProducts.filter(p => marqueeNames.includes(p.name));

  return (
    <>
      <FindYourFitQuiz allProducts={fullCatalog} hideBanner={true} />
      <CollectionClient 
        category={category} 
        allProducts={allProducts} 
        featuredProducts={featuredProducts} 
      />
    </>
  );
}

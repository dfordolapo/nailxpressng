import { getProductsByCategory, getFeaturedProducts } from "@/lib/api";
import CollectionClient from "@/components/product/CollectionClient";

export const metadata = {
  title: "Handmade Nails — Nailexpress",
  description: "Shop our collection of beautifully crafted handmade press-on nails.",
};

export default async function HandmadePage() {
  const category = { slug: "handmade", name: "Handmade", description: "Artisan-crafted nail sets painted by hand. Each piece is unique." };
  
  // Fetch data on the server
  const allProducts = await getProductsByCategory("handmade");
  
  // Specifically select the ones requested for the marquee
  const marqueeNames = [
    "Fierce Bloom", "Glazed Pearl", "Vibrant Bloom", 
    "Glazed Dawn", "Matte Dawn", "Velvet Aura", "Vibrant Gem"
  ];
  const featuredProducts = allProducts.filter(p => marqueeNames.includes(p.name));

  return (
    <CollectionClient 
      category={category} 
      allProducts={allProducts} 
      featuredProducts={featuredProducts} 
    />
  );
}

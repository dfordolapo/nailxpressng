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
  const allFeatured = await getFeaturedProducts();
  const featuredProducts = allFeatured.filter(p => p.category === "handmade");

  return (
    <CollectionClient 
      category={category} 
      allProducts={allProducts} 
      featuredProducts={featuredProducts} 
    />
  );
}

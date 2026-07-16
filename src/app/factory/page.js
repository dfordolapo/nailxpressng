import { getProductsByCategory, getFeaturedProducts } from "@/lib/api";
import CollectionClient from "@/components/product/CollectionClient";

export const metadata = {
  title: "Factory Made Nails — Nailexpress",
  description: "Precision-crafted nails for perfect consistency and durability.",
};

export default async function FactoryPage() {
  const category = { slug: "factory", name: "Factory Made", description: "Precision-crafted nails for perfect consistency and durability." };
  
  // Fetch data on the server
  const allProducts = await getProductsByCategory("factory");
  const allFeatured = await getFeaturedProducts();
  const featuredProducts = allFeatured.filter(p => p.category === "factory");

  return (
    <CollectionClient 
      category={category} 
      allProducts={allProducts} 
      featuredProducts={featuredProducts} 
    />
  );
}

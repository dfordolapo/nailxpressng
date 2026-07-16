import { getProducts, getFeaturedProducts } from "@/lib/api";
import CollectionClient from "@/components/product/CollectionClient";

export const metadata = {
  title: "Shop All Products — Nailexpress",
  description: "Browse our entire collection of press-on nails.",
};

export default async function ShopPage() {
  const category = { slug: "shop", name: "Shop All", description: "Browse our entire collection of press-on nails." };
  
  // Fetch data on the server
  const allProducts = await getProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <CollectionClient 
      category={category} 
      allProducts={allProducts} 
      featuredProducts={featuredProducts} 
    />
  );
}

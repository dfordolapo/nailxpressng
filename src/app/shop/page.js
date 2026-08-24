import { getProducts, getFeaturedProducts } from "@/lib/api";
import CollectionClient from "@/components/product/CollectionClient";
import FindYourFitQuiz from "@/components/product/FindYourFitQuiz";

export const metadata = {
  title: "Shop All Products — Nailexpress",
  description: "Browse our entire collection of press-on nails.",
};

export default async function ShopPage() {
  const category = { slug: "shop", name: "Shop All", description: "Browse our entire collection of press-on nails." };
  
  // Fetch data on the server
  const allProducts = await getProducts();
  const featuredProducts = await getFeaturedProducts();
  console.log("DEBUG: Bridal Bows => ", allProducts.find(p => p.name === 'Bridal Bows'));

  return (
    <>
      <div style={{ padding: "0 5%" }}>
        <FindYourFitQuiz allProducts={allProducts} hideBanner={true} />
      </div>
      <CollectionClient 
        category={category} 
        allProducts={allProducts} 
        featuredProducts={featuredProducts} 
      />
    </>
  );
}

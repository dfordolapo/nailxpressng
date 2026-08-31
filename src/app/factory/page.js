import { getProductsByCategory, getFeaturedProducts, getProducts } from "@/lib/api";
import CollectionClient from "@/components/product/CollectionClient";
import FindYourFitQuiz from "@/components/product/FindYourFitQuiz";

export const metadata = {
  title: "Factory Made Nails — Nailexpress",
  description: "Affordable, durable, salon-ready press-on nails. Instant 10-minute application, trendy designs, and long-lasting wear. Order your set today.",
  openGraph: {
    title: "Factory Made Nails — Nailexpress",
    description: "Affordable, durable, salon-ready press-on nails. Instant 10-minute application, trendy designs, and long-lasting wear. Order your set today.",
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

  const allFeatured = await getFeaturedProducts();
  const featuredProducts = allFeatured.filter(p => p.category === "factory");

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

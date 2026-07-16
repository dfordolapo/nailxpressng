import { getProductBySlug, getProductsByCategory } from "@/lib/api";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: `${product.name} — Nailexpress`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductBySlug(params.slug);
  
  let relatedProducts = [];
  if (product && product.category) {
    const categoryProducts = await getProductsByCategory(product.category);
    relatedProducts = categoryProducts
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  }

  return (
    <ProductClient 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}

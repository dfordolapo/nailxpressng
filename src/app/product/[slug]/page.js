import { getProductBySlug, getProductsByCategory } from "@/lib/api";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product Not Found" };
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nailxpressng.vercel.app";
  const imageUrl = product.images?.[0] ?? `${baseUrl}/og-default.jpg`;
  return {
    title: `${product.name} — Nailexpress`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Nailexpress`,
      description: product.description,
      url: `${baseUrl}/product/${product.slug}`,
      type: "product",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Nailexpress`,
      description: product.description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
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

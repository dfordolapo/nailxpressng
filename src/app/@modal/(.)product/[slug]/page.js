import { getProductBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductQuickView from "@/components/product/ProductQuickView";

export default async function ProductModalPage({ params }) {
  let product = null;
  try {
    const { slug } = await params;
    product = await getProductBySlug(slug);
  } catch (err) {
    console.error("ProductModalPage error:", err);
  }

  if (!product) {
    notFound();
  }

  return (
    <ProductQuickView product={product} />
  );
}

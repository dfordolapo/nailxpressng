import { getProductBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductQuickView from "@/components/product/ProductQuickView";

export default async function ProductModalPage({ params }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      notFound();
    }

    return (
        <ProductQuickView product={product} />
    );
  } catch (err) {
    console.error("ProductModalPage error:", err);
    notFound();
  }
}

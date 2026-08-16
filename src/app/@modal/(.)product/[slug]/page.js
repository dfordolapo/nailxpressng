import { getProductBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductModalWrapper from "@/components/ui/ProductModalWrapper";
import ProductQuickView from "@/components/product/ProductQuickView";

export default async function ProductModalPage({ params }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      notFound();
    }

    return (
      <ProductModalWrapper>
        <ProductQuickView product={product} />
      </ProductModalWrapper>
    );
  } catch (err) {
    console.error("ProductModalPage error:", err);
    notFound();
  }
}

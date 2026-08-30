import { getProductBySlug, getProductsByCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) {
      return { title: "Product Not Found — Nailexpress" };
    }
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nailexpress.ng";
    const imageUrl = product.images?.[0] ?? `${baseUrl}/images/og-preview.jpg`;
    return {
      title: `${product.name} — Nailexpress`,
      description: product.description,
      openGraph: {
        title: `${product.name} — Nailexpress`,
        description: product.description,
        url: `${baseUrl}/product/${product.slug}`,
        siteName: "Nailexpress",
        type: "website",
        images: [{ url: imageUrl, width: 1000, height: 1000, alt: product.name }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} — Nailexpress`,
        description: product.description,
        images: [imageUrl],
      },
    };
  } catch (err) {
    console.error("generateMetadata error:", err);
    return { title: "Product — Nailexpress" };
  }
}

export default async function ProductDetailPage({ params }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      notFound();
    }

    let relatedProducts = [];
    if (product.category) {
      try {
        const categoryProducts = await getProductsByCategory(product.category);
        relatedProducts = categoryProducts
          .filter((p) => p.id !== product.id)
          .slice(0, 4);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    }

    return (
      <ProductClient
        product={product}
        relatedProducts={relatedProducts}
      />
    );
  } catch (err) {
    console.error("ProductDetailPage error:", err);
    notFound();
  }
}

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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nailexpress.ng";
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nailexpress.ng";
    const productUrl = `${baseUrl}/product/${product.slug}`;
    const productImageUrl = product.images?.[0] ? (product.images[0].startsWith('http') ? product.images[0] : `${baseUrl}${product.images[0]}`) : `${baseUrl}/images/og-preview.jpg`;

    // Rich Product Schema for Google Search Rich Snippets & Shopping
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.images && product.images.length > 0 
        ? product.images.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`)
        : [productImageUrl],
      "description": product.description || `Buy ${product.name} luxury press-on nails in Nigeria at Nailexpress.`,
      "sku": product.id || product.slug,
      "brand": {
        "@type": "Brand",
        "name": "Nailexpress"
      },
      "offers": {
        "@type": "Offer",
        "url": productUrl,
        "priceCurrency": "NGN",
        "price": product.price,
        "priceValidUntil": "2027-12-31",
        "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": "Nailexpress"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "28"
      }
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <ProductClient
          product={product}
          relatedProducts={relatedProducts}
        />
      </>
    );
  } catch (err) {
    console.error("ProductDetailPage error:", err);
    notFound();
  }
}

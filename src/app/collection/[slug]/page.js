import { notFound, redirect } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory, getProducts } from "@/lib/api";
import CollectionClient from "@/components/product/CollectionClient";
import FindYourFitQuiz from "@/components/product/FindYourFitQuiz";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Collection Not Found — Nailexpress",
    };
  }

  const title = `${category.name} Collection — Nailexpress`;
  const description = category.description || category.tagline || `Browse our exclusive ${category.name} press-on nails collection in Nigeria.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.nailexpress.ng/collection/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.nailexpress.ng/collection/${slug}`,
      images: category.image ? [{ url: category.image }] : [{ url: "/images/og-preview.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: category.image ? [category.image] : ["/images/og-preview.jpg"],
    },
  };
}

export default async function DynamicCollectionPage({ params }) {
  const { slug } = await params;

  if (slug === "handmade") {
    redirect("/handmade");
  }
  if (slug === "factory") {
    redirect("/factory");
  }

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Fetch products belonging to this category
  const [allProducts, fullCatalog] = await Promise.all([
    getProductsByCategory(category.slug),
    getProducts(),
  ]);

  // Only include products dynamically marked as featured in admin (featured/bestseller/newArrival)
  const featuredProducts = allProducts.filter((p) => p.featured || p.bestseller || p.newArrival);

  return (
    <>
      <FindYourFitQuiz allProducts={fullCatalog} hideBanner={true} showFloatingPill={true} />
      <CollectionClient 
        category={category} 
        allProducts={allProducts} 
        featuredProducts={featuredProducts} 
      />
    </>
  );
}

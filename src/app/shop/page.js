import { getProducts, getFeaturedProducts } from "@/lib/api";
import CollectionClient from "@/components/product/CollectionClient";
import FindYourFitQuiz from "@/components/product/FindYourFitQuiz";

export const metadata = {
  title: "Shop All Luxury Press-On Nails — Nailexpress",
  description: "Browse our complete collection of press-on nails. From signature hand-painted designs to everyday salon-grade staples. Find your perfect fit and order.",
  alternates: {
    canonical: "https://www.nailexpress.ng/shop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Shop All Luxury Press-On Nails — Nailexpress",
    description: "Browse our complete collection of press-on nails. From signature hand-painted designs to everyday salon-grade staples. Find your perfect fit and order.",
    url: "https://www.nailexpress.ng/shop",
    images: [{ url: "/images/og-preview.jpg", width: 1200, height: 630, alt: "Nailexpress Shop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Luxury Press-On Nails — Nailexpress",
    description: "Browse our complete collection of press-on nails. From signature hand-painted designs to everyday salon-grade staples. Find your perfect fit and order.",
    images: ["/images/og-preview.jpg"],
  },
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

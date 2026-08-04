import { getFeaturedProducts } from "@/lib/api";
import { products as fallbackProducts } from "@/data/products";
import CartClient from "./CartClient";

export const metadata = {
  title: "Shopping Cart — Nailexpress",
  description: "View and checkout your selected press-on nails.",
};

export default async function CartPage() {
  let allFeatured = [];
  try {
    allFeatured = await getFeaturedProducts();
  } catch (e) {
    allFeatured = [];
  }

  if (!allFeatured || allFeatured.length === 0) {
    allFeatured = fallbackProducts.filter((p) => p.bestseller || p.featured);
  }

  const bestsellers = allFeatured.slice(0, 4);

  return <CartClient bestsellers={bestsellers} />;
}


import { getFeaturedProducts } from "@/lib/api";
import CartClient from "./CartClient";

export const metadata = {
  title: "Shopping Cart — Nailexpress",
  description: "View and checkout your selected press-on nails.",
};

export default async function CartPage() {
  const allFeatured = await getFeaturedProducts();
  const bestsellers = allFeatured.slice(0, 4);
  
  return <CartClient bestsellers={bestsellers} />;
}

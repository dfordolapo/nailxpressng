import HeroBanner from "@/components/home/HeroBanner";
import BestSellers from "@/components/home/BestSellers";
import ShopTheLook from "@/components/home/ShopTheLook";

export const metadata = {
  title: "Nailexpress — Press-On Perfection",
  description: "Premium press-on nails — handmade artistry & factory precision. Shop handmade and factory-made press-on nails. Express yourself, one nail at a time.",
};

export default function HomePage() {
  return (
    <div style={{ backgroundColor: "#F5E3E5", minHeight: "100vh" }}>
      <HeroBanner />
      <BestSellers />
      <ShopTheLook />
    </div>
  );
}

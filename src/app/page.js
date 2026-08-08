import HeroSection from "@/components/home/HeroSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import Features from "@/components/home/Features";
import VideoSection from "@/components/home/VideoSection";
import Testimonials from "@/components/home/Testimonials";
import ShopTheLook from "@/components/home/ShopTheLook";
import HowToMeasure from "@/components/home/HowToMeasure";
import GiftBoxBanner from "@/components/home/GiftBoxBanner";
import FAQSection from "@/components/home/FAQSection";
import FooterHero from "@/components/home/FooterHero";

export const metadata = {
  title: "Nailexpress — Press-On Perfection",
  description: "Press-on perfection — handmade artistry & factory precision. Shop handmade and factory-made press-on nails. Express yourself, one nail at a time.",
};

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryShowcase />
      <Features />
      <VideoSection />
      <Testimonials />
      <ShopTheLook />
      <HowToMeasure />
      <GiftBoxBanner />
      <FAQSection />
      <FooterHero />
    </div>
  );
}

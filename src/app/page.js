import HeroSection from "@/components/home/HeroSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import ShopTheLook from "@/components/home/ShopTheLook";
import HowToMeasure from "@/components/home/HowToMeasure";
import GiftBoxBanner from "@/components/home/GiftBoxBanner";
import FAQSection from "@/components/home/FAQSection";
import FooterHero from "@/components/home/FooterHero";

export const metadata = {
  title: "Nailexpress — Press-On Perfection",
  description: "Premium press-on nails — handmade artistry & factory precision. Shop handmade and factory-made press-on nails. Express yourself, one nail at a time.",
};

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryShowcase />
      <Features />
      <Testimonials />
      <ShopTheLook />
      <HowToMeasure />
      <GiftBoxBanner />
      <FAQSection />
      <FooterHero />
      {/* 
        This is where we will progressively rebuild the components section by section.
        Currently remaining to build:
        - FooterHero (Done)
        - Personalize 
      */}
    </div>
  );
}

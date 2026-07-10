import HeroSection from "@/components/home/HeroSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import ShopTheLook from "@/components/home/ShopTheLook";
import HowToMeasure from "@/components/home/HowToMeasure";
import GiftBoxBanner from "@/components/home/GiftBoxBanner";
import FAQSection from "@/components/home/FAQSection";
import FooterHero from "@/components/home/FooterHero";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Nailexpress — Press-On Perfection",
  description: "Premium press-on nails — handmade artistry & factory precision. Shop handmade and factory-made press-on nails. Express yourself, one nail at a time.",
};

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ScrollReveal animation="fade-up">
        <CategoryShowcase />
      </ScrollReveal>
      <ScrollReveal animation="fade-up" delay={100}>
        <Features />
      </ScrollReveal>
      <ScrollReveal animation="fade-up" delay={100}>
        <Testimonials />
      </ScrollReveal>
      <ScrollReveal animation="fade-left">
        <ShopTheLook />
      </ScrollReveal>
      <ScrollReveal animation="fade-right">
        <HowToMeasure />
      </ScrollReveal>
      <ScrollReveal animation="scale">
        <GiftBoxBanner />
      </ScrollReveal>
      <ScrollReveal animation="fade-up" delay={100}>
        <FAQSection />
      </ScrollReveal>
      <div style={{ height: "40px", background: "linear-gradient(to bottom, var(--color-bg), var(--color-bg-warm))" }} />
      <ScrollReveal animation="fade-up">
        <FooterHero />
      </ScrollReveal>
    </div>
  );
}

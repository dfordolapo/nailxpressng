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
  description: "Shop luxury handmade and factory-made press-on nails in Nigeria. Hand-painted artistry, durable instant fit, and nationwide delivery.",
  openGraph: {
    title: "Nailexpress — Press-On Perfection",
    description: "Salon-quality manicures delivered in minutes. Elevate your everyday style with reusable designer sets, custom fit guides, and nationwide doorstep delivery.",
    images: [
      {
        url: "/images/og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Nailexpress Luxury Press-On Nails",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nailexpress — Press-On Perfection",
    description: "Salon-quality manicures delivered in minutes. Elevate your everyday style with reusable designer sets and custom fit guides.",
    images: ["/images/og-preview.jpg"],
  },
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

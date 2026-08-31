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
  title: "Nailexpress — Premium Press-On Nails in Nigeria",
  description: "Shop premium press-on nails in Nigeria, from handmade artistry to factory precision. Reusable salon-grade sets, instant application & fast nationwide delivery.",
  openGraph: {
    title: "Nailexpress — Premium Press-On Nails in Nigeria",
    description: "Shop premium press-on nails in Nigeria, from handmade artistry to factory precision. Reusable salon-grade sets, instant application & fast nationwide delivery.",
    images: [
      {
        url: "/images/og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Nailexpress — Premium Press-On Nails",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nailexpress — Premium Press-On Nails in Nigeria",
    description: "Shop premium press-on nails in Nigeria, from handmade artistry to factory precision. Reusable salon-grade sets, instant application & fast nationwide delivery.",
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

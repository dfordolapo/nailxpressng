import dynamic from "next/dynamic";
import HeroSection from "@/components/home/HeroSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import Features from "@/components/home/Features";

const VideoSection = dynamic(() => import("@/components/home/VideoSection"));
const Testimonials = dynamic(() => import("@/components/home/Testimonials"));
const ShopTheLook = dynamic(() => import("@/components/home/ShopTheLook"));
const FindYourFitQuiz = dynamic(() => import("@/components/product/FindYourFitQuiz"));
const HowToMeasure = dynamic(() => import("@/components/home/HowToMeasure"));
const GiftBoxBanner = dynamic(() => import("@/components/home/GiftBoxBanner"));
const FAQSection = dynamic(() => import("@/components/home/FAQSection"));
const FooterHero = dynamic(() => import("@/components/home/FooterHero"));
import { getProducts } from "@/lib/api";

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

export const revalidate = 3600; // Cache the page for 1 hour for instant load times

export default async function Home() {
  const allProducts = await getProducts();

  return (
    <div>
      <HeroSection />
      <CategoryShowcase />
      <Features />
      <VideoSection />
      <Testimonials />
      <ShopTheLook />
      <div style={{ padding: "0 5%", maxWidth: "1200px", margin: "0 auto" }}>
        <FindYourFitQuiz allProducts={allProducts} hideBanner={false} />
      </div>
      <HowToMeasure />
      <GiftBoxBanner />
      <FAQSection />
      <FooterHero />
    </div>
  );
}

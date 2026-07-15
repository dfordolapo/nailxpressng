import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SearchProvider } from "@/context/SearchContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchOverlay from "@/components/ui/SearchOverlay";
import OfflineBanner from "@/components/ui/OfflineBanner";

export const viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "Nailexpress — Press-On Perfection",
  description: "Press-on perfection — handmade artistry & factory precision. Express yourself, one nail at a time. Shop handmade and factory-made press-on nails in Nigeria.",
  keywords: "press-on nails, handmade nails, factory nails, nail art, Nigeria, custom nails",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nailexpress",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Nailexpress — Press-On Perfection",
    description: "Press-on perfection — handmade artistry & factory precision.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#D4AF7A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <Header />
              <SearchOverlay />
              <main>{children}</main>
              <Footer />
              <OfflineBanner />
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

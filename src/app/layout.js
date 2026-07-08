import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SearchProvider } from "@/context/SearchContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchOverlay from "@/components/ui/SearchOverlay";

export const metadata = {
  title: "Nailexpress — Premium Press-On Nails",
  description: "Premium press-on nails — handmade artistry & factory precision. Express yourself, one nail at a time. Shop handmade and factory-made press-on nails in Nigeria.",
  keywords: "press-on nails, handmade nails, factory nails, nail art, Nigeria, custom nails",
  openGraph: {
    title: "Nailexpress — Premium Press-On Nails",
    description: "Premium press-on nails — handmade artistry & factory precision.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <Header />
              <SearchOverlay />
              <main>{children}</main>
              <Footer />
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

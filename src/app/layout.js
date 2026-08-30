import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SearchProvider } from "@/context/SearchContext";
import { ToastProvider } from "@/context/ToastContext";
import { SplashProvider } from "@/context/SplashContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchOverlay from "@/components/ui/SearchOverlay";
import OfflineBanner from "@/components/ui/OfflineBanner";
import SplashAnimation from "@/components/ui/SplashAnimation";
import PullToRefresh from "@/components/ui/PullToRefresh";
import InstallPrompt from "@/components/layout/InstallPrompt";

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#FAF8F5" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng'),
  title: {
    default: "Nailexpress — Buy Luxury Press-On Nails in Nigeria | Handmade & Factory Made",
    template: "%s | Nailexpress Nigeria",
  },
  description: "Shop luxury handmade and factory-made press-on nails in Nigeria. Hand-painted artistry, durable instant fit, custom sets, and wholesale salon delivery across Lagos, Abuja, and nationwide.",
  keywords: [
    "press-on nails Nigeria",
    "buy press on nails Lagos",
    "handmade press-on nails Nigeria",
    "luxury press on nails",
    "custom nail art Nigeria",
    "press on nails Abuja",
    "wholesale press-on nails Nigeria",
    "reusable fake nails Nigeria",
    "nail extension kit",
    "salon press ons"
  ],
  authors: [{ name: "Nailexpress" }],
  creator: "Nailexpress",
  publisher: "Nailexpress",
  alternates: {
    canonical: "https://nailexpress.ng",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Nailexpress — Press-On Perfection",
    description: "Your go-to destination for high-end press-on sets. Elevate your look in minutes with effortless glamour and flawless durability.",
    url: "https://nailexpress.ng",
    siteName: "Nailexpress",
    images: [
      {
        url: "/images/og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Nailexpress — Press-On Perfection",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nailexpress — Press-On Perfection",
    description: "Your go-to destination for high-end press-on sets. Elevate your look in minutes with effortless glamour and flawless durability.",
    images: ["/images/og-preview.jpg"],
    creator: "@nailexpressng",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icons/icon-192x192.png",
    apple: "/splash/apple-icon-180.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nailexpress",
    startupImage: [
      { url: "/splash/apple-splash-2064-2752.jpg", media: "(device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2064-2752.jpg", media: "(device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2752-2064.jpg", media: "(device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2752-2064.jpg", media: "(device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2048-2732.jpg", media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2048-2732.jpg", media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2732-2048.jpg", media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2732-2048.jpg", media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1668-2420.jpg", media: "(device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1668-2420.jpg", media: "(device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2420-1668.jpg", media: "(device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2420-1668.jpg", media: "(device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1668-2388.jpg", media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1668-2388.jpg", media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2388-1668.jpg", media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2388-1668.jpg", media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1668-2224.jpg", media: "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1668-2224.jpg", media: "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2224-1668.jpg", media: "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2224-1668.jpg", media: "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1536-2048.jpg", media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1536-2048.jpg", media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2048-1536.jpg", media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2048-1536.jpg", media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1640-2360.jpg", media: "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1640-2360.jpg", media: "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2360-1640.jpg", media: "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2360-1640.jpg", media: "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1620-2160.jpg", media: "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1620-2160.jpg", media: "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2160-1620.jpg", media: "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2160-1620.jpg", media: "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1488-2266.jpg", media: "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1488-2266.jpg", media: "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2266-1488.jpg", media: "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2266-1488.jpg", media: "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1320-2868.jpg", media: "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1320-2868.jpg", media: "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2868-1320.jpg", media: "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2868-1320.jpg", media: "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1206-2622.jpg", media: "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1206-2622.jpg", media: "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2622-1206.jpg", media: "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2622-1206.jpg", media: "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1260-2736.jpg", media: "(device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1260-2736.jpg", media: "(device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2736-1260.jpg", media: "(device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2736-1260.jpg", media: "(device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1290-2796.jpg", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1290-2796.jpg", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2796-1290.jpg", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2796-1290.jpg", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1179-2556.jpg", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1179-2556.jpg", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2556-1179.jpg", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2556-1179.jpg", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1170-2532.jpg", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1170-2532.jpg", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2532-1170.jpg", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2532-1170.jpg", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1284-2778.jpg", media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1284-2778.jpg", media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2778-1284.jpg", media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2778-1284.jpg", media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1080-2340.jpg", media: "(device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1080-2340.jpg", media: "(device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2340-1080.jpg", media: "(device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2340-1080.jpg", media: "(device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1242-2688.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1242-2688.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2688-1242.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2688-1242.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1125-2436.jpg", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1125-2436.jpg", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2436-1125.jpg", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2436-1125.jpg", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-828-1792.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-828-1792.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1792-828.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1792-828.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1242-2208.jpg", media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1242-2208.jpg", media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-2208-1242.jpg", media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-2208-1242.jpg", media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-750-1334.jpg", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-750-1334.jpg", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1334-750.jpg", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1334-750.jpg", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-640-1136.jpg", media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-640-1136.jpg", media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait) and (prefers-color-scheme: dark)" },
      { url: "/splash/apple-splash-1136-640.jpg", media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: light)" },
      { url: "/splash/apple-splash-1136-640.jpg", media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape) and (prefers-color-scheme: dark)" }
    ],
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

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <ToastProvider>
                <SplashProvider>
                  <SplashAnimation />
                  <Header />
                  <SearchOverlay />
                  <PullToRefresh>
                    <main>{children}</main>
                  </PullToRefresh>
                  {modal}
                  <Footer />
                  <OfflineBanner />
                  <InstallPrompt />
                </SplashProvider>
              </ToastProvider>
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

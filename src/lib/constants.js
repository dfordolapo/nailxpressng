export const SITE_NAME = "Nailexpress";
export const SITE_TAGLINE = "Press-On Perfection";
export const SITE_DESCRIPTION = "Press-on perfection — handmade artistry & factory precision. Express yourself, one nail at a time.";

export const CURRENCY = "₦";
export const CURRENCY_CODE = "NGN";

export const FREE_SHIPPING_THRESHOLD = 20000; // Free shipping over ₦20,000
export const FLAT_SHIPPING_RATE = 2500;

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/nailexpress.ng",
  tiktok: "https://tiktok.com/@nailexpress.ng",
  telegram: "https://t.me/nailexpressng",
  whatsapp: "https://wa.me/2349081872514",
};

export const WHATSAPP_MESSAGES = {
  customOrder: "Hi! I'm interested in placing a custom order. I'd love to design my own nail set.",
  wholesale: "Hi! I'm interested in wholesale pricing. I'd like to discuss bulk orders.",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Handmade", href: "/handmade" },
  { label: "Factory Made", href: "/factory" },
  { label: "Custom Order", href: SOCIAL_LINKS.whatsapp },
  { label: "Admin", href: "/admin/login" },
];

export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export const ANNOUNCEMENT_TEXT = "✨ Free shipping on orders over ₦20,000 ✨";

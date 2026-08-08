import { CURRENCY, FLAT_SHIPPING_RATE } from "./constants";

/**
 * Format price in Naira
 */
export function formatPrice(amount) {
  return `${CURRENCY}${amount.toLocaleString("en-NG")}`;
}

/**
 * Calculate shipping cost based on subtotal
 */
export function calculateShipping(subtotal) {
  // Free shipping removed based on user request
  return FLAT_SHIPPING_RATE;
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, shipping, total, itemCount };
}

/**
 * Generate a URL-safe slug from a string
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Truncate text to a certain length
 */
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercent(price, compareAtPrice) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Debounce function for search input
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * cn — simple class name joiner (replaces clsx)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

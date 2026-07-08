"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { getProductBySlug, products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import pageStyles from "@/styles/pages/collection.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (item) => {
    const fullProduct = products.find((p) => p.id === item.id);
    if (fullProduct) {
      addItem(fullProduct, 1, "M", "medium");
      removeItem(item.id);
    }
  };

  if (items.length === 0) {
    return (
      <div className={pageStyles.wishlistPage}>
        <div className="container" style={{ textAlign: "center", padding: "var(--space-20) 0" }}>
          <div style={{ fontSize: "4rem", marginBottom: "var(--space-6)", opacity: 0.5 }}>💝</div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-3xl)", fontStyle: "italic", marginBottom: "var(--space-3)" }}>
            Your Wishlist is Empty
          </h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
            Save your favorite nail sets here for later!
          </p>
          <Link href="/" className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.lg}`}>
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={pageStyles.wishlistPage} id="wishlist-page">
      <div className="container">
        <div className={pageStyles.wishlistHeader}>
          <h1 className={pageStyles.wishlistTitle}>
            Wishlist <span className={pageStyles.wishlistCount}>({items.length})</span>
          </h1>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "var(--space-6)",
        }}>
          {items.map((item) => (
            <div key={item.id} style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border-light)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              transition: "all var(--transition-base)",
            }}>
              <Link href={`/product/${item.slug}`}>
                <div style={{
                  aspectRatio: "3 / 4",
                  background: "linear-gradient(135deg, var(--color-primary-100), var(--color-surface))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                }}>
                  💅
                </div>
              </Link>
              <div style={{ padding: "var(--space-4)" }}>
                <p style={{
                  fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "var(--color-primary)", fontWeight: 600, marginBottom: "var(--space-1)",
                }}>
                  {item.category}
                </p>
                <h3 style={{
                  fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)",
                  fontWeight: 500, marginBottom: "var(--space-2)",
                }}>
                  {item.name}
                </h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                  <span style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>{formatPrice(item.price)}</span>
                  {item.compareAtPrice && (
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)", textDecoration: "line-through" }}>
                      {formatPrice(item.compareAtPrice)}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <button
                    className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.sm}`}
                    style={{ flex: 1 }}
                    onClick={() => handleMoveToCart(item)}
                  >
                    Move to Bag
                  </button>
                  <button
                    className={`${btnStyles.btn} ${btnStyles.ghost} ${btnStyles.sm}`}
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

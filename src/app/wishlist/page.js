"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { getProductBySlug, products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react";
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-8)" }}>
          <Link href="/" style={{ color: "var(--color-primary-light)", display: "flex", alignItems: "center" }}>
            <ArrowLeft size={24} strokeWidth={1.5} />
          </Link>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-primary)", margin: 0, lineHeight: 1 }}>My Wishlist</h1>
          <div style={{ width: 24 }}></div>
        </div>
        


        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}>
          {items.map((item) => (
            <div key={item.id} style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border-light)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              display: "flex",
              gap: "var(--space-4)",
              padding: "var(--space-3)",
              position: "relative"
            }}>
              <Link href={`/product/${item.slug}`} style={{ flexShrink: 0 }}>
                <div style={{
                  width: "100px",
                  height: "100px",
                  background: "var(--color-bg-warm)",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : "💅"}
                </div>
              </Link>
              
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "2px" }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>
                      Medium • Almond
                    </p>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ color: "var(--color-pink)", background: "transparent", border: "none" }}>
                    <Heart size={20} fill="var(--color-pink)" />
                  </button>
                </div>
                
                <div style={{ fontSize: "0.875rem", fontWeight: 600, marginTop: "4px" }}>
                  {formatPrice(item.price)}
                </div>
                
                <button
                  onClick={() => handleMoveToCart(item)}
                  style={{
                    marginTop: "auto",
                    width: "fit-content",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    background: "var(--color-pink-50)",
                    border: "1px solid var(--color-pink-light)",
                    color: "var(--color-pink)",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 600
                  }}
                >
                  <ShoppingBag size={14} /> Move to bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react";
import pageStyles from "@/styles/pages/collection.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (item) => {
    // Construct the product format CartContext expects (needs images array)
    const cartProductFormat = {
      ...item,
      images: [item.image]
    };
    addItem(cartProductFormat, 1, "M", "medium");
    removeItem(item.id);
  };

  if (items.length === 0) {
    return (
      <div className={pageStyles.wishlistPage} style={{ minHeight: "75vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="container" style={{ textAlign: "center" }}>


          <h2 style={{ fontSize: "1.125rem", color: "var(--color-primary-800)", marginBottom: "var(--space-2)", fontFamily: "var(--font-heading)" }}>Nothing catching your eye?</h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", maxWidth: "600px", margin: "0 auto var(--space-12) auto", textWrap: "balance" }}>
            Your wishlist is looking bare. Tap the heart icon on any set to save it for later.
          </p>
          <Link href="/" className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.md}`}>
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
                    <Image src={item.image} alt={item.name} width={100} height={100} style={{ objectFit: "cover" }} />
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
                  <button onClick={() => removeItem(item.id)} style={{ color: "var(--color-warning)", background: "transparent", border: "none" }}>
                    <Heart size={20} fill="var(--color-warning)" />
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
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "nowrap",
                    gap: "var(--space-2)",
                    background: "var(--color-primary-50)",
                    border: "1px solid var(--color-primary-100)",
                    color: "var(--color-primary)",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    whiteSpace: "nowrap"
                  }}
                >
                  <ShoppingBag size={14} strokeWidth={1.5} style={{ flexShrink: 0 }} /> 
                  <span style={{ position: "relative", top: "1px" }}>Move to cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice, calculateCartTotals } from "@/lib/utils";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import styles from "@/styles/components/cart.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

export default function CartClient({ bestsellers = [] }) {
  const { items, removeItem, updateQuantity, addItem } = useCart();
  const [standardShipping, setStandardShipping] = useState(2500);
  const { subtotal, total, itemCount } = calculateCartTotals(items);
  // Re-calculate total with dynamic standard shipping
  const dynamicTotal = subtotal + standardShipping;

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.delivery_locations && data.delivery_locations.length > 0) {
            setStandardShipping(data.delivery_locations[0].fee);
          } else if (data.shipping_standard) {
            setStandardShipping(data.shipping_standard);
          }
        }
      } catch (e) {}
    }
    fetchRates();
  }, []);

  if (items.length === 0) {
    return (
      <div className={styles.cartPage}>
        <div className="container">
          <div className={styles.emptyCart}>
            <div className={styles.emptyIcon}>🛍️</div>
            <p className={styles.emptyText} style={{ fontSize: "0.875rem" }}>You haven&apos;t added any nail sets to your cart yet. Let&apos;s fix that!</p>
            <Link href="/" className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.md}`}>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage} id="cart-page">
      <div className="container">
        
        {/* Header matching mockup */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-6)" }}>
          <Link href="/" style={{ color: "var(--color-primary-light)", display: "flex", alignItems: "center" }}>
            <ArrowLeft size={24} strokeWidth={1.5} />
          </Link>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-primary)", margin: 0, lineHeight: 1 }}>My Cart</h1>
          <div style={{ width: 24 }}></div>
        </div>



        <div className={styles.cartGrid}>
          {/* Cart Items */}
          <div>
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedLength}`} className={styles.cartItem}>
                <div className={styles.cartItemImage}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, var(--color-primary-100), var(--color-surface))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    💅
                  </div>
                </div>
                <div className={styles.cartItemDetails}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <Link href={`/product/${item.slug}`} className={styles.cartItemName}>
                        {item.name}
                      </Link>
                      <p className={styles.cartItemMeta}>
                        {item.selectedSize ? `${item.selectedSize === 'M' ? 'Medium' : item.selectedSize} • ` : ""}{item.selectedLength.charAt(0).toUpperCase() + item.selectedLength.slice(1)}
                      </p>
                      <div className={styles.cartItemPrice} style={{ marginTop: "4px" }}>{formatPrice(item.price)}</div>
                    </div>
                  </div>
                  
                  <div className={styles.cartItemActions}>
                    <div className={styles.quantitySelector}>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedLength, item.quantity - 1)}
                      >−</button>
                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedLength, item.quantity + 1)}
                      >+</button>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id, item.selectedSize, item.selectedLength)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* You may also like Section */}
          <div className={styles.recommendationsSection}>
            <h3 className={styles.recommendationsTitle}>You may also like</h3>
            <div className={styles.sliderContainer}>
              {bestsellers.map(product => (
                <div key={product.id} className={styles.sliderItem}>
                  <Link href={`/product/${product.slug}`} className={styles.sliderImage} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      background: "var(--color-bg-warm)",
                      textDecoration: "none"
                    }}>
                    💅
                  </Link>
                  <div className={styles.sliderName}>{product.name}</div>
                  <div className={styles.sliderPriceRow}>
                    <span className={styles.sliderPrice}>{formatPrice(product.price)}</span>
                    <button 
                      className={styles.addBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        const cartProductFormat = {
                          ...product,
                          images: product.images || []
                        };
                        addItem(cartProductFormat, 1, "M", "medium");
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summaryCard} style={{ background: "transparent", border: "none", padding: 0 }}>
            <div className={styles.summaryRow}>
              <span>Subtotal ({itemCount} items)</span>
              <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping (Est.)</span>
              <span style={{ fontWeight: 600, color: "var(--color-text)" }}>
                {formatPrice(standardShipping)}
              </span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(dynamicTotal)}</span>
            </div>
            <Link
              href="/checkout"
              className={`${btnStyles.btn} ${btnStyles.lg} ${styles.checkoutBtn}`}
              style={{ background: "var(--color-primary)", color: "white", border: "none", borderRadius: "12px", margin: "var(--space-6) auto 0 auto", display: "flex", width: "250px", justifyContent: "center" }}
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

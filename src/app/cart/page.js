"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, calculateCartTotals } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { getBestsellers } from "@/data/products";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import styles from "@/styles/components/cart.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const { subtotal, shipping, total, itemCount } = calculateCartTotals(items);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const bestsellers = getBestsellers().slice(0, 4);

  if (items.length === 0) {
    return (
      <div className={styles.cartPage}>
        <div className="container">
          <div className={styles.emptyCart}>
            <div className={styles.emptyIcon}>🛍️</div>
            <h1 className={styles.emptyTitle}>Your bag is empty</h1>
            <p className={styles.emptyText}>Looks like you haven&apos;t added anything yet. Let&apos;s fix that!</p>
            <Link href="/" className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.lg}`}>
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
          <Link href="/" style={{ color: "var(--color-primary-light)" }}>
            <ArrowLeft size={24} strokeWidth={1.5} />
          </Link>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>My Cart</h1>
          <div style={{ width: 24 }}></div>
        </div>

        {/* Free Shipping Progress */}
        {amountToFreeShipping > 0 && (
          <div style={{
            background: "var(--color-bg-card)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-3) var(--space-4)",
            marginBottom: "var(--space-6)",
            fontSize: "0.75rem",
            color: "var(--color-text)",
            textAlign: "center",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--color-border-light)"
          }}>
            <div style={{ marginBottom: "var(--space-2)" }}>
              🛍️ You&apos;re {formatPrice(amountToFreeShipping)} away from <strong>FREE shipping!</strong>
            </div>
            <div style={{
              height: 6,
              background: "var(--color-bg-warm)",
              borderRadius: "var(--radius-full)",
              overflow: "hidden",
              margin: "0 auto",
              width: "80%"
            }}>
              <div style={{
                height: "100%",
                width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                background: "var(--color-btn-gradient)",
                borderRadius: "var(--radius-full)",
                transition: "width var(--transition-base)",
              }} />
            </div>
          </div>
        )}

        <div className={styles.cartGrid}>
          {/* Cart Items */}
          <div>
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedLength}`} className={styles.cartItem}>
                <div className={styles.cartItemImage}>
                  <img src={item.image || "/images/hero.png"} alt={item.name} />
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
                  <Link href={`/product/${product.slug}`} className={styles.sliderImage}>
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                    ) : "💅"}
                  </Link>
                  <div className={styles.sliderName}>{product.name}</div>
                  <div className={styles.sliderPriceRow}>
                    <span className={styles.sliderPrice}>{formatPrice(product.price)}</span>
                    <button className={styles.addBtn}>+</button>
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
              <span>Shipping</span>
              <span className={shipping === 0 ? styles.freeShipping : ""} style={{ fontWeight: 600, color: "var(--color-text)" }}>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
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

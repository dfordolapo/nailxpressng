"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, calculateCartTotals } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import styles from "@/styles/components/cart.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const { subtotal, shipping, total, itemCount } = calculateCartTotals(items);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

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
        <h1 className={styles.cartTitle}>
          Your Bag <span className={styles.cartCount}>({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
        </h1>

        {/* Free Shipping Progress */}
        {amountToFreeShipping > 0 && (
          <div style={{
            background: "var(--color-primary-50)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-3) var(--space-5)",
            marginBottom: "var(--space-6)",
            fontSize: "var(--text-sm)",
            color: "var(--color-primary-700)",
            fontWeight: 500,
          }}>
            ✨ Add {formatPrice(amountToFreeShipping)} more for FREE shipping!
            <div style={{
              marginTop: "var(--space-2)",
              height: 4,
              background: "var(--color-primary-200)",
              borderRadius: "var(--radius-full)",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                background: "var(--color-primary)",
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
                  <div style={{
                    width: "100%", height: "100%",
                    background: "linear-gradient(135deg, var(--color-primary-100), var(--color-surface))",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem",
                  }}>
                    💅
                  </div>
                </div>
                <div className={styles.cartItemDetails}>
                  <Link href={`/product/${item.slug}`} className={styles.cartItemName}>
                    {item.name}
                  </Link>
                  <p className={styles.cartItemMeta}>
                    {item.selectedSize ? `Size: ${item.selectedSize} • ` : ""}Length: {item.selectedLength}
                  </p>
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
                    >
                      Remove
                    </button>
                  </div>
                  <span className={styles.cartItemPrice}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={shipping === 0 ? styles.freeShipping : ""}>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.lg} ${btnStyles.full} ${styles.checkoutBtn}`}
              id="proceed-checkout"
            >
              Proceed to Checkout
            </Link>
            <Link href="/" className={styles.continueShopping}>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

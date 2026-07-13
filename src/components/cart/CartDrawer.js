"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, calculateCartTotals } from "@/lib/utils";
import styles from "@/styles/components/cart.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function CartDrawer({ onClose }) {
  const { items, removeItem, updateQuantity } = useCart();
  const { subtotal, shipping, total, itemCount } = calculateCartTotals(items);

  return (
    <>
      <div className={styles.drawerOverlay} onClick={onClose} />
      <div className={styles.drawer} id="cart-drawer">
        {/* Header */}
        <div className={styles.drawerHeader}>
          <h3 className={styles.drawerTitle}>Your Bag ({itemCount})</h3>
          <button className={styles.drawerClose} onClick={onClose} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className={styles.drawerContent}>
          {/* Items */}
          <div className={styles.drawerItems}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyIcon}>🛍️</div>
              <p className={styles.emptyText} style={{ fontSize: "0.875rem" }}>You haven&apos;t added any nail sets to your cart yet. Let&apos;s fix that!</p>
              <button
                className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.md}`}
                onClick={onClose}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
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
                  <h4 className={styles.cartItemName}>{item.name}</h4>
                  <p className={styles.cartItemMeta}>
                    Size: {item.selectedSize} • Length: {item.selectedLength}
                  </p>
                  <div className={styles.cartItemActions}>
                    <div className={styles.quantitySelector}>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedLength, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedLength, item.quantity + 1)}
                      >
                        +
                      </button>
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
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.drawerFooter}>
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
              onClick={onClose}
              id="checkout-btn"
            >
              Checkout — {formatPrice(total)}
            </Link>
            <Link href="/cart" className={styles.continueShopping} onClick={onClose}>
              View full cart
            </Link>
          </div>
        )}
        </div>
      </div>
    </>
  );
}

"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice, calculateCartTotals } from "@/lib/utils";
import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from "@/lib/constants";
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
  const { items, addItem, removeItem, updateQuantity, updateItemOptions } = useCart();
  const [standardShipping, setStandardShipping] = useState(2500);
  const { subtotal, itemCount } = calculateCartTotals(items);
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

  return (
    <>
      <motion.div 
        className={styles.drawerOverlay} 
        onClick={onClose} 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div 
        className={styles.drawer} 
        id="cart-drawer"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Header */}
        <div className={styles.drawerHeader}>
          <h3 className={styles.drawerTitle}>Your Cart ({itemCount})</h3>
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
                  <div style={{ position: "relative", width: "100%", height: "100%", background: "linear-gradient(135deg, var(--color-primary-100), var(--color-surface))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.image || (item.images && item.images[0]) ? (
                      <Image src={item.image || item.images[0]} alt={item.name} fill sizes="100px" style={{ objectFit: "cover" }} />
                    ) : null}
                  </div>
                </div>
                <div className={styles.cartItemDetails}>
                  <h4 className={styles.cartItemName}>{item.name}</h4>
                  {(item.selectedSize || item.selectedLength) && (
                    <div className={styles.cartItemMetaSelectors}>
                    {item.selectedSize && (
                      <div className={styles.metaSelectWrapper}>
                        <label className={styles.metaLabel}>Size:</label>
                        <select
                          className={styles.metaSelect}
                          value={item.selectedSize}
                          onChange={(e) => {
                            if (e.target.value === "Customize") {
                              const productUrl = `${window.location.origin}/product/${item.slug}`;
                              const message = `Hi! I'd like to customize the nail set "${item.name}".\n\nProduct Link: ${productUrl}`;
                              const url = `${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(message)}`;
                              window.location.href = url;
                              return;
                            }
                            updateItemOptions(
                              item.id,
                              item.selectedSize,
                              item.selectedLength,
                              e.target.value,
                              item.selectedLength
                            );
                          }}
                        >
                          {["S", "M", "L", "Customize"].map((s) => (
                            <option key={s} value={s}>
                              {s === "M" ? "M (Most Popular)" : s}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}


                  </div>)}
                  <div className={styles.cartItemControls} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {item.category === 'handmade' && (
                        <button
                          onClick={() => {
                            const existingSizes = items
                              .filter(i => i.id === item.id)
                              .map(i => i.selectedSize);
                            const nextSize = ["S", "M", "L"].find(s => !existingSizes.includes(s)) || "M";
                            addItem(
                              { id: item.id, slug: item.slug, name: item.name, price: item.price, images: [item.image], category: item.category },
                              1,
                              nextSize,
                              item.selectedLength
                            );
                          }}
                          style={{ background: "none", border: "none", color: "var(--color-primary)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", padding: 0, whiteSpace: "nowrap" }}
                        >
                          + Add size
                        </button>
                      )}
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id, item.selectedSize, item.selectedLength)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className={styles.cartItemPrice}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping (Est.)</span>
              <span>
                {formatPrice(standardShipping)}
              </span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(dynamicTotal)}</span>
            </div>
            <Link
              href="/checkout"
              className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.lg} ${btnStyles.full} ${styles.checkoutBtn}`}
              onClick={onClose}
              id="checkout-btn"
            >
              Checkout — {formatPrice(dynamicTotal)}
            </Link>
            <Link href="/cart" className={styles.continueShopping} onClick={onClose}>
              View full cart
            </Link>
          </div>
        )}
      </motion.div>
    </>
  );
}

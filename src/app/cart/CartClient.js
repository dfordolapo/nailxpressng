"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice, calculateCartTotals } from "@/lib/utils";
import { Trash2, ArrowLeft, ShoppingBag, Check } from "lucide-react";
import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from "@/lib/constants";
import styles from "@/styles/components/cart.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

export default function CartClient({ bestsellers = [] }) {
  const { items, removeItem, updateQuantity, updateItemOptions, addItem } = useCart();
  const { showToast } = useToast();
  const [standardShipping, setStandardShipping] = useState(2500);
  const [addedMap, setAddedMap] = useState({});
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
                  <div style={{ position: "relative", width: "100%", height: "100%", background: "linear-gradient(135deg, var(--color-primary-100), var(--color-surface))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.image || (item.images && item.images[0]) ? (
                      <Image src={item.image || item.images[0]} alt={item.name} fill sizes="120px" style={{ objectFit: "cover" }} />
                    ) : null}
                  </div>
                </div>
                <div className={styles.cartItemDetails}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <Link href={`/product/${item.slug}`} className={styles.cartItemName}>
                        {item.name}
                      </Link>
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
                              {["S", "M", "L", "Customize"]
                                .concat(
                                  item.selectedSize && !["S", "M", "L", "Customize"].includes(item.selectedSize)
                                    ? [item.selectedSize]
                                    : []
                                )
                                .map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}


                      </div>
                      )}
                      <div className={styles.cartItemPrice} style={{ marginTop: "4px" }}>{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                  
                  <div className={styles.cartItemActions} style={{ justifyContent: "flex-start", gap: "16px", marginTop: 0 }}>
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
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* You may also like Section */}
          {bestsellers && bestsellers.length > 0 && (
            <div className={styles.recommendationsSection}>
              <h3 className={styles.recommendationsTitle}>You may also like</h3>
              <div className={styles.sliderContainer}>
                {bestsellers.map((product) => {
                  const isAdded = !!addedMap[product.id];
                  const imgUrl = product.image || (product.images && product.images[0]);

                  return (
                    <div key={product.id} className={styles.sliderItem}>
                      <Link href={`/product/${product.slug}`} className={styles.sliderImage}>
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={product.name}
                            fill
                            sizes="140px"
                            style={{ objectFit: "cover", borderRadius: "inherit" }}
                          />
                        ) : (
                          "💅"
                        )}
                      </Link>
                      <div className={styles.sliderName}>{product.name}</div>
                      <div className={styles.sliderPriceRow}>
                        <span className={styles.sliderPrice}>{formatPrice(product.price)}</span>
                        <button
                          type="button"
                          className={`${styles.addBtn} ${isAdded ? styles.addBtnAdded : ""}`}
                          aria-label={`Add ${product.name} to cart`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const cartProductFormat = {
                              ...product,
                              images: product.images && product.images.length > 0
                                ? product.images
                                : (imgUrl ? [imgUrl] : [])
                            };

                            const defaultSize = product.sizes && product.sizes.length > 0
                              ? (product.sizes.includes("M") ? "M" : product.sizes[0])
                              : null;
                            const defaultLength = product.lengths && product.lengths.length > 0
                              ? (product.lengths.includes("Medium") ? "Medium" : (product.lengths.includes("medium") ? "medium" : product.lengths[0]))
                              : "Medium";

                            addItem(cartProductFormat, 1, defaultSize, defaultLength);

                            setAddedMap((prev) => ({ ...prev, [product.id]: true }));
                            setTimeout(() => {
                              setAddedMap((prev) => ({ ...prev, [product.id]: false }));
                            }, 1800);
                            showToast(`"${product.name}" added to cart`);
                          }}
                        >
                          {isAdded ? <Check size={14} strokeWidth={2.5} /> : "+"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className={styles.summaryCard}>
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

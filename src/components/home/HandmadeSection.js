"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { getProductsByCategory } from "@/data/products";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import styles from "./HandmadeSection.module.css";

function HeartIcon({ filled }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function FlipIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function HandmadeCard({ product, index }) {
  const [flipped, setFlipped] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [qtyAnim, setQtyAnim] = useState("");
  const [added, setAdded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef(null);

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const discount = getDiscountPercent(product.price, product.compareAtPrice);
  const wishlisted = isInWishlist(product.id);

  const handleMouseMove = useCallback((e) => {
    if (flipped || (typeof window !== 'undefined' && window.innerWidth <= 768)) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
  }, [flipped]);

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleFlip = (e) => {
    e.stopPropagation();
    setFlipped(!flipped);
    setTilt({ x: 0, y: 0 });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleItem(product);
  };

  const handleQty = (delta, e) => {
    e.stopPropagation();
    const newQty = qty + delta;
    if (newQty < 1 || newQty > 10) return;
    setQtyAnim(delta > 0 ? "slideUp" : "slideDown");
    setQty(newQty);
    setTimeout(() => setQtyAnim(""), 200);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const size = product.category === "handmade"
      ? (selectedSize || (product.sizes ? product.sizes[Math.floor(product.sizes.length / 2)] : null))
      : null;
    const length = product.lengths[Math.floor(product.lengths.length / 2)];
    addItem(product, qty, size, length);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleSizeSelect = (size, e) => {
    e.stopPropagation();
    setSelectedSize(size === selectedSize ? null : size);
  };

  const tiltStyle = !flipped && isHovering
    ? { transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)` }
    : {};

  return (
    <div
      className={styles.cardWrapper}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={styles.cardInner}
        style={!flipped ? tiltStyle : {}}
      >
        {/* ═══ FRONT ═══ */}
        <div className={`${styles.cardFront} ${flipped ? styles.hidden : ""}`} onClick={handleFlip}>
          <div className={styles.imageArea}>
            <div
              className={styles.flatLay}
              style={{
                background: `linear-gradient(135deg, var(--color-primary-100), var(--color-bg-warm))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3.5rem",
              }}
            >
              💅
            </div>

            {/* Shine sweep */}
            <div className={styles.shine} />

            {/* Badges */}
            <div className={styles.badges}>
              {discount > 0 && (
                <span className={`${styles.badge} ${styles.badgeSale}`}>-{discount}%</span>
              )}
              {product.newArrival && (
                <span className={`${styles.badge} ${styles.badgeNew}`}>New</span>
              )}
              {product.bestseller && (
                <span className={`${styles.badge} ${styles.badgeBestseller}`}>Bestseller</span>
              )}
            </div>

            <div className={styles.glowRing} />
          </div>

          <div className={styles.quickActions}>
            <button
              className={`${styles.quickAction} ${wishlisted ? styles.active : ""}`}
              onClick={handleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <HeartIcon filled={wishlisted} />
            </button>
          </div>

          {/* Info */}
          <div className={styles.frontInfo}>
            <h3 className={styles.name}>{product.name}</h3>
            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>
            <div className={styles.rating}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <span>({product.reviewCount})</span>
            </div>
          </div>

          {/* Flip Hint */}
          <button className={styles.flipHint} onClick={handleFlip}>
            Quick add
            <FlipIcon />
          </button>
        </div>

        {/* ═══ BACK ═══ */}
        <div className={`${styles.cardBack} ${!flipped ? styles.hidden : ""}`}>
          <div className={styles.backHeader}>
            <h3 className={styles.backName}>{product.name}</h3>
            <span className={styles.backPrice}>{formatPrice(product.price)}</span>
          </div>

          <p className={styles.backDesc}>{product.shortDescription}</p>

          {/* Size Selector */}
          <div className={styles.selectorGroup}>
            <span className={styles.selectorLabel}>Select Size</span>
            <div className={styles.sizeOptions}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizePill} ${selectedSize === size ? styles.selected : ""}`}
                  onClick={(e) => handleSizeSelect(size, e)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className={styles.qtyRow}>
            <span className={styles.selectorLabel}>Quantity</span>
            <div className={styles.qtyControl}>
              <button
                className={styles.qtyBtn}
                onClick={(e) => handleQty(-1, e)}
                disabled={qty <= 1}
              >
                −
              </button>
              <div className={styles.qtyValue}>
                <span className={`${styles.qtyNumber} ${qtyAnim ? styles[qtyAnim] : ""}`} key={qty}>
                  {qty}
                </span>
              </div>
              <button
                className={styles.qtyBtn}
                onClick={(e) => handleQty(1, e)}
                disabled={qty >= 10}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            className={`${styles.addBtn} ${added ? styles.added : styles.default}`}
            onClick={handleAddToCart}
          >
            <span className={styles.addBtnContent}>
              {added ? (
                <>
                  <CheckIcon />
                  Added to Cart
                </>
              ) : (
                "Add to Cart"
              )}
            </span>
          </button>

          {/* Actions */}
          <div className={styles.backActions}>
            <button className={styles.flipBackBtn} onClick={handleFlip}>
              <ArrowLeftIcon />
              Back
            </button>
            <Link
              href={`/product/${product.slug}`}
              className={styles.viewLink}
              onClick={(e) => e.stopPropagation()}
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

              {/* Shine sweep */}
              <div className={styles.shine} />

              {/* Badges */}
              <div className={styles.badges}>
                {discount > 0 && (
                  <span className={`${styles.badge} ${styles.badgeSale}`}>-{discount}%</span>
                )}
                {product.newArrival && (
                  <span className={`${styles.badge} ${styles.badgeNew}`}>New</span>
                )}
                {product.bestseller && (
                  <span className={`${styles.badge} ${styles.badgeBestseller}`}>Bestseller</span>
                )}
              </div>

              {/* Quick Actions */}
              <div className={styles.quickActions}>
                <button
                  className={`${styles.quickAction} ${wishlisted ? styles.active : ""}`}
                  onClick={handleWishlist}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <HeartIcon filled={wishlisted} />
                </button>
              </div>

              {/* Glow Ring */}
              <div className={styles.glowRing} />

            </div>

            {/* Info */}
            <div className={styles.frontInfo}>
              <h3 className={styles.name}>{product.name}</h3>
              <div className={styles.priceRow}>
                <span className={styles.price}>{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <span className={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</span>
                )}
              </div>
            </div>

            {/* Flip Hint */}
            <button className={styles.flipHint} onClick={handleFlip}>
              Quick add
              <FlipIcon />
            </button>
          </div>
        ) : (
          /* ═══ BACK ═══ */
          <div className={styles.cardBack}>
          <div className={styles.backHeader}>
            <h3 className={styles.backName}>{product.name}</h3>
            <span className={styles.backPrice}>{formatPrice(product.price)}</span>
          </div>

          <p className={styles.backDesc}>{product.shortDescription}</p>

          {/* Size Selector */}
          <div className={styles.selectorGroup}>
            <span className={styles.selectorLabel}>Select Size</span>
            <select
              className={styles.sizeDropdown}
              value={selectedSize || ""}
              onChange={(e) => handleSizeSelect(e.target.value, e)}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="" disabled>Select</option>
              {product.sizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className={styles.qtyRow}>
            <span className={styles.selectorLabel}>Quantity</span>
            <div className={styles.qtyControl}>
              <button
                className={styles.qtyBtn}
                onClick={(e) => handleQty(-1, e)}
                disabled={qty <= 1}
              >
                −
              </button>
              <div className={styles.qtyValue}>
                <span className={`${styles.qtyNumber} ${qtyAnim ? styles[qtyAnim] : ""}`} key={qty}>
                  {qty}
                </span>
              </div>
              <button
                className={styles.qtyBtn}
                onClick={(e) => handleQty(1, e)}
                disabled={qty >= 10}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            className={`${styles.addBtn} ${added ? styles.added : styles.default}`}
            onClick={handleAddToCart}
          >
            <span className={styles.addBtnContent}>
              {added ? (
                <>
                  <CheckIcon />
                  Added to Cart
                </>
              ) : (
                "Add to Cart"
              )}
            </span>
          </button>

          {/* Actions */}
          <div className={styles.backActions}>
            <button className={styles.flipBackBtn} onClick={handleFlip}>
              <ArrowLeftIcon />
              Back
            </button>
            <Link
              href={`/product/${product.slug}`}
              className={styles.viewLink}
            >
              View Details
            </Link>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HandmadeSection() {
  const products = getProductsByCategory("handmade");

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Handmade <span className={styles.titleAccent}>Nails</span>
        </h2>
        <p className={styles.subtitle}>Each set is individually crafted — wearable art, made by hand.</p>
      </div>

      <div className={styles.grid}>
        {products.map((product, i) => (
          <HandmadeCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}

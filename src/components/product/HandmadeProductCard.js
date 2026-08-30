"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import ImageZoomModal from "@/components/product/ImageZoomModal";
import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from "@/lib/constants";
import { motion } from "framer-motion";
import styles from "./handmade-card.module.css";

function HeartIcon({ filled }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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


function ZoomInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M8 11h6" />
      <path d="M11 8v6" />
    </svg>
  );
}

export default function HandmadeProductCard({ product, index = 0, viewMode = "grid" }) {
  const [flipped, setFlipped] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [qtyAnim, setQtyAnim] = useState("");
  const [added, setAdded] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef(null);

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const discount = getDiscountPercent(product.price, product.compareAtPrice);
  const wishlisted = isInWishlist(product.id);

  let displayPrice = product.price;

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

  const handleZoom = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsZoomOpen(true);
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
    const finalSize = selectedSize;

    if (!finalSize) {
      showToast("Please select a size");
      return;
    }

    addItem(product, qty, finalSize, null);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    showToast(`"${product.name}" added to cart`);
  };

  const handleSizeSelect = (val, e) => {
    e.stopPropagation();
    setSelectedSize(val);
  };

  const tiltStyle = !flipped && isHovering
    ? { transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)` }
    : {};

  return (
    <>
      <motion.div
        className={styles.cardWrapper}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, delay: (index % 8) * 0.05 }}
      >
      <div
        ref={cardRef}
        className={styles.cardInner}
        style={!flipped ? tiltStyle : {}}
      >
        {/* ═══ FRONT ═══ */}
        <div className={`${styles.cardFront} ${flipped ? styles.hidden : ""}`} onClick={handleFlip}>
          <div className={styles.imageArea}>
            {product.image || (product.images && product.images[0]) ? (
              <Image
                src={product.image || product.images[0]}
                alt={product.name}
                fill
                priority={index < 4}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.flatLay}
                style={{ objectFit: "cover", borderRadius: "var(--radius-xl)" }}
              />
            ) : (
              <div
                className={styles.image}
                style={{
                  background: `linear-gradient(135deg, var(--color-primary-100), var(--color-surface))`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
              </div>
            )}

            
            <button 
              className={styles.quickAction} 
              style={{ position: 'absolute', bottom: '12px', right: '12px', zIndex: 10 }}
              onClick={handleZoom}
              aria-label="Zoom image"
            >
              <ZoomInIcon />
            </button>

            <div className={styles.shine} />

            <div className={styles.badges}>
              {!product.inStock && (
                <span className={`${styles.badge}`} style={{ backgroundColor: "var(--color-surface-hover)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>Sold Out</span>
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

          {viewMode === "list" ? (
            <div className={styles.frontInfo}>
              <h3 className={styles.name}>{product.name}</h3>
              <div className={styles.priceRow}>
                <span className={styles.price}>
                  {formatPrice(product.price)}
                </span>

              </div>
            </div>
          ) : (
            <>
              <div className={styles.frontInfo}>
                <h3 className={styles.name}>{product.name}</h3>
                <div className={styles.priceRow}>
                  <span className={styles.price}>
                    {formatPrice(product.price)}
                  </span>

                </div>
              </div>
              <button className={styles.flipHint} onClick={handleFlip}>
                Quick add
                <FlipIcon />
              </button>
            </>
          )}
        </div>

        {/* ═══ BACK ═══ */}
        {viewMode === "list" ? (
          <div className={`${styles.cardBack} ${!flipped ? styles.hidden : ""}`} onClick={handleFlip}>
            <div className={styles.backContent} onClick={(e) => e.stopPropagation()}>
              {product.category === "handmade" && (
                <div className={styles.selectorGroup}>
                  <span className={styles.selectorLabel}>Size</span>
                  <select
                    className={styles.sizeDropdown}
                    value={selectedSize || ""}
                    onChange={(e) => handleSizeSelect(e.target.value, e)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="" disabled>Select Size</option>
                    {product.sizes?.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}

              {product.category === "handmade" && product.lengths && product.lengths.length > 0 && (
                <div className={styles.selectorGroup}>
                  <span className={styles.selectorLabel}>Length</span>
                  <select
                    className={styles.sizeDropdown}
                    value={selectedLength || ""}
                    onChange={(e) => handleLengthSelect(e.target.value, e)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="" disabled>Select Length</option>
                    {product.lengths.map((length) => (
                      <option key={length} value={length}>{length}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.qtyRow}>
                <span className={styles.selectorLabel}>Quantity</span>
                <div className={styles.qtyControl}>
                  <button className={styles.qtyBtn} onClick={(e) => handleQty(-1, e)} disabled={qty <= 1}>−</button>
                  <div className={styles.qtyValue}>
                    <span className={`${styles.qtyNumber} ${qtyAnim ? styles[qtyAnim] : ""}`} key={qty}>{qty}</span>
                  </div>
                  <button className={styles.qtyBtn} onClick={(e) => handleQty(1, e)} disabled={qty >= 10}>+</button>
                </div>
              </div>

              <button
                className={`${styles.addBtn} ${added ? styles.added : styles.default}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={!product.inStock ? { opacity: 0.5, cursor: "not-allowed" } : {}}
              >
                <span className={styles.addBtnContent}>
                  {!product.inStock ? "Sold Out" : added ? (<><CheckIcon /> Added to Cart</>) : "Add to Cart"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className={`${styles.cardBack} ${!flipped ? styles.hidden : ""}`}>
            <button className={styles.flipBackBtnAbsolute} onClick={handleFlip} aria-label="Go back">
              <ArrowLeftIcon />
            </button>
            
            <div className={styles.backHeader}>
              <h3 className={styles.backName}>{product.name}</h3>
              <span className={styles.backPrice}>{formatPrice(product.price)}</span>
            </div>

            <p className={styles.backDesc}>{product.shortDescription || product.description}</p>

            {product.category === "handmade" && (
              <div className={styles.selectorGroup}>
                <span className={styles.selectorLabel}>Size</span>
                <select
                  className={styles.sizeDropdown}
                  value={selectedSize || ""}
                  onChange={(e) => handleSizeSelect(e.target.value, e)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="" disabled>Select Size</option>
                  {["Small", "Medium", "Large"].map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            <div className={styles.qtyRow}>
              <span className={styles.selectorLabel}>Quantity</span>
              <div className={styles.qtyControl}>
                <button className={styles.qtyBtn} onClick={(e) => handleQty(-1, e)} disabled={qty <= 1}>−</button>
                <div className={styles.qtyValue}>
                  <span className={`${styles.qtyNumber} ${qtyAnim ? styles[qtyAnim] : ""}`} key={qty}>{qty}</span>
                </div>
                <button className={styles.qtyBtn} onClick={(e) => handleQty(1, e)} disabled={qty >= 10}>+</button>
              </div>
            </div>

            <button
                className={`${styles.addBtn} ${added ? styles.added : styles.default}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={!product.inStock ? { opacity: 0.5, cursor: "not-allowed" } : {}}
              >
              <span className={styles.addBtnContent}>
                {!product.inStock ? "Sold Out" : added ? (<><CheckIcon /> Added to Cart</>) : "Add to Cart"}
              </span>
            </button>

            <div className={styles.backActions}>
              <Link
                href={`/product/${product.slug}`}
                className={styles.viewLink}
                prefetch={true}
              >
                Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.div>
      <ImageZoomModal 
        isOpen={isZoomOpen} 
        onClose={() => setIsZoomOpen(false)} 
        imageSrc={product.image || (product.images && product.images[0]) || "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1000&auto=format&fit=crop"}
        altText={product.name}
      />
    </>
  );
}

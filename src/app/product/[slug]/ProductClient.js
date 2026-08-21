"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from "@/lib/constants";
import ProductGrid from "@/components/product/ProductGrid";
import pageStyles from "@/styles/pages/collection.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

function HeartIcon({ filled }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export default function ProductClient({ product, relatedProducts = [], isModal = false }) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedLength, setSelectedLength] = useState(product?.lengths?.[0] || "Medium");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [deliveryPresets, setDeliveryPresets] = useState(null);
  const galleryRef = useRef(null);
  
  const [showSticky, setShowSticky] = useState(false);
  const addToCartRef = useRef(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.delivery_presets) {
          setDeliveryPresets(data.delivery_presets);
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const handleZoomMove = (e) => {
    const el = galleryRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (addToCartRef.current) {
        const rect = addToCartRef.current.getBoundingClientRect();
        // Trigger when the Add to Cart section hits the top of the screen (or header)
        setShowSticky(rect.top < 80);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!product) {
    return (
      <div className={pageStyles.productPage}>
        <div className="container" style={{ textAlign: "center", padding: "var(--space-20) 0" }}>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-4)" }}>Product Not Found</h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/" className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.md}`}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const discount = getDiscountPercent(product.price, product.compareAtPrice);
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    const finalSize = product.category === 'factory' ? null : selectedSize;
    addItem(product, quantity, finalSize, selectedLength);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    showToast(`"${product.name}" added to cart`);
  };

  return (
    <div className={pageStyles.productPage} id={`product-${product.slug}`} style={isModal ? { paddingTop: 0, paddingBottom: 'var(--space-10)' } : {}}>
      <div className="container" style={isModal ? { padding: 'var(--space-4)' } : {}}>
        {/* Breadcrumb */}
        {!isModal && (
          <nav className={pageStyles.breadcrumb} id="breadcrumb">
            <Link href="/">Home</Link>
            <span className={pageStyles.breadcrumbSeparator}>/</span>
            <Link href={`/${product.category}`}>
              {product.category === "handmade" ? "Handmade" : "Factory Made"}
            </Link>
            <span className={pageStyles.breadcrumbSeparator}>/</span>
            <span>{product.name}</span>
          </nav>
        )}

        {/* Product Layout */}
        <div className={pageStyles.productLayout} style={isModal ? { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' } : {}}>
          {/* Gallery */}
          <div className={pageStyles.gallery} style={isModal ? { position: 'relative', top: 0, padding: 0 } : {}}>
            <div
              className={pageStyles.galleryZoomContainer}
              ref={galleryRef}
              onMouseMove={handleZoomMove}
              onMouseLeave={() => setZoomOrigin("50% 50%")}
            >
              <div
                className={pageStyles.galleryZoomInner}
                style={{ transformOrigin: zoomOrigin }}
              >
                {product.images && product.images[selectedImage] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(135deg, var(--color-primary-100), var(--color-surface), var(--color-primary-200))`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "6rem",
                    }}
                  >
                    💅
                  </div>
                )}
              </div>
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className={pageStyles.thumbnails} style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                {product.images.map((imgUrl, i) => (
                  <button
                    key={i}
                    className={`${pageStyles.thumbnail} ${selectedImage === i ? pageStyles.active : ""}`}
                    onClick={() => setSelectedImage(i)}
                    style={{ 
                      position: "relative", 
                      width: "80px", 
                      height: "80px", 
                      borderRadius: "var(--radius-sm)", 
                      overflow: "hidden",
                      border: selectedImage === i ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={pageStyles.productInfo}>
            {/* Badges */}
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              {product.category === "handmade" && (
                <span className={`${btnStyles.badge} ${btnStyles.badgeHandmade}`}>Handmade</span>
              )}
              {discount > 0 && (
                <span className={`${btnStyles.badge} ${btnStyles.badgeSale}`}>-{discount}% OFF</span>
              )}
              {product.newArrival && (
                <span className={`${btnStyles.badge} ${btnStyles.badgeNew}`}>New Arrival</span>
              )}
            </div>

            <h1 className={pageStyles.productName}>{product.name}</h1>


            {/* Price */}
            <div className={pageStyles.productPriceRow}>
              <span className={pageStyles.productPrice}>{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className={pageStyles.productComparePrice}>{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>

            {/* Description */}
            <p className={pageStyles.productDescription}>{product.description}</p>

            {/* Size Selector */}
            {product.category !== 'factory' && (
              <div className={pageStyles.selectorGroup}>
                <span className={pageStyles.selectorLabel}>Size: {selectedSize}</span>
                <div className={pageStyles.selectorOptions}>
                  {(product.sizes ?? []).map((size) => (
                    <button
                      key={size}
                      className={`${pageStyles.selectorOption} ${selectedSize === size ? pageStyles.selected : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Length Selector */}
            <div className={pageStyles.selectorGroup}>
              <span className={pageStyles.selectorLabel}>Length: {selectedLength}</span>
              <div className={pageStyles.selectorOptions}>
                {(product.lengths ?? []).map((length) => (
                  <button
                    key={length}
                    className={`${pageStyles.selectorOption} ${selectedLength === length ? pageStyles.selected : ""}`}
                    onClick={() => setSelectedLength(length)}
                    style={{ textTransform: "capitalize" }}
                  >
                    {length}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className={pageStyles.selectorGroup}>
              <span className={pageStyles.selectorLabel}>Quantity</span>
              <div className={pageStyles.quantityAdjuster}>
                <button
                  className={pageStyles.quantityBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className={pageStyles.quantityDisplay}>
                  {quantity}
                </span>
                <button
                  className={pageStyles.quantityBtn}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className={pageStyles.addToCartSection} ref={addToCartRef}>
              <button
                className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.lg}`}
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                id="add-to-cart-btn"
              >
                {added ? "✓ Added to Cart!" : `Add to Cart — ${formatPrice(product.price * quantity)}`}
              </button>
              <button
                className={`${pageStyles.wishlistBtn} ${wishlisted ? pageStyles.active : ""}`}
                onClick={() => toggleItem(product)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                id="wishlist-toggle-btn"
              >
                <HeartIcon filled={wishlisted} />
              </button>
            </div>

            {/* Custom Order Link */}
            <Link
              href={`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.customOrder)}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontSize: "var(--text-sm)",
                color: "var(--color-primary)",
                fontWeight: 500,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Want this design customized? Start a custom order
            </Link>

            {/* Product Details */}
            <div style={{
              borderTop: "1px solid var(--color-border-light)",
              paddingTop: "var(--space-6)",
              marginTop: "var(--space-2)",
            }}>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-3)" }}>
                Details
              </h4>
              <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <li>• Shape: <span style={{ textTransform: "capitalize" }}>{product.nailShape}</span></li>
                <li>• Style: <span style={{ textTransform: "capitalize" }}>{product.style}</span></li>
                <li>• Type: <span style={{ textTransform: "capitalize" }}>{product.category}</span></li>
                <li>• Includes nail glue & prep kit</li>
                <li>• Reusable up to 3 times with proper care</li>
              </ul>
            </div>

            {/* Shipping & Delivery */}
            <div style={{
              borderTop: "1px solid var(--color-border-light)",
              paddingTop: "var(--space-6)",
              marginTop: "var(--space-6)",
            }}>
              <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-3)" }}>
                Shipping & Delivery
              </h4>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                {deliveryPresets && deliveryPresets[product.category] ? (
                  <>
                    <p style={{ margin: "0 0 var(--space-2) 0" }}><strong>Within Lagos:</strong> {deliveryPresets[product.category].lagos}</p>
                    <p style={{ margin: 0 }}><strong>Outside Lagos:</strong> {deliveryPresets[product.category].outside}</p>
                  </>
                ) : (
                  "Standard delivery takes 3-5 business days within Nigeria. Express delivery (1-2 days) is available at checkout for selected locations."
                )}
              </div>
            </div>
          </div>
        </div>

        {!isModal && relatedProducts.length > 0 && (
          <section className={pageStyles.relatedSection}>
            <div className="section__header">
              <h2 className="section__title">You Might Also Love</h2>
            </div>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>

      {/* Sticky Action Bar */}
      {!isModal && (
        <div className={`${pageStyles.stickyActionBar} ${showSticky ? pageStyles.stickyVisible : ""}`}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div>
             <p style={{ fontWeight: 600, fontSize: "var(--text-sm)", margin: 0, color: "var(--color-text)" }}>{product.name}</p>
             <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-xs)", margin: 0 }}>{formatPrice(product.price * quantity)}</p>
           </div>
           <button
             className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.sm}`}
             onClick={handleAddToCart}
           >
             {added ? "✓ Added" : "Add to Cart"}
           </button>
        </div>
      </div>
      )}
    </div>
  );
}

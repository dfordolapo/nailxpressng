"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import ProductGrid from "@/components/product/ProductGrid";
import pageStyles from "@/styles/pages/collection.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" width="18" height="18">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const product = getProductBySlug(params.slug);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedLength, setSelectedLength] = useState(product?.lengths?.[0] || "medium");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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
    addItem(product, quantity, selectedSize, selectedLength);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className={pageStyles.productPage} id={`product-${product.slug}`}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={pageStyles.breadcrumb} id="breadcrumb">
          <Link href="/">Home</Link>
          <span className={pageStyles.breadcrumbSeparator}>/</span>
          <Link href={`/${product.category}`}>
            {product.category === "handmade" ? "Handmade" : "Factory Made"}
          </Link>
          <span className={pageStyles.breadcrumbSeparator}>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Product Layout */}
        <div className={pageStyles.productLayout}>
          {/* Gallery */}
          <div className={pageStyles.gallery}>
            <div className={pageStyles.mainImage}>
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
            </div>
            <div className={pageStyles.thumbnails}>
              {product.images.map((_, i) => (
                <button
                  key={i}
                  className={`${pageStyles.thumbnail} ${selectedImage === i ? pageStyles.active : ""}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(${135 + i * 30}deg, var(--color-primary-100), var(--color-surface))`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    💅
                  </div>
                </button>
              ))}
            </div>
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

            {/* Rating */}
            <div className={pageStyles.productRating}>
              <div className={pageStyles.ratingStars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <span className={pageStyles.ratingText}>
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

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
            <div className={pageStyles.selectorGroup}>
              <span className={pageStyles.selectorLabel}>Size: {selectedSize}</span>
              <div className={pageStyles.selectorOptions}>
                {product.sizes.map((size) => (
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

            {/* Length Selector */}
            <div className={pageStyles.selectorGroup}>
              <span className={pageStyles.selectorLabel}>Length: {selectedLength}</span>
              <div className={pageStyles.selectorOptions}>
                {product.lengths.map((length) => (
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
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--color-surface)", fontSize: "var(--text-lg)",
                  }}
                >
                  −
                </button>
                <span style={{
                  width: 56, textAlign: "center", fontWeight: 600, borderLeft: "1px solid var(--color-border)",
                  borderRight: "1px solid var(--color-border)", height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--color-surface)", fontSize: "var(--text-lg)",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className={pageStyles.addToCartSection}>
              <button
                className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.lg}`}
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                id="add-to-cart-btn"
              >
                {added ? "✓ Added to Bag!" : `Add to Bag — ${formatPrice(product.price * quantity)}`}
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
              href="/custom-order"
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
              ✨ Want this design customized? Start a custom order
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
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className={pageStyles.relatedSection}>
            <div className="section__header">
              <h2 className="section__title">You Might Also Love</h2>
            </div>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  );
}

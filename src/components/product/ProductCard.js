"use client";

import Link from "next/link";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import styles from "@/styles/components/product-card.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

function HeartIcon({ filled }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
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

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const discount = getDiscountPercent(product.price, product.compareAtPrice);
  const wishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, "M", "medium");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <Link href={`/product/${product.slug}`} className={styles.card} id={`product-card-${product.slug}`}>
      {/* Image */}
      <div className={styles.imageContainer}>
        <div
          className={styles.image}
          style={{
            background: `linear-gradient(135deg, var(--color-primary-100), var(--color-surface))`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
          }}
        >
          💅
        </div>

        {/* Badges */}
        <div className={styles.badges}>
          {discount > 0 && (
            <span className={`${btnStyles.badge} ${btnStyles.badgeSale}`}>-{discount}%</span>
          )}
          {product.newArrival && (
            <span className={`${btnStyles.badge} ${btnStyles.badgeNew}`}>New</span>
          )}
          {product.bestseller && (
            <span className={`${btnStyles.badge} ${btnStyles.badgeBestseller}`}>Bestseller</span>
          )}
          {product.category === "handmade" && (
            <span className={`${btnStyles.badge} ${btnStyles.badgeHandmade}`}>Handmade</span>
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
          <button
            className={styles.quickAction}
            onClick={handleQuickAdd}
            aria-label="Quick add to cart"
          >
            <ShoppingBagIcon />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>


        {/* Price */}
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

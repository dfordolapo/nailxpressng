"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
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

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const discount = getDiscountPercent(product.price, product.compareAtPrice);
  const wishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, "M", "medium");
    showToast(`"${product.name}" added to cart`);
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
        {product.image || (product.images && product.images[0]) ? (
          <Image
            src={product.image || product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.image}
            style={{ objectFit: "cover" }}
          />
        ) : (
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
        )}

        {/* Badges */}
        <div className={styles.badges}>
          {/* Discount badge removed */}
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
          <span className={styles.price}>
            {product.category === 'factory' ? `${formatPrice(6500)} - ${formatPrice(8500)}` : formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.category !== 'factory' && (
            <span className={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

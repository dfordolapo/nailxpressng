"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import styles from "@/styles/components/product-card.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

export default function ProductGrid({ products, columns = 4 }) {
  const [visibleCount, setVisibleCount] = useState(8);

  const loadMore = () => {
    setVisibleCount(prev => prev + 8);
  };
  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-12) 0", color: "var(--color-text-tertiary)" }}>
        <p style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🔍</p>
        <p>No products found</p>
      </div>
    );
  }

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <>
      <div className={styles.grid} id="product-grid">
        {visibleProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
      
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
          <button 
            className={btnStyles.btnSecondary} 
            onClick={loadMore}
            style={{ minWidth: '200px' }}
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}

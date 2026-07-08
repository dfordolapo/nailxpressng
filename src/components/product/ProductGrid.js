import ProductCard from "./ProductCard";
import styles from "@/styles/components/product-card.module.css";

export default function ProductGrid({ products, columns = 4 }) {
  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-12) 0", color: "var(--color-text-tertiary)" }}>
        <p style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🔍</p>
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className={styles.grid} id="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

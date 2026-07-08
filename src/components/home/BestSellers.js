import Link from "next/link";
import { getFeaturedProducts } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import styles from "@/styles/components/bestsellers.module.css";

export default function BestSellers() {
  const products = getFeaturedProducts().slice(0, 4); // Show 4 products

  return (
    <section className={styles.section} id="best-sellers">
      <div className="container">
        <h2 className={styles.title}>BEST SELLERS</h2>
        
        <div className={styles.grid}>
          {products.map((product) => (
            <Link href={`/product/${product.slug}`} key={product.id} className={styles.card} id={`bestseller-${product.slug}`}>
              <div className={styles.imageContainer}>
                <div className={styles.imagePlaceholder}>
                  💅
                </div>
              </div>
              <div className={styles.info}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { categories } from "@/data/categories";
import styles from "@/styles/pages/home.module.css";

export default function CategoryShowcase() {
  return (
    <section className="section" id="category-showcase">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Shop by Collection</h2>
          <p className="section__subtitle">
            Choose your craft — artisan handmade sets or precision factory-made nails
          </p>
        </div>

        <div className={styles.showcaseGrid}>
          {categories.map((cat) => (
            <Link href={`/${cat.slug}`} key={cat.id} className={styles.showcaseCard} id={`showcase-${cat.slug}`}>
              <div
                className={styles.showcaseImage}
                style={{
                  background: cat.slug === "handmade"
                    ? "linear-gradient(135deg, #f5cdd5, #c4647a, #7e3349)"
                    : "linear-gradient(135deg, #e2cc9e, #c9a96e, #8a6d3b)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "4rem",
                }}
              >
                {cat.slug === "handmade" ? "🎨" : "✨"}
              </div>
              <div className={styles.showcaseOverlay}>
                <span className={styles.showcaseTagline}>{cat.tagline}</span>
                <h3 className={styles.showcaseTitle}>{cat.name}</h3>
                <p className={styles.showcaseDescription}>{cat.description}</p>
                <span className={styles.showcaseLink}>
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

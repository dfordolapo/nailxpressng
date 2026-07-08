import Link from "next/link";
import styles from "@/styles/pages/home.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

export default function CustomOrderCTA() {
  return (
    <section className="section" id="custom-order-cta">
      <div className="container">
        <div className={styles.ctaBanner}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Dream It. We&apos;ll Create It.
            </h2>
            <p className={styles.ctaDescription}>
              Can&apos;t find exactly what you want? Our artisans will bring your nail vision to life.
              Choose your shape, length, design, and we&apos;ll craft a set that&apos;s uniquely yours.
            </p>
            <Link
              href="/custom-order"
              className={`${btnStyles.btn} ${btnStyles.accent} ${btnStyles.lg}`}
              id="custom-order-cta-btn"
            >
              Start Your Custom Order
            </Link>
          </div>
          <div className={styles.ctaImage}>
            <div style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #e8a5b3 0%, #f5cdd5 50%, #e2cc9e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "4rem",
            }}>
              ✍️
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import styles from "@/styles/components/how-to-apply.module.css";

export default function HowToApply() {
  return (
    <section className={styles.container}>
      <div className={styles.bgWrapper}>
        <Image
          src="/images/apply.png"
          alt="Woman applying luxury press-on nails"
          fill
          priority
          className={styles.bgImage}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>How to Apply</h2>
        
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Prep</h3>
            <p className={styles.stepDesc}>
              Gently push back your cuticles and lightly buff the natural nail bed to create a perfectly smooth, oil-free surface.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Glue</h3>
            <p className={styles.stepDesc}>
              Apply a small, even drop of our long-lasting adhesive glue or use an adhesive tab directly onto your natural nail.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Press</h3>
            <p className={styles.stepDesc}>
              Align the press-on flush with your cuticle, press down firmly, and hold for 15 seconds to ensure a flawless seal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

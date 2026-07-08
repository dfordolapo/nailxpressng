"use client";

import Image from "next/image";
import styles from "@/styles/components/hero.module.css";

export default function HeroBanner() {
  return (
    <section className={styles.hero} id="hero-banner">
      <div className={styles.heroLeft}>
        <h1 className={styles.heroTitle}>
          The upgrade<br />is instant
        </h1>
      </div>
      <div className={styles.heroRight}>
        <div className={styles.heroImageWrapper}>
          <Image
            src="/images/hero.png"
            alt="Beautiful dark red press-on nails holding a martini glass"
            fill
            className={styles.heroImage}
            priority
          />
        </div>
      </div>
    </section>
  );
}

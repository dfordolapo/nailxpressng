import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FooterHero.module.css';

export default function FooterHero() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.content}>
            <h2 className={styles.title}>Want one mani set<br />or a wholesale deal?</h2>
            <p className={styles.subtitle}>We nail it, you retail it</p>
            <Link href="/shop" className={styles.button}>
              Shop now
            </Link>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/footer-hero.png"
              alt="Nail Express packaging bags and boxes"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

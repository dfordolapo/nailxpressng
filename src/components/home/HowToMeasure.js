import React from 'react';
import Image from 'next/image';
import styles from './HowToMeasure.module.css';

export default function HowToMeasure() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>How to find your size</h2>
      </div>
      
      <div className={styles.imageWrapper}>
        <Image
          src="/images/measure-guide.png"
          alt="Guide showing how to measure press-on nails"
          fill
          sizes="100vw"
          className={styles.image}
        />
      </div>
    </section>
  );
}

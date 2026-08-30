'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Features.module.css';

const FEATURES_DATA = [
  {
    id: 1,
    image: "/images/apply.png",
    alt: "How to apply Nail Express press-on nails"
  },
  {
    id: 2,
    image: "/images/removal.png",
    alt: "Safe removal of press-on nails guide"
  },
  {
    id: 3,
    image: "/images/tip.png",
    alt: "Nail care tips and tricks"
  }
];

export default function Features() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Salon looks with zero appointments</h2>
          <p className={styles.subtitle}>For hot babes, by hot babes</p>
          <p className={styles.swipeHint}>Swipe <span aria-hidden>→</span></p>
        </div>
        
        <div className={styles.grid}>
          {FEATURES_DATA.map((feature) => (
            <div key={feature.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className={styles.image}
                />
                <div className={styles.glossShine} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

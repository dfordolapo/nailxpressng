import React from 'react';
import Image from 'next/image';
import styles from './Features.module.css';

const FEATURES_DATA = [
  {
    id: 1,
    title: "Premium Quality",
    description: "Handmade artistry & factory precision.",
    image: "/images/features/premium-quality.png"
  },
  {
    id: 2,
    title: "Perfect Fit",
    description: "Multiple sizes for a comfortable fit.",
    image: "/images/features/perfect-fit.png"
  },
  {
    id: 3,
    title: "Fast Application",
    description: "Minutes to apply, weeks to wear.",
    image: "/images/features/fast-application.png"
  }
];

export default function Features() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Salon looks with zero appointments</h2>
          <p className={styles.subtitle}>For hot babes, by hot babes</p>
        </div>
        
        <div className={styles.grid}>
          {FEATURES_DATA.map((feature) => (
            <div key={feature.id} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDescription}>{feature.description}</p>
              </div>
              <div className={styles.imageWrapper}>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className={styles.image}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <h1 className={`${styles.title} animate-fade-in-up`}>
            The upgrade<br />is instant
          </h1>
          <p className={`${styles.subtitle} animate-fade-in-up`} style={{ animationDelay: '150ms' }}>
            Press-on. Slay. Repeat.
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link href="/shop" className={`${styles.button} ${styles.desktopBtn}`}>
              Shop bestsellers
            </Link>
            <Link href="/collection-hub" className={`${styles.button} ${styles.mobileBtn}`}>
              Shop bestsellers
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/hero.png"
          alt="Hands holding glasses showing elegant press-on nails"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.image}
        />
      </div>
      
      {/* Custom Divider */}
      <div className={styles.waveDivider}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path 
            d="M0,120 L0,60 L620,60 C660,60 680,20 720,20 C760,20 780,60 820,60 L1440,60 L1440,120 Z" 
            className={styles.shapeFill} 
          />
        </svg>
      </div>
    </section>
  );
}

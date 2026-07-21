"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };
    
    // Only run on client
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <Link href="/shop" className={`${styles.button} ${styles.mobileBtn}`}>
              Shop bestsellers
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.imageWrapper}>
        <div style={{ transform: `translateY(${offsetY * 0.4}px)`, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <Image
            src="/images/hero.png"
            alt="Hands holding glasses showing elegant press-on nails"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
          />
        </div>
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

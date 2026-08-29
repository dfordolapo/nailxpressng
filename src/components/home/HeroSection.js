"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSplash } from '@/context/SplashContext';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [offsetY, setOffsetY] = useState(0);
  const { isSplashComplete } = useSplash();

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
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isSplashComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            The upgrade<br />is instant
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={isSplashComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            Press-on. Slay. Repeat.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isSplashComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/shop" className={`${styles.button} ${styles.desktopBtn}`}>
              Shop bestsellers
            </Link>
            <Link href="/shop" className={`${styles.button} ${styles.mobileBtn}`}>
              Shop bestsellers
            </Link>
          </motion.div>
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

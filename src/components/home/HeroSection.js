"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSplash } from '@/context/SplashContext';
import MagneticButton from '@/components/ui/MagneticButton';
import { NailIcon } from '@/components/ui/NailIcon';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [offsetY, setOffsetY] = useState(0);
  const { isSplashComplete } = useSplash();
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (isSplashComplete) {
      // Small tick delay so DOM has painted post-splash before starting hero entrance
      const t = setTimeout(() => {
        setHasEntered(true);
      }, 100);
      return () => clearTimeout(t);
    }
  }, [isSplashComplete]);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 36 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            The upgrade<br />is instant
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 24 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            Press-on. Slay. Repeat.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton href="/shop" className={styles.button}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
                <span>Shop bestsellers</span>
                <NailIcon size={22} />
              </span>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
      <div className={styles.imageWrapper}>
        <div style={{ transform: `translateY(${offsetY * 0.35}px)`, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <motion.div
            style={{ width: '100%', height: '100%', position: 'relative' }}
            initial={{ scale: 1.08, opacity: 0.2 }}
            animate={hasEntered ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0.2 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/images/hero.png"
              alt="Hands holding glasses showing elegant press-on nails"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
            />
          </motion.div>
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

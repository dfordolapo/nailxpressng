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
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isSplashComplete) {
      setShouldAnimate(true);
    } else {
      // Fallback timer in case splash context is already in progress/finishing
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isSplashComplete]);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };
    
    // Only run on client
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isVisible = isSplashComplete || shouldAnimate;

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            The upgrade<br />is instant
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            Press-on. Slay. Repeat.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
            initial={{ scale: 1.06, opacity: 0.8 }}
            animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 1.06, opacity: 0.8 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
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

'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './GiftBoxBanner.module.css';

export default function GiftBoxBanner() {
  const [lensPos, setLensPos] = useState({ x: 50, y: 50, px: 0, py: 0, width: 0, height: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef(null);
  const ZOOM_FACTOR = 2.4;

  const updatePosition = (clientX, clientY) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const offsetY = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const percentX = (offsetX / rect.width) * 100;
    const percentY = (offsetY / rect.height) * 100;
    setLensPos({ 
      x: percentX, 
      y: percentY, 
      px: offsetX, 
      py: offsetY, 
      width: rect.width, 
      height: rect.height 
    });
  };

  const handleMouseMove = useCallback((e) => {
    updatePosition(e.clientX, e.clientY);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches && e.touches[0]) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, []);

  const handleTouchStart = (e) => {
    setIsZooming(true);
    if (e.touches && e.touches[0]) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>What's inside your Nail Express box?</h2>
      
      {/* Floating Interactive Badge Indicator */}
      <div className={styles.indicatorBadge}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>Touch & drag or hover to inspect items</span>
      </div>

      <div 
        className={styles.imageWrapper}
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsZooming(false)}
        onTouchCancel={() => setIsZooming(false)}
      >
        <Image
          src="/images/gift-box-banner-v2.png"
          alt="What's inside your Nail Express box"
          width={1920}
          height={1080}
          sizes="100vw"
          className={styles.image}
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />

        {/* Real Magnifying Glass with Rim and Handle */}
        {isZooming ? (
          <div 
            className={styles.magnifierGlassContainer}
            style={{
              left: `${lensPos.x}%`,
              top: `${lensPos.y}%`,
            }}
          >
            {/* The Glass Lens with exact pixel alignment */}
            <div 
              className={styles.magnifierLoupe}
              style={{
                backgroundImage: 'url(/images/gift-box-banner-v2.png)',
                backgroundSize: lensPos.width ? `${lensPos.width * ZOOM_FACTOR}px ${lensPos.height * ZOOM_FACTOR}px` : '240% 240%',
                backgroundPosition: `-${lensPos.px * ZOOM_FACTOR - 80}px -${lensPos.py * ZOOM_FACTOR - 80}px`,
              }}
            >
              <div className={styles.lensReflection} />
            </div>
            {/* The Ergonomic Handle */}
            <div className={styles.glassHandle} />
          </div>
        ) : (
          /* Gentle Floating Guide Glass when idle on mobile/desktop */
          <div className={styles.idleGlassGuide}>
            <div className={styles.idleGlassHead}>
              <div className={styles.idleGlassGlint} />
            </div>
            <div className={styles.idleGlassHandle} />
          </div>
        )}
      </div>
    </section>
  );
}

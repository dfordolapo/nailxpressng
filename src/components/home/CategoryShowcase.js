'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { NailIcon } from '@/components/ui/NailIcon';
import MagneticButton from '@/components/ui/MagneticButton';
import styles from './CategoryShowcase.module.css';

const MOODS = [
  { id: 'everyday', name: 'Everyday Chic', image: '/images/everyday.png', color: '#C4866C', pun: 'Nails that say "I woke up like this."' },
  { id: 'glamour', name: 'Bold & Glam', image: '/images/glamour.png', color: '#B84C6A', pun: 'Warning: may cause excessive hand gestures.' },
  { id: 'soft', name: 'Soft & Elegant', image: '/images/bridal.png', color: '#D4A98C', pun: 'Elegance is always in season.' },
  { id: 'trendy', name: 'Trendy & Playful', image: '/images/floral.png', color: '#8B6B8A', pun: "Life's too short for boring nails." },
  { id: 'custom', name: 'Custom Sets', image: '/images/art.png', color: '#7A8C6B', pun: 'Nail art as unique as your fingerprint.' },
];

const SCROLL_SPEED = 2.8;
const RESUME_DELAY = 2000;

export default function CategoryShowcase({ mini = false, items = null }) {
  const displayItems = items ? items.map((p, i) => ({
    id: p.id,
    name: p.name,
    image: p.image || (p.images && p.images[0]) || MOODS[i % MOODS.length].image,
    color: MOODS[i % MOODS.length].color,
    isProduct: true,
    slug: p.slug
  })) : MOODS;

  const marqueeItems = [...displayItems, ...displayItems, ...displayItems, ...displayItems];
  const [flippedId, setFlippedId] = useState(null);
  const [centerCardIdx, setCenterCardIdx] = useState(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const autoScrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastTimeRef = useRef(null);
  const lastCenterCheckRef = useRef(0);

  const handleFlip = (e, id) => {
    e.stopPropagation();
    setFlippedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let startX = 0;
    let initialOffset = 0;
    let dragged = false;
    let resumeTimer = null;
    // Product showcases (mini or items list on collection/shop/handmade pages) cruise gently (1.1) so users can read names and admire details;
    // Landing page mood marquee maintains its brisk, energetic flow (3.2).
    const speed = mini || items ? 1.1 : 3.2;

    const cardWidth = 180;
    const cardGap = 24;
    const cardPitch = cardWidth + cardGap; // 204px per card item
    const screenCenter = typeof window !== 'undefined' ? window.innerWidth / 2 : 200;

    const checkCenter = (now) => {
      if (typeof window === 'undefined' || window.innerWidth > 768) return;
      if (now - lastCenterCheckRef.current < 40) return;
      lastCenterCheckRef.current = now;

      // Pure math calculation without reading DOM rects:
      // Current track start is offsetRef.current + padding (24px)
      // Center of card i is: offsetRef.current + 24 + i * 204 + 90
      // screenCenter = offsetRef.current + 114 + i * 204
      const approxIdx = Math.round((screenCenter - offsetRef.current - 114) / cardPitch);
      const safeIdx = Math.max(0, Math.min(approxIdx, marqueeItems.length - 1));

      setCenterCardIdx((prev) => (prev === safeIdx ? prev : safeIdx));
    };

    const tick = (time) => {
      if (!isDraggingRef.current && !flippedId) {
        if (lastTimeRef.current === null) lastTimeRef.current = time;
        const delta = Math.min(time - lastTimeRef.current, 50);
        lastTimeRef.current = time;

        offsetRef.current -= speed * (delta / 16.67);

        const half = track.scrollWidth / 2;
        if (Math.abs(offsetRef.current) >= half) {
          offsetRef.current += half;
        }

        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        checkCenter(time);
      } else {
        lastTimeRef.current = null;
      }
      autoScrollRef.current = requestAnimationFrame(tick);
    };

    autoScrollRef.current = requestAnimationFrame(tick);

    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      dragged = false;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      initialOffset = offsetRef.current;
      clearTimeout(resumeTimer);
    };

    const onPointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const diff = currentX - startX;
      if (Math.abs(diff) > 4) {
        dragged = true;
      }
      offsetRef.current = initialOffset + diff;
      const half = track.scrollWidth / 2;
      if (offsetRef.current > 0) {
        offsetRef.current -= half;
      } else if (Math.abs(offsetRef.current) >= half) {
        offsetRef.current += half;
      }
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      checkCenter(performance.now());
    };

    const onPointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      resumeTimer = setTimeout(() => {
        lastTimeRef.current = null;
      }, 400);
    };

    const onClickCapture = (e) => {
      if (dragged) {
        e.stopPropagation();
        e.preventDefault();
        dragged = false;
      }
    };

    const wrapper = track.parentElement;
    wrapper.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    wrapper.addEventListener('click', onClickCapture, { capture: true });

    return () => {
      cancelAnimationFrame(autoScrollRef.current);
      clearTimeout(resumeTimer);
      wrapper.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      wrapper.removeEventListener('click', onClickCapture, { capture: true });
    };
  }, [flippedId]);

  return (
    <motion.section 
      className={`${styles.section} ${mini ? styles.mini : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      {!mini && (
        <h2 className={styles.title}>
          Nails that match your every mood
        </h2>
      )}
      
      <div className={styles.gridWrapper}>
        <div className={styles.marqueeTrack} ref={trackRef}>
          {marqueeItems.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className={`${styles.card} ${flippedId === `${item.id}-${i}` ? styles.flipped : ''} ${centerCardIdx === i ? styles.centerActive : ''}`}
              onClick={(e) => handleFlip(e, `${item.id}-${i}`)}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                  <div className={styles.imageContainer}>
                    <div className={styles.imageInner}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        quality={90}
                        sizes="(max-width: 768px) 360px, 480px"
                        className={styles.image}
                      />
                    </div>
                  </div>
                  <div className={styles.label} style={{ backgroundColor: item.color }}>
                    {item.name}
                  </div>
                </div>
                <div className={styles.cardBack} style={{ backgroundColor: item.color }}>
                  {item.isProduct ? (
                    <Link href={`/product/${item.slug}`} className={styles.viewBtn} onClick={(e) => e.stopPropagation()} aria-label="View Product">
                      <ShoppingCart size={22} strokeWidth={1.25} />
                    </Link>
                  ) : (
                    <p className={styles.punLine}>{item.pun}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Filter for torn paper edge effect */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="torn-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.075" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {!mini && (
        <div>
          <MagneticButton href="/collection-hub" className={styles.button}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
              <span>Explore all collections</span>
              <NailIcon size={22} />
            </span>
          </MagneticButton>
        </div>
      )}
    </motion.section>
  );
}

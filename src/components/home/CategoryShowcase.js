'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { NailIcon } from '@/components/ui/NailIcon';
import styles from './CategoryShowcase.module.css';

const MOODS = [
  { id: 'everyday', name: 'Everyday Chic', image: '/images/everyday.png', color: '#C4866C', pun: 'Nails that say "I woke up like this."' },
  { id: 'glamour', name: 'Bold & Glam', image: '/images/glamour.png', color: '#B84C6A', pun: 'Warning: may cause excessive hand gestures.' },
  { id: 'soft', name: 'Soft & Elegant', image: '/images/bridal.png', color: '#D4A98C', pun: 'Elegance is always in season.' },
  { id: 'trendy', name: 'Trendy & Playful', image: '/images/floral.png', color: '#8B6B8A', pun: "Life's too short for boring nails." },
  { id: 'custom', name: 'Custom Sets', image: '/images/art.png', color: '#7A8C6B', pun: 'Nail art as unique as your fingerprint.' },
];

const SCROLL_SPEED = 2.2;
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
  const trackRef = useRef(null);
  const autoScrollRef = useRef(null);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(null);

  const handleFlip = (e, id) => {
    e.stopPropagation();
    setFlippedId((prev) => {
      if (prev === id) {
        clearTimeout(trackRef.current?._resumeTimer);
        const half = trackRef.current?.scrollWidth / 2;
        if (trackRef.current && trackRef.current.scrollLeft >= half) {
          trackRef.current.scrollLeft -= half;
        }
        resumeAutoScroll();
      }
      return prev === id ? null : id;
    });
  };

  const [centerCardIdx, setCenterCardIdx] = useState(null);
  const scrollPosRef = useRef(0);
  const lastCheckTimeRef = useRef(0);

  // Detect card closest to center on mobile (throttled for high frame rate)
  const checkCenterCard = useCallback(() => {
    if (typeof window === 'undefined' || window.innerWidth > 768) return;
    const track = trackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll(`.${styles.card}`);
    if (!cards.length) return;
    
    const screenCenter = window.innerWidth / 2;
    let closestIdx = null;
    let closestDist = Infinity;

    for (let idx = 0; idx < cards.length; idx++) {
      const card = cards[idx];
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(screenCenter - cardCenter);
      if (dist < closestDist && dist < rect.width * 0.8) {
        closestDist = dist;
        closestIdx = idx;
      }
    }

    setCenterCardIdx((prev) => (prev === closestIdx ? prev : closestIdx));
  }, []);

  const pauseAutoScroll = useCallback(() => {
    pausedRef.current = true;
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  const resumeAutoScroll = useCallback(() => {
    pausedRef.current = false;
    lastTimeRef.current = null;

    const tick = (time) => {
      if (pausedRef.current) return;
      const track = trackRef.current;
      if (!track) return;

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        scrollPosRef.current = track.scrollLeft;
      }
      
      const delta = Math.min(time - lastTimeRef.current, 50); // Clamp delta to avoid frame spikes
      lastTimeRef.current = time;

      scrollPosRef.current += SCROLL_SPEED * (delta / 16.67);

      const half = track.scrollWidth / 2;
      if (scrollPosRef.current >= half) {
        scrollPosRef.current -= half;
      }

      track.scrollLeft = scrollPosRef.current;

      // Throttle center card detection to every ~60ms instead of every frame
      if (time - lastCheckTimeRef.current > 60) {
        lastCheckTimeRef.current = time;
        checkCenterCard();
      }

      autoScrollRef.current = requestAnimationFrame(tick);
    };

    autoScrollRef.current = requestAnimationFrame(tick);
  }, [checkCenterCard]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    resumeAutoScroll();

    let isDown = false;
    let startX;
    let scrollLeft;
    let dragged = false;

    const onPointerDown = (e) => {
      pauseAutoScroll();
      if (e.pointerType === 'mouse') {
        isDown = true;
        dragged = false;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        scrollPosRef.current = track.scrollLeft;
        track.style.cursor = 'grabbing';
      }
    };

    const onPointerMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
      scrollPosRef.current = track.scrollLeft;
      if (Math.abs(walk) > 5) {
        dragged = true;
      }
    };

    const onPointerUp = () => {
      isDown = false;
      track.style.cursor = 'grab';
      clearTimeout(track._resumeTimer);
      
      if (!pausedRef.current) return;
      const half = track.scrollWidth / 2;
      if (track.scrollLeft >= half) {
        track.scrollLeft -= half;
      }
      scrollPosRef.current = track.scrollLeft;
      
      // Add a slight delay before resuming to prevent jumping
      track._resumeTimer = setTimeout(() => {
        resumeAutoScroll();
      }, 500);
    };

    const onWheel = () => {
      if (!isDown) {
        pauseAutoScroll();
        clearTimeout(track._resumeTimer);
        track._resumeTimer = setTimeout(() => {
          if (pausedRef.current) {
            const half = track.scrollWidth / 2;
            if (track.scrollLeft >= half) track.scrollLeft -= half;
            resumeAutoScroll();
          }
        }, 1000);
      }
    };

    const onClickCapture = (e) => {
      if (dragged) {
        e.stopPropagation();
        e.preventDefault();
        dragged = false;
      }
    };

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointerleave', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);
    track.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      cancelAnimationFrame(autoScrollRef.current);
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', onPointerUp);
      track.removeEventListener('pointerleave', onPointerUp);
      track.removeEventListener('pointercancel', onPointerUp);
      track.removeEventListener('wheel', onWheel);
      track.removeEventListener('click', onClickCapture, { capture: true });
      clearTimeout(track._resumeTimer);
    };
  }, [pauseAutoScroll, resumeAutoScroll]);

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
      
      <div className={styles.gridWrapper} ref={trackRef} onScroll={checkCenterCard}>
        <div className={styles.marqueeTrack}>
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
                        sizes="(max-width: 768px) 180px, 240px"
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
          <Link href="/collection-hub" className={`${styles.button} ${styles.desktopBtn}`}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
              <span>Explore all collections</span>
              <NailIcon size={22} />
            </span>
          </Link>
          <Link href="/collection-hub" className={`${styles.button} ${styles.mobileBtn}`}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
              <span>Explore all collections</span>
              <NailIcon size={22} />
            </span>
          </Link>
        </div>
      )}
    </motion.section>
  );
}

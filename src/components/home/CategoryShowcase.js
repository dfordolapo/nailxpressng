'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CategoryShowcase.module.css';

const MOODS = [
  { id: 'everyday', name: 'Everyday Chic', image: '/images/everyday.png', color: '#C4866C', pun: 'Nails that say "I woke up like this."' },
  { id: 'glamour', name: 'Bold & Glam', image: '/images/glamour.png', color: '#B84C6A', pun: 'Warning: may cause excessive hand gestures.' },
  { id: 'soft', name: 'Soft & Elegant', image: '/images/bridal.png', color: '#D4A98C', pun: 'Elegance is always in season.' },
  { id: 'trendy', name: 'Trendy & Playful', image: '/images/floral.png', color: '#8B6B8A', pun: "Life's too short for boring nails." },
  { id: 'custom', name: 'Custom Sets', image: '/images/art.png', color: '#7A8C6B', pun: 'Nail art as unique as your fingerprint.' },
];

const SCROLL_SPEED = 0.8;
const RESUME_DELAY = 2000;

export default function CategoryShowcase({ mini = false }) {
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

      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      track.scrollLeft += SCROLL_SPEED * delta * 0.1;

      const half = track.scrollWidth / 2;
      if (track.scrollLeft >= half) {
        track.scrollLeft -= half;
      }

      autoScrollRef.current = requestAnimationFrame(tick);
    };

    autoScrollRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    resumeAutoScroll();

    const onPointerDown = () => {
      pauseAutoScroll();
    };

    const onPointerUp = () => {
      clearTimeout(track._resumeTimer);
      track._resumeTimer = setTimeout(() => {
        if (!pausedRef.current) return;
        const half = track.scrollWidth / 2;
        if (track.scrollLeft >= half) {
          track.scrollLeft -= half;
        }
        resumeAutoScroll();
      }, RESUME_DELAY);
    };

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointerleave', onPointerUp);

    return () => {
      cancelAnimationFrame(autoScrollRef.current);
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointerup', onPointerUp);
      track.removeEventListener('pointerleave', onPointerUp);
      clearTimeout(track._resumeTimer);
    };
  }, [pauseAutoScroll, resumeAutoScroll]);

  return (
    <section className={`${styles.section} ${mini ? styles.mini : ''}`}>
      {!mini && (
        <h2 className={styles.title}>
          Nails that match your every mood
        </h2>
      )}
      
      <div className={styles.gridWrapper} ref={trackRef}>
        <div className={styles.marqueeTrack}>
          {[...MOODS, ...MOODS, ...MOODS, ...MOODS].map((mood, i) => (
            <div
              key={`${mood.id}-${i}`}
              className={`${styles.card} ${flippedId === `${mood.id}-${i}` ? styles.flipped : ''}`}
              onClick={(e) => handleFlip(e, `${mood.id}-${i}`)}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                  <div className={styles.imageContainer}>
                    <div className={styles.imageInner}>
                      <Image
                        src={mood.image}
                        alt={`${mood.name} style press-on nails`}
                        fill
                        sizes="(max-width: 768px) 180px, 20vw"
                        className={styles.image}
                      />
                    </div>
                  </div>
                  <div className={styles.label} style={{ backgroundColor: mood.color }}>
                    {mood.name}
                  </div>
                </div>
                <div className={styles.cardBack} style={{ backgroundColor: mood.color }}>
                  <p className={styles.punLine}>{mood.pun}</p>
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
          <Link href="/shop" className={`${styles.button} ${styles.desktopBtn}`}>
            Explore all collections
          </Link>
          <Link href="/collection-hub" className={`${styles.button} ${styles.mobileBtn}`}>
            Explore all collections
          </Link>
        </div>
      )}
    </section>
  );
}

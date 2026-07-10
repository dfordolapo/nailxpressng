import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CategoryShowcase.module.css';

const MOODS = [
  { id: 'everyday', name: 'Everyday Chic', image: '/images/everyday.png', color: '#C4866C' },
  { id: 'glamour', name: 'Bold & Glam', image: '/images/glamour.png', color: '#B84C6A' },
  { id: 'soft', name: 'Soft & Elegant', image: '/images/bridal.png', color: '#D4A98C' },
  { id: 'trendy', name: 'Trendy & Playful', image: '/images/floral.png', color: '#8B6B8A' },
  { id: 'custom', name: 'Custom Sets', image: '/images/art.png', color: '#7A8C6B' },
];

export default function CategoryShowcase() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Nails that match your every mood
      </h2>
      
      <div className={styles.gridWrapper}>
        <div className={styles.marqueeTrack}>
          {[...MOODS, ...MOODS, ...MOODS, ...MOODS].map((mood, i) => (
            <div key={`${mood.id}-${i}`} className={styles.card}>
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

      <div>
        <Link href="/shop" className={styles.button}>
          Explore all collections
        </Link>
      </div>
    </section>
  );
}

import React from 'react';
import Image from 'next/image';
import styles from './GiftBoxBanner.module.css';

export default function GiftBoxBanner() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>What's inside your Nail Express box?</h2>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '2 / 1' }}>
        <Image
          src="/images/gift-box-banner.png"
          alt="What's inside your Nail Express box"
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className={styles.image}
          style={{ objectFit: 'contain' }}
        />
      </div>
    </section>
  );
}

import React from 'react';
import Image from 'next/image';
import styles from './GiftBoxBanner.module.css';

export default function GiftBoxBanner() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>What's inside your Nail Express box?</h2>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/gift-box-banner-v2.png"
          alt="What's inside your Nail Express box"
          width={1920}
          height={1080}
          sizes="100vw"
          className={styles.image}
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      </div>
    </section>
  );
}

import React from 'react';
import Image from 'next/image';
import styles from './GiftBoxBanner.module.css';

export default function GiftBoxBanner() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>What's inside your Nail Express box?</h2>
      <Image
        src="/images/gift-box-banner.png"
        alt="What's inside your Nail Express box"
        width={1200}
        height={600}
        className={styles.image}
      />
    </section>
  );
}

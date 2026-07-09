import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './GiftBoxBanner.module.css';

export default function GiftBoxBanner() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>What’s inside your Nail Express box?</h2>
        
        <div className={styles.infoBox}>
          <div className={styles.content}>
            <ul className={styles.list}>
              <li className={styles.listItem}>A full set of press-ons</li>
              <li className={styles.listItem}>Dual adhesive options</li>
              <li className={styles.listItem}>Nail glue remover/debonder</li>
              <li className={styles.listItem}>Nail prep tools</li>
              <li className={styles.listItem}>Step-by-step application guide</li>
              <li className={styles.listItem}>Nail art stickers</li>
              <li className={styles.listItem}>Cutesy functional gifts</li>
            </ul>
          </div>
          
          <div className={styles.imageWrapper}>
            <Image
              src="/images/gift-box.png"
              alt="Nail Express box contents illustration"
              width={300}
              height={300}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

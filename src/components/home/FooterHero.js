import React from 'react';
import Image from 'next/image';
import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from '@/lib/constants';
import styles from './FooterHero.module.css';

export default function FooterHero() {
  const whatsappUrl = `${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.wholesale)}`;
  return (
    <section className={styles.section}>
      <div className={styles.overlay}>
        <h2 className={styles.title}>Want one mani set<br />or a wholesale deal?</h2>
        <p className={styles.subtitle}>We nail it, you retail it</p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.button}>
          Chat on WhatsApp
        </a>
      </div>
      <Image
        src="/images/wholesale-banner.png"
        alt="Nail Express wholesale"
        width={1200}
        height={600}
        className={styles.image}
      />
    </section>
  );
}

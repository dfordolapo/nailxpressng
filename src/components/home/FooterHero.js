import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from '@/lib/constants';
import styles from './FooterHero.module.css';

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.13a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.56z" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

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

      <div className={styles.footerBar}>
        <div className={styles.footerLogo}>nailexpress</div>
        <div className={styles.footerLinks}>
          <Link href="/shop" className={styles.footerLink}>shop</Link>
          <Link href="/terms" className={styles.footerLink}>terms</Link>
          <Link href="/privacy" className={styles.footerLink}>privacy</Link>
          <a href={SOCIAL_LINKS?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>wholesale</a>
        </div>
        <div className={styles.footerSocials}>
          <a href={SOCIAL_LINKS?.instagram || "#"} target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href={SOCIAL_LINKS?.tiktok || "#"} target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="TikTok">
            <TiktokIcon />
          </a>
          <a href={SOCIAL_LINKS?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="WhatsApp">
            <WhatsappIcon />
          </a>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Send, MessageCircle } from 'lucide-react';
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
        fill
        sizes="100vw"
        className={styles.image}
        style={{ objectFit: 'cover' }}
      />

      <div className={styles.footerBar}>
        <Link href="/" className={styles.footerLogoLink}>
          <Image
            src="/images/splash-logo.png"
            alt="Nailexpress Logo"
            width={140}
            height={42}
            className={styles.footerLogoImg}
          />
        </Link>
        <div className={styles.footerLinks}>
          <Link href="/terms" className={styles.footerLink}>terms & conditions</Link>
        </div>
        <div className={styles.footerSocials}>
          <a href={SOCIAL_LINKS?.instagram || "#"} target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
          <a href={SOCIAL_LINKS?.tiktok || "#"} target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="TikTok">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.13a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.56z" />
            </svg>
          </a>
          <a href={SOCIAL_LINKS?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="WhatsApp">
            <MessageCircle size={20} strokeWidth={1.5} />
          </a>
          <a href={SOCIAL_LINKS?.telegram || "#"} target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="Telegram">
            <Send size={20} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/components/footer.module.css";
import { SOCIAL_LINKS } from "@/lib/constants";

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

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className={styles.footer} id="site-footer">
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.logo}>
            nailexpress
          </div>
          
          <div className={styles.links}>
            <Link href="/shop" className={styles.link}>shop</Link>
            <Link href="/terms" className={styles.link}>terms</Link>
            <Link href="/privacy" className={styles.link}>privacy</Link>
            <a href={SOCIAL_LINKS?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className={styles.link}>wholesale</a>
          </div>
        </div>
        
        <div className={styles.socials}>
          <a href={SOCIAL_LINKS?.instagram || "#"} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href={SOCIAL_LINKS?.tiktok || "#"} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="TikTok">
            <TiktokIcon />
          </a>
          <a href={SOCIAL_LINKS?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
            <WhatsappIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}

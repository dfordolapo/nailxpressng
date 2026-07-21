"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from '@/lib/constants';
import { Plus } from 'lucide-react';
import styles from './ShopTheLook.module.css';

// TODO: When the site goes live and products are added to the database, 
// replace this static array with a dynamic fetch from Supabase (e.g., fetch featured products).
const HOTSPOTS = [
  { id: 1, top: '40%', left: '30%', name: 'Bridal Almond Set', price: '₦15,000', link: '/product/bridal-almond' },
  { id: 2, top: '65%', left: '75%', name: 'Everyday Square', price: '₦12,500', link: '/product/everyday-square' },
];

export default function ShopTheLook() {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const whatsappUrl = `${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.customOrder)}`;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.content}>
            <h2 className={styles.title}>If you can think it,<br />we can do it</h2>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.button}>
              Customize your set
            </a>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/customize.png"
              alt="Handmade and factory made nail sets"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
            />
            
            {/* Interactive Hotspots */}
            {HOTSPOTS.map((spot) => (
              <div 
                key={spot.id}
                className={`${styles.hotspot} ${activeHotspot === spot.id ? styles.hotspotActive : ''}`}
                style={{ top: spot.top, left: spot.left }}
                onMouseEnter={() => setActiveHotspot(spot.id)}
                onMouseLeave={() => setActiveHotspot(null)}
                onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
              >
                <div className={styles.dot}>
                  <Plus size={14} color="var(--color-bg-warm)" />
                </div>
                
                <div className={styles.popover}>
                  <p className={styles.popoverName}>{spot.name}</p>
                  <p className={styles.popoverPrice}>{spot.price}</p>
                  <Link href={spot.link} className={styles.popoverLink}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}

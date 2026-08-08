import Image from 'next/image';
import Link from 'next/link';
import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from '@/lib/constants';
import { Plus } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import styles from './ShopTheLook.module.css';

export default async function ShopTheLook() {
  const allProducts = await getProducts();
  const featured = allProducts.filter((p) => p.bestseller || p.newArrival);
  const picks = (featured.length >= 2 ? featured : allProducts).slice(0, 2);

  const hotspots = picks.map((p, i) => ({
    id: i + 1,
    top: i === 0 ? '40%' : '65%',
    left: i === 0 ? '30%' : '75%',
    name: p.name,
    price: formatPrice(p.price),
    link: `/product/${p.slug}`,
  }));

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
            {hotspots.map((spot) => (
              <div 
                key={spot.id}
                className={styles.hotspot}
                style={{ top: spot.top, left: spot.left }}
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

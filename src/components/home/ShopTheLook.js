import Image from 'next/image';
import Link from 'next/link';
import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from '@/lib/constants';
import { Plus } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import styles from './ShopTheLook.module.css';

export default async function ShopTheLook() {
  const allProducts = await getProducts();
  const pick1 = allProducts.find(p => p.name === 'Elegant Quartz') || allProducts[0];
  const pick2 = allProducts.find(p => p.name === 'Lava Eclipse') || allProducts[1];
  const picks = [pick1, pick2].filter(Boolean);

  const hotspots = [
    {
      id: 1,
      top: '60%',
      left: '20%',
      name: pick1.name,
      price: formatPrice(pick1.price),
      link: `/product/${pick1.slug}`,
    },
    {
      id: 2,
      top: '75%',
      left: '75%',
      name: pick2.name,
      price: formatPrice(pick2.price),
      link: `/product/${pick2.slug}`,
    },
    {
      id: 3,
      top: '60%',
      left: '85%',
      name: 'Custom Order',
      price: 'Price varies',
      link: '/custom-order',
    }
  ];

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

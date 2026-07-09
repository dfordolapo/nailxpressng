import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ShopTheLook.module.css';

export default function ShopTheLook() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.content}>
            <h2 className={styles.title}>If you can think it,<br />we can do it</h2>
            <Link href="/custom-order" className={styles.button}>
              Customize your set
            </Link>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/customize.png"
              alt="Handmade and factory made nail sets"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/pages/error.module.css';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>500</h1>
        <h2 className={styles.title}>We broke a nail.</h2>
        <p className={styles.message}>
          Something went wrong on our end, and our polish spilled. We&apos;re cleaning it up right now!
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            className={styles.button}
          >
            Try another coat
          </button>
          <Link
            href="/custom-order"
            className={styles.button}
            style={{ 
              backgroundColor: 'transparent',
              color: 'var(--color-primary-800)',
              border: '1.5px solid var(--color-primary-800)',
              boxShadow: 'none'
            }}
          >
            Custom Order
          </Link>
        </div>
      </div>
    </div>
  );
}

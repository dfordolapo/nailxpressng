'use client';

import { useEffect } from 'react';
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
          Something went wrong on our end, and our polish spilled. We're cleaning it up right now!
        </p>
        <button
          onClick={() => reset()}
          className={styles.button}
        >
          Try another coat
        </button>
      </div>
    </div>
  );
}

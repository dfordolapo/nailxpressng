import Link from 'next/link';
import styles from '@/styles/pages/error.module.css';

export default function NotFound() {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.content}>
        <div className={styles.polishDropWrapper}>
          <svg className={styles.polishDrop} style={{ animationDelay: '0.1s' }} preserveAspectRatio="none" viewBox="0 0 32 40" width="20" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C16 0 4 16 4 26C4 32.627 9.373 38 16 38C22.627 38 28 32.627 28 26C28 16 16 0 16 0Z" fill="var(--color-primary-800)"/>
            <path d="M10 24C10 27 12 31 16 33" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" vectorEffect="non-scaling-stroke"/>
          </svg>
          <svg className={styles.polishDrop} style={{ animationDelay: '0.8s' }} preserveAspectRatio="none" viewBox="0 0 32 40" width="35" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C16 0 4 16 4 26C4 32.627 9.373 38 16 38C22.627 38 28 32.627 28 26C28 16 16 0 16 0Z" fill="var(--color-primary-800)"/>
            <path d="M10 24C10 27 12 31 16 33" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" vectorEffect="non-scaling-stroke"/>
          </svg>
          <svg className={styles.polishDrop} style={{ animationDelay: '0.4s' }} preserveAspectRatio="none" viewBox="0 0 32 40" width="25" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C16 0 4 16 4 26C4 32.627 9.373 38 16 38C22.627 38 28 32.627 28 26C28 16 16 0 16 0Z" fill="var(--color-primary-800)"/>
            <path d="M10 24C10 27 12 31 16 33" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" vectorEffect="non-scaling-stroke"/>
          </svg>
          <svg className={styles.polishDrop} style={{ animationDelay: '1.2s' }} preserveAspectRatio="none" viewBox="0 0 32 40" width="40" height="90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C16 0 4 16 4 26C4 32.627 9.373 38 16 38C22.627 38 28 32.627 28 26C28 16 16 0 16 0Z" fill="var(--color-primary-800)"/>
            <path d="M10 24C10 27 12 31 16 33" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" vectorEffect="non-scaling-stroke"/>
          </svg>
          <svg className={styles.polishDrop} style={{ animationDelay: '0.6s' }} preserveAspectRatio="none" viewBox="0 0 32 40" width="22" height="45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C16 0 4 16 4 26C4 32.627 9.373 38 16 38C22.627 38 28 32.627 28 26C28 16 16 0 16 0Z" fill="var(--color-primary-800)"/>
            <path d="M10 24C10 27 12 31 16 33" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" vectorEffect="non-scaling-stroke"/>
          </svg>
          <svg className={styles.polishDrop} style={{ animationDelay: '0.3s' }} preserveAspectRatio="none" viewBox="0 0 32 40" width="30" height="70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C16 0 4 16 4 26C4 32.627 9.373 38 16 38C22.627 38 28 32.627 28 26C28 16 16 0 16 0Z" fill="var(--color-primary-800)"/>
            <path d="M10 24C10 27 12 31 16 33" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" vectorEffect="non-scaling-stroke"/>
          </svg>
        </div>
        <h2 className={styles.title}>Looks like this page chipped off.</h2>
        <p className={styles.message}>
          We couldn&apos;t find what you were looking for. The good news? Our nail sets are much easier to find.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className={styles.button}>
            Back to the Salon
          </Link>
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

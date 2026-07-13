'use client';
import { useState, useEffect } from 'react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div style={{
      backgroundColor: 'var(--color-primary-800)',
      color: 'white',
      textAlign: 'center',
      padding: 'var(--space-4)',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      boxShadow: '0 -4px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
        Looks like your connection lost its polish.
      </h3>
      <p style={{ margin: 0, fontSize: '0.75rem' }}>
        Check your internet connection and we&apos;ll have you back in no time.
      </p>
    </div>
  );
}

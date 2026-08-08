import React from 'react';

export default function Loading() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem',
      backgroundColor: 'var(--color-bg)'
    }}>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .skeleton {
          background: linear-gradient(90deg, #f2e2e4 25%, #ebd7d9 50%, #f2e2e4 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          border-radius: 8px;
        }
      `}</style>

      {/* Hero Banner Skeleton */}
      <div className="skeleton" style={{ height: '350px', width: '100%', marginBottom: '2.5rem', borderRadius: '16px' }}></div>

      {/* Section Title Skeleton */}
      <div className="skeleton" style={{ height: '32px', width: '220px', margin: '0 auto 2.5rem', borderRadius: '8px' }}></div>

      {/* Category Filter Skeleton */}
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'hidden', marginBottom: '2.5rem', paddingBottom: '0.5rem' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton" style={{ height: '70px', width: '65px', borderRadius: '12px', flexShrink: 0 }}></div>
        ))}
      </div>

      {/* Grid Skeleton */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '2rem'
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} style={{ border: '1px solid var(--color-border-light)', borderRadius: '16px', padding: '1rem', background: '#fff' }}>
            {/* Image Placeholder */}
            <div className="skeleton" style={{ height: '260px', width: '100%', borderRadius: '12px', marginBottom: '1rem' }}></div>
            {/* Title Placeholder */}
            <div className="skeleton" style={{ height: '18px', width: '70%', marginBottom: '0.75rem' }}></div>
            {/* Price Placeholder */}
            <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: '1rem' }}></div>
            {/* Button Placeholder */}
            <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: '20px' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isPulling = useRef(false);

  const MAX_PULL = 110;
  const THRESHOLD = 75;

  useEffect(() => {
    const handleTouchStart = (e) => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      // ONLY start pull if user is at the absolute top of the page
      if (scrollTop <= 2 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      } else {
        isPulling.current = false;
      }
    };

    const handleTouchMove = (e) => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;

      // If user scrolled down or was not pulling from top, ignore
      if (!isPulling.current || isRefreshing || scrollTop > 5) {
        if (pullDistance > 0) setPullDistance(0);
        isPulling.current = false;
        return;
      }

      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;

      // Only pull down when distance > 0 from top of page
      if (distance > 0) {
        if (e.cancelable) {
          e.preventDefault(); // Prevent native rubberband scroll conflict
        }
        const resistedDistance = distance * 0.45;
        setPullDistance(Math.min(resistedDistance, MAX_PULL));
      } else {
        isPulling.current = false;
        setPullDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling.current && pullDistance === 0) return;
      isPulling.current = false;

      if (pullDistance >= THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);
        setTimeout(() => {
          window.location.reload();
        }, 400);
      } else {
        setPullDistance(0);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const scale = 0.6 + progress * 0.4;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Pull Indicator Layer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: `${MAX_PULL}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: pullDistance > 0 ? 1 : 0,
          transition: isPulling.current ? 'none' : 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `translateY(${pullDistance - 55}px)`,
            transition: isPulling.current ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              boxShadow: '0 4px 16px rgba(122, 64, 61, 0.2)',
              transform: `scale(${scale}) rotate(${isRefreshing ? 720 : progress * 180}deg)`,
              transition: isRefreshing ? 'all 1s ease-in-out' : 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'var(--color-primary, #7a403d)',
            }}
          >
            <RefreshCw size={22} strokeWidth={2.2} />
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              marginTop: '6px',
              color: 'var(--color-primary, #7a403d)',
              opacity: progress,
              transition: 'opacity 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {isRefreshing ? 'Refreshing...' : pullDistance >= THRESHOLD ? 'Release to Refresh' : 'Pull to Refresh'}
          </div>
        </div>
      </div>

      {/* Main Content Container Layer */}
      <div
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : 'none',
          transition: isPulling.current ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isPulling = useRef(false);
  
  const MAX_PULL = 120;
  const THRESHOLD = 80;

  const router = useRouter();

  useEffect(() => {
    // Add touch event listeners manually so we can make them non-passive if needed
    // However, for this simple implementation, passive is fine. 
    // We rely on CSS overscroll-behavior-y: none on body to prevent native refresh.
    
    const handleTouchStart = (e) => {
      if (window.scrollY === 0 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling.current || isRefreshing) return;
      
      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;
      
      // Only trigger if pulling down
      if (distance > 0) {
        // Add resistance factor
        const resistedDistance = distance * 0.5; 
        setPullDistance(Math.min(resistedDistance, MAX_PULL));
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling.current || isRefreshing) return;
      isPulling.current = false;
      
      if (pullDistance >= THRESHOLD) {
        setIsRefreshing(true);
        // Provide a small delay so the animation can play out
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        // Snap back
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

  // Calculate dynamic properties based on pull distance
  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const rotation = progress * 360; // Spin up to 360 degrees
  const scale = 0.5 + (progress * 0.5); // Scale from 0.5 to 1.0

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* The Visual Indicator Layer */}
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
          zIndex: 1000,
          opacity: pullDistance > 0 ? 1 : 0,
          transition: isPulling.current ? 'none' : 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}
      >
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `translateY(${pullDistance - 60}px)`,
            transition: isPulling.current ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
        >
          <div 
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'white',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transform: `scale(${scale}) rotate(${isRefreshing ? 720 : progress * 180}deg)`,
              transition: isRefreshing ? 'all 1s ease-in-out' : 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'var(--color-primary)'
            }}
          >
            <RefreshCw size={20} strokeWidth={2} />
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            marginTop: '8px',
            color: 'var(--color-primary)',
            opacity: progress,
            transition: 'opacity 0.2s',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {isRefreshing ? 'Refreshing...' : pullDistance >= THRESHOLD ? 'Release to Refresh' : 'Pull to Refresh'}
          </div>
        </div>
      </div>

      {/* The Main Content Layer */}
      <div 
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling.current ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'var(--color-background)'
        }}
      >
        {children}
      </div>
    </div>
  );
}

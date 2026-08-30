'use client';

import React, { useRef, useState, useCallback } from 'react';
import Link from 'next/link';

export default function MagneticButton({ 
  href, 
  children, 
  className = '', 
  style = {},
  target,
  rel,
  onClick
}) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glossPos, setGlossPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Magnetic pull distance
    const pullX = (e.clientX - centerX) * 0.28;
    const pullY = (e.clientY - centerY) * 0.28;
    setPosition({ x: pullX, y: pullY });

    // Liquid gloss sheen coordinates
    const localX = ((e.clientX - rect.left) / rect.width) * 100;
    const localY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlossPos({ x: localX, y: localY });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const content = (
    <span
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`magneticBtnWrapper ${className}`}
      style={{
        ...style,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
      }}
    >
      <style jsx>{`
        .magneticBtnWrapper {
          animation: attentionPopHeartbeat 3.2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }
        .magneticBtnWrapper:hover {
          animation: none;
        }
        .shimmerBeam {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 15%,
            rgba(255, 255, 255, 0.75) 45%,
            rgba(255, 255, 255, 0.95) 50%,
            rgba(255, 255, 255, 0.75) 55%,
            transparent 85%
          );
          transform: translateX(-150%) skewX(-22deg);
          animation: buttonShimmerSweep 3.2s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes attentionPopHeartbeat {
          0%, 65%, 100% {
            box-shadow: 0 4px 14px rgba(122, 64, 61, 0.18);
            transform: scale(1);
          }
          72% {
            box-shadow: 0 10px 28px rgba(122, 64, 61, 0.38), 0 0 20px rgba(255, 175, 185, 0.5);
            transform: scale(1.07);
          }
          80% {
            box-shadow: 0 4px 14px rgba(122, 64, 61, 0.2);
            transform: scale(1.02);
          }
          88% {
            box-shadow: 0 12px 30px rgba(122, 64, 61, 0.42), 0 0 24px rgba(255, 175, 185, 0.6);
            transform: scale(1.06);
          }
        }
        @keyframes buttonShimmerSweep {
          0%, 60% {
            transform: translateX(-160%) skewX(-22deg);
          }
          85%, 100% {
            transform: translateX(190%) skewX(-22deg);
          }
        }
      `}</style>

      {/* Ambient Periodic Shimmer Glint */}
      <span className="shimmerBeam" />

      {/* Liquid Lacquer Gloss Radial Highlight */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: isHovered
            ? `radial-gradient(circle 80px at ${glossPos.x}% ${glossPos.y}%, rgba(255, 255, 255, 0.4) 0%, transparent 80%)`
            : 'none',
          pointerEvents: 'none',
          zIndex: 2,
          transition: 'opacity 0.2s ease',
        }}
      />
      <span style={{ position: 'relative', zIndex: 3, display: 'inline-flex', alignItems: 'center' }}>
        {children}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} style={{ display: 'inline-block', textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
}

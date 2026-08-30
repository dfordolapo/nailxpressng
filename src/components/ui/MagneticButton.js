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
      className={className}
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
      {/* Liquid Lacquer Gloss Radial Highlight */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: isHovered
            ? `radial-gradient(circle 80px at ${glossPos.x}% ${glossPos.y}%, rgba(255, 255, 255, 0.35) 0%, transparent 80%)`
            : 'none',
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease',
        }}
      />
      {children}
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

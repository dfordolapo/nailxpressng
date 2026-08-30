'use client';

import React from 'react';

export function NailIcon({ size = 22, className = '', style = {}, color = "currentColor" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Feminine Slender Fingertip Contour */}
      <path 
        d="M7 22V13.5C7 8.5 9 5 12 5C15 5 17 8.5 17 13.5V22" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />

      {/* Glossy Polished Almond Painted Nail */}
      <path 
        d="M12 2C9.5 5 8.5 9 8.5 13.5C8.5 15.5 10 16.5 12 16.5C14 16.5 15.5 15.5 15.5 13.5C15.5 9 14.5 5 12 2Z" 
        fill={color}
      />

      {/* Delicate Gloss Shine Streak */}
      <path 
        d="M10.5 5.5C9.8 7.8 9.5 10.5 9.6 13" 
        stroke="rgba(255, 255, 255, 0.85)" 
        strokeWidth="1" 
        strokeLinecap="round"
      />

      {/* Feminine Fairy Sparkle Star */}
      <path 
        d="M18.5 3L19.2 4.8L21 5.5L19.2 6.2L18.5 8L17.8 6.2L16 5.5L17.8 4.8L18.5 3Z" 
        fill={color}
      />
    </svg>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { nailShapes, nailLengths } from "@/data/categories";
import styles from "@/styles/components/shapeFilter.module.css";

export default function ShapeFilterBar({ 
  selectedShapes = [], onToggleShape, 
  selectedLengths = [], onToggleLength,
  selectedColors = [], onToggleColor
}) {
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);
  const lastScrollTime = useRef(0);
  const scrollAreaRef = useRef(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  
  // Track button-specific touch starts/ends to block click events on drag
  const ignoreNextClick = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const updateArrows = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, []);

  const scroll = (direction) => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -220 : 220;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
    dragStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const handleTouchMove = (e) => {
    const deltaX = Math.abs(e.touches[0].clientX - dragStartX.current);
    const deltaY = Math.abs(e.touches[0].clientY - dragStartY.current);
    if (deltaX > 6 || deltaY > 6) {
      isDragging.current = true;
    }
  };

  const handleScroll = () => {
    lastScrollTime.current = Date.now();
    updateArrows();
  };

  const handleBtnTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    ignoreNextClick.current = false;
  };

  const handleBtnTouchEnd = (e) => {
    const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX.current);
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // If the touch moved by more than 5px in any direction, treat it as a drag and suppress the click
    if (deltaX > 5 || deltaY > 5) {
      ignoreNextClick.current = true;
    }
  };

  const handleShapeClick = (shapeId) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if (isDragging.current || (Date.now() - lastScrollTime.current < 150)) {
      isDragging.current = false;
      return;
    }
    onToggleShape(shapeId);
  };

  const handleLengthClick = (lengthId) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if (isDragging.current || (Date.now() - lastScrollTime.current < 150)) {
      isDragging.current = false;
      return;
    }
    if (onToggleLength) {
      onToggleLength(lengthId);
    }
  };

  const handleColorClick = (colorId) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if (isDragging.current || (Date.now() - lastScrollTime.current < 150)) {
      isDragging.current = false;
      return;
    }
    if (onToggleColor) {
      onToggleColor(colorId);
    }
  };
  
  const colors = [
    { id: "Red", hex: "#ef4444" },
    { id: "Pink", hex: "#f472b6" },
    { id: "Nude", hex: "#f5d0b5" },
    { id: "Brown", hex: "#78350f" },
    { id: "Black", hex: "#171717" },
    { id: "White", hex: "#ffffff", border: "#e2e8f0" },
    { id: "Green", hex: "#166534" },
    { id: "Blue", hex: "#1e3a8a" },
    { id: "Purple", hex: "#7e22ce" },
    { id: "Yellow", hex: "#facc15" },
    { id: "Multi", hex: "conic-gradient(from 180deg at 50% 50%, #ff0000, #ff8000, #ffff00, #00ff00, #0000ff, #8000ff, #ff00ff, #ff0000)" }
  ];
  return (
    <div className={styles.container}>
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll('left'); }} 
        onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); scroll('left'); }} 
        className={`${styles.scrollBtn} ${!showLeftArrow ? styles.scrollBtnHidden : ""}`} 
        style={{ left: "-8px" }}
        aria-label="Scroll left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll('right'); }} 
        onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); scroll('right'); }} 
        className={`${styles.scrollBtn} ${!showRightArrow ? styles.scrollBtnHidden : ""}`} 
        style={{ right: "-8px" }}
        aria-label="Scroll right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      <div 
        ref={scrollAreaRef}
        className={styles.scrollArea}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onScroll={handleScroll}
      >
        <div className={styles.filterGroupLabel}>Shapes</div>
        
        {nailShapes.map((shape) => {
          const isSelected = selectedShapes.includes(shape.id);
          return (
            <button
              key={shape.id}
              className={`${styles.shapeBtn} ${isSelected ? styles.selected : ""}`}
              onTouchStart={handleBtnTouchStart}
              onTouchEnd={handleBtnTouchEnd}
              onClick={() => handleShapeClick(shape.id)}
              aria-pressed={isSelected}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={shape.image} 
                  alt={`${shape.name} nail shape`} 
                  fill
                  sizes="40px"
                  style={{ objectFit: 'contain', transform: shape.id === 'coffin' ? 'scale(1.9)' : 'scale(2.2)' }}
                />
              </div>
              <span className={styles.name}>{shape.name}</span>
            </button>
          );
        })}
        
        {/* Separator between shapes and lengths */}
        {nailLengths && nailLengths.length > 0 && <div className={styles.filterGroupLabel}>Lengths</div>}
        
        {nailLengths && nailLengths.map((length) => {
          const isSelected = selectedLengths.includes(length.id);
          return (
            <button
              key={`len-${length.id}`}
              className={`${styles.shapeBtn} ${styles.lengthBtn} ${isSelected ? styles.selected : ""}`}
              onTouchStart={handleBtnTouchStart}
              onTouchEnd={handleBtnTouchEnd}
              onClick={() => handleLengthClick(length.id)}
              aria-pressed={isSelected}
            >
              <div className={styles.textWrapper}>
                <span className={styles.lengthName}>{length.name}</span>
              </div>
            </button>
          );
        })}

        {/* Separator between lengths and colors */}
        <div className={styles.filterGroupLabel}>Colors</div>
        
        {colors.map((color) => {
          const isSelected = selectedColors.includes(color.id);
          return (
            <button
              key={`color-${color.id}`}
              className={`${styles.shapeBtn} ${styles.colorBtn} ${isSelected ? styles.selected : ""}`}
              onTouchStart={handleBtnTouchStart}
              onTouchEnd={handleBtnTouchEnd}
              onClick={() => handleColorClick(color.id)}
              aria-pressed={isSelected}
            >
              <div 
                className={styles.colorSwatch}
                style={{ 
                  background: color.hex,
                  border: color.border ? `1px solid ${color.border}` : 'none',
                  boxShadow: isSelected ? '0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-primary)' : 'none',
                }}
              />
              <span className={styles.name} style={{ marginTop: '8px' }}>{color.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


"use client";

import { useRef } from "react";
import Image from "next/image";
import { nailShapes, nailLengths } from "@/data/categories";
import styles from "@/styles/components/shapeFilter.module.css";

export default function ShapeFilterBar({ selectedShapes = [], onToggleShape, selectedLengths = [], onToggleLength }) {
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);
  const lastScrollTime = useRef(0);
  
  // Track button-specific touch starts/ends to block click events on drag
  const ignoreNextClick = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

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

  return (
    <div className={styles.container}>
      <div 
        className={styles.scrollArea}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onScroll={handleScroll}
      >
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
        {nailLengths && nailLengths.length > 0 && <div className={styles.separator}></div>}
        
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
      </div>
    </div>
  );
}


"use client";

import { useRef } from "react";
import Image from "next/image";
import { nailShapes, nailLengths } from "@/data/categories";
import styles from "@/styles/components/shapeFilter.module.css";

export default function ShapeFilterBar({ selectedShapes = [], onToggleShape, selectedLengths = [], onToggleLength }) {
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
    dragStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const handleTouchMove = (e) => {
    const deltaX = Math.abs(e.touches[0].clientX - dragStartX.current);
    const deltaY = Math.abs(e.touches[0].clientY - dragStartY.current);
    // If user dragged horizontally or vertically by more than 8 pixels, mark as dragging
    if (deltaX > 8 || deltaY > 8) {
      isDragging.current = true;
    }
  };

  const handleShapeClick = (shapeId) => {
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }
    onToggleShape(shapeId);
  };

  const handleLengthClick = (lengthId) => {
    if (isDragging.current) {
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
      >
        {nailShapes.map((shape) => {
          const isSelected = selectedShapes.includes(shape.id);
          return (
            <button
              key={shape.id}
              className={`${styles.shapeBtn} ${isSelected ? styles.selected : ""}`}
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


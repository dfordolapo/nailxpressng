"use client";

import Image from "next/image";
import { nailShapes } from "@/data/categories";
import styles from "@/styles/components/shapeFilter.module.css";

export default function ShapeFilterBar({ selectedShapes = [], onToggleShape }) {
  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        {nailShapes.map((shape) => {
          const isSelected = selectedShapes.includes(shape.id);
          return (
            <button
              key={shape.id}
              className={`${styles.shapeBtn} ${isSelected ? styles.selected : ""}`}
              onClick={() => onToggleShape(shape.id)}
              aria-pressed={isSelected}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={shape.image} 
                  alt={`${shape.name} nail shape`} 
                  fill
                  sizes="40px"
                  style={{ objectFit: 'contain', transform: 'scale(1.4)' }}
                />
              </div>
              <span className={styles.name}>{shape.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

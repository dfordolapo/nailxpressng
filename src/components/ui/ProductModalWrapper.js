"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import styles from "@/styles/components/product-modal.module.css";

export default function ProductModalWrapper({ children, title }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Wait for animation to finish before routing back
    setTimeout(() => {
      router.back();
    }, 300); // matches CSS transition duration
  }, [router]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div 
      className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`} 
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={`${styles.modalContainer} ${isOpen ? styles.modalOpen : ""}`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing
      >
        <div className={styles.dragHandle} aria-hidden="true"></div>
        
        <div className={styles.modalHeader}>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            aria-label="Close details"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";

export default function ImageZoomModal({ isOpen, onClose, imageSrc, altText }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        // Close when clicking the background
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2147483647,
          color: 'white'
        }}
        aria-label="Close"
      >
        <X size={24} />
      </button>
      
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        <Image 
          src={imageSrc} 
          alt={altText || "Product Image Zoom"} 
          fill
          sizes="100vw"
          style={{
            objectFit: 'contain',
            borderRadius: '8px'
          }}
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

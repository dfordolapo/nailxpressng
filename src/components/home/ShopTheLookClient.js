'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductModalWrapper from '@/components/ui/ProductModalWrapper';
import ProductQuickView from '@/components/product/ProductQuickView';
import MagneticButton from '@/components/ui/MagneticButton';
import { NailIcon } from '@/components/ui/NailIcon';
import styles from './ShopTheLook.module.css';

export default function ShopTheLookClient({ hotspots, whatsappUrl }) {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const imageBoxRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return;
    const box = imageBoxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTilt({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleExploreClick = (e, spot) => {
    if (spot.product) {
      e.preventDefault();
      e.stopPropagation();
      setSelectedQuickViewProduct(spot.product);
    }
  };

  return (
    <>
      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.content}>
              <h2 className={styles.title}>If you can think it,<br />we can do it</h2>
              <MagneticButton href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.button}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
                  <span>Customize your set</span>
                  <NailIcon size={22} />
                </span>
              </MagneticButton>
            </div>

            <div 
              className={styles.imageWrapper}
              ref={imageBoxRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: 1000,
                transform: isHovered ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'perspective(1000px) rotateX(0) rotateY(0)',
                transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div className={styles.innerImageCard}>
                <Image
                  src="/images/customize.png"
                  alt="Handmade and factory made nail sets"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.image}
                />
              </div>

              {/* Interactive Pulsing Hotspots */}
              {hotspots.map((spot) => {
                const isActive = activeHotspot === spot.id;
                const isNearRight = parseInt(spot.left) > 60;
                const isNearLeft = parseInt(spot.left) < 35;
                return (
                  <div 
                    key={spot.id}
                    className={`${styles.hotspot} ${isActive ? styles.activeHotspot : ''}`}
                    style={{ top: spot.top, left: spot.left }}
                    onMouseEnter={() => {
                      if (typeof window !== 'undefined' && window.innerWidth > 768) {
                        setActiveHotspot(spot.id);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(prev => prev === spot.id ? null : spot.id);
                    }}
                  >
                    {/* Multi-tier animated radar ripple */}
                    <div className={styles.radarRing1} />
                    <div className={styles.radarRing2} />
                    
                    <div className={styles.dot}>
                      <Plus size={14} className={isActive ? styles.rotatePlus : ''} />
                    </div>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.div 
                          className={`${styles.popover} ${styles.popoverAbove} ${isNearRight ? styles.popoverRightAlign : isNearLeft ? styles.popoverLeftAlign : ''}`}
                          initial={{ opacity: 0, y: -8, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.95 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className={styles.popoverTag}>Featured Look</span>
                          <p className={styles.popoverName}>{spot.name}</p>
                          <p className={styles.popoverPrice}>{spot.price}</p>
                          {spot.product ? (
                            <button 
                              type="button" 
                              onClick={(e) => handleExploreClick(e, spot)} 
                              className={styles.popoverLinkBtn}
                            >
                              Explore Design →
                            </button>
                          ) : (
                            <Link href={spot.link} className={styles.popoverLinkBtn}>
                              Explore Design →
                            </Link>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Side Drawer on Desktop / Bottom Sheet on Mobile */}
      {selectedQuickViewProduct && (
        <ProductModalWrapper onClose={() => setSelectedQuickViewProduct(null)}>
          <ProductQuickView product={selectedQuickViewProduct} />
        </ProductModalWrapper>
      )}
    </>
  );
}

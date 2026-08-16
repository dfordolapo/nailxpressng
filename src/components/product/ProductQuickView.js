"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";
import { useModal } from "@/components/ui/ProductModalWrapper";
import { ChevronRight, Package, Truck } from "lucide-react";
import styles from "@/styles/components/quick-view.module.css";

export default function ProductQuickView({ product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { onClose } = useModal();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedShape, setSelectedShape] = useState(product?.nailShape || "Almond");
  const [selectedLength, setSelectedLength] = useState(product?.lengths?.[0] || "Medium");
  const [selectedSize, setSelectedSize] = useState("M (Most Popular)");
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [thumbErrors, setThumbErrors] = useState({});

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedLength);
    showToast(`"${product.name}" added to cart`);
    onClose();
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedSize, selectedLength);
    onClose(() => router.push("/checkout"));
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.mainImageContainer}>
            {product.images && product.images[selectedImage] && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className={styles.mainImage} 
                onError={() => setImgError(true)}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-surface))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>💅</div>
            )}
          </div>
          <div className={styles.info}>
            <h2 className={styles.title}>{product.name}</h2>
            <div className={styles.price}>{formatPrice(product.price)}</div>
            <p className={styles.description}>{product.description || "A luminous set that gives luxury in every detail."}</p>
          </div>
        </div>

        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className={styles.thumbnails}>
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                className={`${styles.thumbnail} ${selectedImage === idx ? styles.active : ""}`}
                onClick={() => {
                  setSelectedImage(idx);
                  setImgError(false);
                }}
              >
                {thumbErrors[idx] ? (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-surface))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💅</div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" onError={() => setThumbErrors(prev => ({...prev, [idx]: true}))} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className={styles.controlsGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Shape</label>
            <select 
              className={styles.select} 
              value={selectedShape}
              onChange={(e) => setSelectedShape(e.target.value)}
            >
              <option value="Almond">Almond</option>
              <option value="Coffin">Coffin</option>
              <option value="Square">Square</option>
              <option value="Stiletto">Stiletto</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Length</label>
            <select 
              className={styles.select}
              value={selectedLength}
              onChange={(e) => setSelectedLength(e.target.value)}
            >
              {(product.lengths || ["Short", "Medium", "Long"]).map(len => (
                <option key={len} value={len}>{len}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Size</label>
            <select 
              className={styles.select}
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="S">S</option>
              <option value="M (Most Popular)">M (Most Popular)</option>
              <option value="L">L</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
        </div>

        {/* Quantity */}
        <div className={styles.quantityRow}>
          <span className={styles.label}>Quantity</span>
          <div className={styles.quantityAdjuster}>
            <button className={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <div className={styles.qtyValue}>{quantity}</div>
            <button className={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        {/* Accordions */}
        <div className={styles.accordions}>
          <div className={styles.accordion}>
            <button className={styles.accordionHeader} onClick={() => toggleAccordion(0)}>
              <div className={styles.accordionTitle}>
                <Package className={styles.accordionIcon} size={20} />
                What&apos;s Included
              </div>
              <ChevronRight className={`${styles.chevron} ${openAccordion === 0 ? styles.chevronOpen : ""}`} size={20} />
            </button>
            <div className={`${styles.accordionContent} ${openAccordion === 0 ? styles.accordionContentOpen : ""}`}>
              10 press-on nails, nail glue, adhesive tabs, cuticle pusher, alcohol prep pad, and a mini file. Everything you need for a perfect application.
            </div>
          </div>
          
          <div className={styles.accordion}>
            <button className={styles.accordionHeader} onClick={() => toggleAccordion(1)}>
              <div className={styles.accordionTitle}>
                <Truck className={styles.accordionIcon} size={20} />
                Shipping & Delivery
              </div>
              <ChevronRight className={`${styles.chevron} ${openAccordion === 1 ? styles.chevronOpen : ""}`} size={20} />
            </button>
            <div className={`${styles.accordionContent} ${openAccordion === 1 ? styles.accordionContentOpen : ""}`}>
              Standard delivery takes 3-5 business days within Nigeria. Express delivery (1-2 days) is available at checkout for selected locations.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <button className={styles.btnPrimary} onClick={handleAddToCart}>
          Add to Cart <span>{formatPrice(product.price * quantity)}</span>
        </button>
        <button className={styles.btnSecondary} onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>
    </div>
  );
}

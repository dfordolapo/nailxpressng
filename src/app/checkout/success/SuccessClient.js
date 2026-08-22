'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import styles from '@/styles/pages/success.module.css';
import SuccessPrinterAnimation from '@/components/checkout/SuccessPrinterAnimation';
import HandmadeProductCard from '@/components/product/HandmadeProductCard';
import ProductCard from '@/components/product/ProductCard';

export default function SuccessClient({ orderDetails, recommendedProducts = [] }) {
  const getTimelineSteps = () => {
    // Always show consistent steps
    return ['Ordered', 'Processing', 'Shipped', 'Delivered'];
  };

  const steps = getTimelineSteps();

  useEffect(() => {
    // Fire confetti on load
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff8a8a', '#ffd1d1', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff8a8a', '#ffd1d1', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);


  return (
    <div className={styles.container}>
      
      {/* Printer Animation */}
      <SuccessPrinterAnimation orderDetails={orderDetails} />
      
      {/* Order Timeline */}
      <div style={{ 
        background: 'white', 
        padding: '1.25rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        marginBottom: '1.5rem',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>Delivery Status</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {/* Progress Bar Background */}
          <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '2px', background: '#f0f0f0', zIndex: 1 }}></div>
          {/* Active Progress */}
          <div style={{ position: 'absolute', top: '16px', left: '10%', width: '33%', height: '2px', background: 'var(--color-primary)', zIndex: 2 }}></div>
          
          {/* Steps */}
          {steps.map((step, index) => (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, position: 'relative', width: '25%' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: index <= 1 ? 'var(--color-primary)' : 'white', 
                border: index <= 1 ? 'none' : '2px solid #e0e0e0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: index <= 1 ? 'white' : '#aaa',
                marginBottom: '6px',
                fontSize: '0.8rem',
                boxShadow: index <= 1 ? '0 0 0 3px var(--color-primary-100)' : 'none'
              }}>
                {index <= 1 ? '✓' : (index + 1)}
              </div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: index <= 1 ? 600 : 500, color: index <= 1 ? 'var(--color-text)' : '#999' }}>{step}</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
          Estimated Delivery: <strong>{orderDetails.delivery}</strong>
        </p>
      </div>

      <div className={styles.actions} style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <Link href="/shop" className={styles.primaryBtn} style={{ background: 'var(--color-primary)', color: 'white', padding: '12px 32px', borderRadius: '30px', textDecoration: 'none', fontWeight: 600 }}>
          Continue Shopping
        </Link>
      </div>

      {/* Recommendations */}
      <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '1.5rem', width: '100%', maxWidth: '800px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>While you wait...</h3>
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '1rem', 
          paddingBottom: '1rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {recommendedProducts.map(product => (
            <div key={product.id} style={{ minWidth: '220px', flexShrink: 0, scrollSnapAlign: 'start' }}>
              {product.category === 'handmade' ? (
                <HandmadeProductCard product={product} />
              ) : (
                <ProductCard product={product} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

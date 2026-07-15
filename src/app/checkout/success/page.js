'use client';

import React from 'react';
import Link from 'next/link';
import styles from '@/styles/pages/success.module.css';
import SuccessPrinterAnimation from '@/components/checkout/SuccessPrinterAnimation';

export default function OrderSuccessPage() {
  const dummyOrderDetails = {
    orderNumber: '#NX-9482',
    date: 'Jul 15, 2026',
    items: '3',
    total: '₦45,500',
    delivery: '3-5 days'
  };

  return (
    <div className={styles.container}>
      <SuccessPrinterAnimation orderDetails={dummyOrderDetails} />
      
      <div className={styles.actions}>
        <Link href="/shop" className={styles.primaryBtn}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

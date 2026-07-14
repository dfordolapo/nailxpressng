'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/pages/success.module.css';
import OrderReceipt from './OrderReceipt';

export default function SuccessPrinterAnimation({ orderDetails }) {
  return (
    <div className={styles.scene}>
      <div className={styles.printerContainer}>
        {/* Receipt Container with overflow hidden to simulate emerging from slot */}
        <div className={styles.receiptWrapper}>
          <OrderReceipt orderDetails={orderDetails} />
        </div>

        {/* 3D Printer Image */}
        <div className={styles.printerImageWrapper}>
          <Image 
            src="/images/printer-3d-front.png" 
            alt="3D Thermal Printer" 
            width={400} 
            height={400} 
            className={styles.printerImage} 
            priority
          />
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import styles from '@/styles/pages/success.module.css';

export default function OrderReceipt({ orderDetails }) {
  const { orderNumber, date, items, total, delivery } = orderDetails;

  return (
    <div className={styles.receipt}>
      <div className={styles.receiptTitle}>Order Confirmed</div>
      
      <div className={styles.receiptLine}>
        <span>Order #</span>
        <span>{orderNumber}</span>
      </div>
      
      <div className={styles.receiptLine}>
        <span>Date</span>
        <span>{date}</span>
      </div>
      
      <div className={styles.receiptLine}>
        <span>Items</span>
        <span>{items}</span>
      </div>
      
      <div className={styles.receiptLine}>
        <span>Total Paid</span>
        <span>{total}</span>
      </div>
      

      
    </div>
  );
}

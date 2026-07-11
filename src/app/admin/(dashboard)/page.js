"use client";

import Link from "next/link";
import { Calendar, Package, ArrowUpRight, MoreVertical, Star } from "lucide-react";
import styles from "@/styles/admin.module.css";

const DUMMY_PRODUCTS = [
  { id: 1, name: "Blush Bloom", collection: "Handmade", price: 12500, status: "In Stock", date: "May 13, 2025", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=80" },
  { id: 2, name: "Red Romance", collection: "Factory Made", price: 8000, status: "In Stock", date: "May 12, 2025", image: "https://images.unsplash.com/photo-1522337360788-8b13fee7a371?auto=format&fit=crop&q=80&w=80" },
  { id: 3, name: "Gold Luxe", collection: "Handmade", price: 15000, status: "Out of Stock", date: "May 11, 2025", image: "https://images.unsplash.com/photo-1595868228308-0118fb01b315?auto=format&fit=crop&q=80&w=80" },
  { id: 4, name: "Soft Pink", collection: "Factory Made", price: 6500, status: "In Stock", date: "May 10, 2025", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80&w=80" },
];

export default function AdminDashboard() {
  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Here's what's happening with your store today.</p>
        </div>
        <div className={styles.datePicker} style={{ position: "relative" }}>
          <Calendar size={16} style={{ position: "absolute", left: "10px", pointerEvents: "none" }} />
          <input 
            type="date" 
            defaultValue="2025-05-13" 
            style={{ 
              border: "none", 
              outline: "none", 
              background: "transparent", 
              color: "#555", 
              fontFamily: "inherit", 
              fontSize: "0.9rem",
              paddingLeft: "24px",
              cursor: "pointer"
            }} 
          />
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total</div>
          <div className={styles.statValue}>128</div>
          <div className={styles.statTrend}>↑ 12 new this month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Handmade</div>
          <div className={styles.statValue}>68</div>
          <div className={styles.statTrend}>↑ 8 new this month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Factory</div>
          <div className={styles.statValue}>60</div>
          <div className={styles.statTrend}>↑ 4 new this month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Featured</div>
          <div className={styles.statValue}>24</div>
          <Link href="/admin/products?featured=true" className={styles.statLink}>
            View all →
          </Link>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Recent Products</h2>
        <Link href="/admin/products" className={styles.viewAll}>
          View all <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Collection</th>
              <th>Price</th>
              <th>Status</th>
              <th>Added</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {DUMMY_PRODUCTS.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.productCell}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt={product.name} className={styles.productImg} />
                    <span className={styles.productName}>{product.name}</span>
                  </div>
                </td>
                <td>{product.collection}</td>
                <td style={{ fontWeight: 500 }}>₦{product.price.toLocaleString()}</td>
                <td>
                  <span className={`${styles.badge} ${product.status === "In Stock" ? styles.inStock : styles.outOfStock}`}>
                    {product.status}
                  </span>
                </td>
                <td style={{ color: "#666" }}>{product.date}</td>
                <td style={{ textAlign: "right" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}>
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ChevronDown({ size, style }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

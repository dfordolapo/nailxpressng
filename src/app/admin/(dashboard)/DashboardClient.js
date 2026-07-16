"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Package, ArrowUpRight, MoreVertical, Star } from "lucide-react";
import styles from "@/styles/admin.module.css";
import { formatPrice } from "@/lib/utils";
// Using Supabase Live Data

export default function DashboardClient({ initialProducts }) {
  const [productsList, setProductsList] = useState(initialProducts || []);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const todayDate = new Date().toISOString().split("T")[0];
  
  const stats = {
    total: productsList.length,
    handmade: productsList.filter(p => p.categoryName === 'Handmade').length,
    factory: productsList.filter(p => p.categoryName === 'Factory Made').length,
    featured: productsList.filter(p => p.bestseller).length
  };

  const handleMenuClick = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/admin/products/${productToDelete}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Failed to delete product");
        setProductsList(prev => prev.filter(p => p.id !== productToDelete));
        setProductToDelete(null);
      } catch (err) {
        console.error(err);
        alert("Error deleting product");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/products/new?edit=${id}`);
    setOpenMenuId(null);
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Hi, Funmi,</h1>
          <p className={styles.pageSubtitle}>Here's what's happening with your store today.</p>
        </div>
        <div className={styles.datePicker} style={{ position: "relative" }}>
          <Calendar size={16} style={{ position: "absolute", left: "10px", pointerEvents: "none" }} />
          <input 
            type="date" 
            defaultValue={todayDate} 
            min="2026-07-31"
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
          <div className={styles.statTitle}>Products</div>
          <div className={styles.statValue}>{stats.total}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Handmade</div>
          <div className={styles.statValue}>{stats.handmade}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Factory</div>
          <div className={styles.statValue}>{stats.factory}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Featured</div>
          <div className={styles.statValue}>{stats.featured}</div>
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
            {productsList.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>💅</div>
                  <h3 style={{ fontSize: "1.125rem", color: "var(--color-primary-800)", marginBottom: "var(--space-2)", fontFamily: "var(--font-heading)" }}>Your shelves are bare</h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "var(--space-6)" }}>Start adding your beautiful nail sets to see them here.</p>
                  <Link href="/admin/products/new" className={styles.btnPrimary} style={{ display: "inline-flex", margin: "0 auto" }}>
                    Add First Product
                  </Link>
                </td>
              </tr>
            ) : (
              [...productsList]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((product, index, arr) => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productCell}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.images?.[0] || '/images/hero.png'} alt={product.name} className={styles.productImg} />
                      <span className={styles.productName}>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.categoryName}</td>
                  <td style={{ fontWeight: 500 }}>{formatPrice(product.price)}</td>
                  <td>
                    <span className={`${styles.badge} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td style={{ color: "#666" }}>{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: "right", position: "relative" }}>
                    <button 
                      onClick={() => handleMenuClick(product.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: "4px" }}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === product.id && (
                      <div 
                        className={styles.kebabMenu}
                        style={arr.length > 2 && index >= arr.length - 2 ? { top: "auto", bottom: "30px" } : {}}
                      >
                        <button className={styles.kebabItem} onClick={() => handleEdit(product.id)}>Edit</button>
                        <button className={styles.kebabItem} onClick={() => handleDuplicate(product.id)}>Duplicate</button>
                        <button className={styles.kebabItem} onClick={() => handleToggleFeature(product.id)}>
                          {product.featured ? "Unfeature" : "Feature"}
                        </button>
                        <button className={`${styles.kebabItem} ${styles.kebabDelete}`} onClick={() => handleDeleteClick(product.id)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {productToDelete && (
        <div className={styles.modalOverlay} onClick={() => setProductToDelete(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Product</h3>
            <p className={styles.modalText}>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtnCancel} onClick={() => setProductToDelete(null)}>Cancel</button>
              <button className={styles.modalBtnDelete} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
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

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, Package, ArrowUpRight, MoreVertical, Star, TrendingUp, ShoppingBag, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import styles from "@/styles/admin.module.css";
import { formatPrice } from "@/lib/utils";

export default function DashboardClient({ initialProducts, initialOrders = [], initialCustomOrders = [] }) {
  const [productsList, setProductsList] = useState(initialProducts || []);
  const [ordersList, setOrdersList] = useState(initialOrders || []);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const todayDate = new Date().toISOString().split("T")[0];
  
  // Real sales & order analytics
  const paidOrders = ordersList.filter(o => o.status !== 'abandoned' && o.status !== 'cancelled');
  const abandonedOrders = ordersList.filter(o => o.status === 'abandoned');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const processingOrdersCount = ordersList.filter(o => o.status === 'processing' || o.status === 'pending').length;
  const customOrdersPending = initialCustomOrders.filter(c => c.status === 'pending').length;

  const stats = {
    totalProducts: productsList.length,
    totalRevenue,
    paidOrdersCount: paidOrders.length,
    abandonedCount: abandonedOrders.length,
    processingCount: processingOrdersCount,
    customPending: customOrdersPending,
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
          <p className={styles.pageSubtitle}>Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <div className={styles.datePicker} style={{ position: "relative" }}>
          <Calendar size={16} style={{ position: "absolute", left: "10px", pointerEvents: "none" }} />
          <input 
            type="date" 
            defaultValue={todayDate} 
            min="2026-07-31"
            suppressHydrationWarning
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
          <div className={styles.statTitle}>Total Revenue</div>
          <div className={styles.statValue} style={{ fontSize: "1.75rem", color: "var(--color-primary-800)" }}>
            {formatPrice(stats.totalRevenue)}
          </div>
          <div className={styles.statTrend} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} /> {stats.paidOrdersCount} completed orders
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Orders to Fulfill</div>
          <div className={styles.statValue}>{stats.processingCount}</div>
          <Link href="/admin/orders?status=processing" className={styles.statLink}>
            View active orders →
          </Link>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Custom Nail Requests</div>
          <div className={styles.statValue}>{stats.customPending}</div>
          <Link href="/admin/custom-orders" className={styles.statLink}>
            Review requests →
          </Link>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Catalog Products</div>
          <div className={styles.statValue}>{stats.totalProducts}</div>
          <Link href="/admin/products" className={styles.statLink}>
            Manage inventory →
          </Link>
        </div>
      </div>

      {/* Quick Action banner for Abandoned Recoveries if any */}
      {stats.abandonedCount > 0 && (
        <div style={{
          background: "linear-gradient(135deg, rgba(122, 64, 61, 0.06), rgba(122, 64, 61, 0.02))",
          border: "1px solid rgba(122, 64, 61, 0.15)",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(122, 64, 61, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-primary)"
            }}>
              <Clock size={18} />
            </div>
            <div>
              <h4 style={{ margin: "0 0 2px 0", fontSize: "0.95rem", color: "var(--color-primary-900)", fontWeight: "600" }}>
                {stats.abandonedCount} Abandoned {stats.abandonedCount === 1 ? "Checkout" : "Checkouts"} Tracked
              </h4>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                Automated 1-hour recovery emails are sent with 1-click restore links.
              </p>
            </div>
          </div>
          <Link 
            href="/admin/orders" 
            className={styles.btnPrimary} 
            style={{ padding: "6px 14px", fontSize: "0.82rem", textDecoration: "none" }}
          >
            View in Orders
          </Link>
        </div>
      )}


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
                      <Image src={product.images?.[0] || '/images/hero.png'} alt={product.name} className={styles.productImg} width={48} height={48} style={{ objectFit: 'cover' }} />
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
                      suppressHydrationWarning
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

"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Package, 
  ArrowUpRight, 
  MoreVertical, 
  Star, 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Sparkles, 
  CheckCircle2,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X
} from "lucide-react";
import styles from "@/styles/admin.module.css";
import { formatPrice } from "@/lib/utils";

export default function DashboardClient({ initialProducts = [], initialOrders = [], initialCustomOrders = [] }) {
  const [productsList, setProductsList] = useState(initialProducts || []);
  const [ordersList, setOrdersList] = useState(initialOrders || []);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState(null);
  const router = useRouter();

  // Excel-like Filter & Sort State for Recent Products
  const [activePopover, setActivePopover] = useState(null);
  const [columnFilters, setColumnFilters] = useState({
    category: [],
    availability: [],
  });
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Close menus on outside click or scroll
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.kebabMenu}`) && !e.target.closest(`.${styles.excelPopover}`) && !e.target.closest(`.${styles.excelFilterBtn}`) && !e.target.closest(`.${styles.kebabTriggerBtn}`)) {
        setOpenMenuId(null);
        setActivePopover(null);
      }
    };
    const handleScrollOrResize = () => {
      if (openMenuId) setOpenMenuId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [openMenuId]);

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

  const handleMenuClick = (id, e) => {
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const menuWidth = 175;
      const menuHeight = 210;
      
      let top = rect.bottom + 4;
      if (top + menuHeight > window.innerHeight && rect.top - menuHeight > 0) {
        top = rect.top - menuHeight - 4;
      }
      
      let left = rect.left;
      if (left + menuWidth > window.innerWidth - 10) {
        left = Math.max(10, window.innerWidth - menuWidth - 10);
      }

      setMenuPosition({ top, left });
      setOpenMenuId(id);
    }
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
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete product");
        setProductsList(prev => prev.filter(p => p.id !== productToDelete));
        setProductToDelete(null);
      } catch (err) {
        console.error(err);
        alert(`Error deleting product: ${err.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleStock = async (id) => {
    const product = productsList.find(p => p.id === id);
    if (!product) return;

    const currentlyInStock = product.stockCount > 0 && product.inStock;
    const newStockCount = currentlyInStock ? 0 : 10;
    const newInStock = newStockCount > 0;

    // Optimistic update
    setProductsList(prev => prev.map(p => p.id === id ? { ...p, stockCount: newStockCount, inStock: newInStock } : p));
    setOpenMenuId(null);
    setUpdatingStockId(id);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_count: newStockCount })
      });
      if (!res.ok) throw new Error("Failed to update stock");
    } catch (err) {
      console.error(err);
      alert("Error updating stock status: " + err.message);
      setProductsList(prev => prev.map(p => p.id === id ? product : p));
    } finally {
      setUpdatingStockId(null);
    }
  };

  const handleToggleFeature = async (id) => {
    const product = productsList.find(p => p.id === id);
    if (!product) return;
    const nextVal = !product.bestseller;

    setProductsList(prev => prev.map(p => p.id === id ? { ...p, bestseller: nextVal, featured: nextVal } : p));
    setOpenMenuId(null);

    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bestseller: nextVal })
      });
    } catch (e) {
      console.error('Failed to update featured state', e);
    }
  };

  const handleDuplicate = (id) => {
    const product = productsList.find(p => p.id === id);
    if (product) {
      const newProduct = { ...product, id: `temp-${Date.now()}`, name: product.name + " (Copy)" };
      setProductsList(prev => [newProduct, ...prev]);
    }
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    router.push(`/admin/products/new?edit=${id}`);
    setOpenMenuId(null);
  };

  // Distinct filter values
  const distinctCategories = useMemo(() => {
    return Array.from(new Set(productsList.map(p => p.categoryName || "Handmade"))).filter(Boolean);
  }, [productsList]);

  const toggleFilter = (column, value) => {
    setColumnFilters(prev => {
      const current = prev[column] || [];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [column]: updated };
    });
  };

  const handleSort = (key, direction) => {
    if (sortConfig.key === key && sortConfig.direction === direction) {
      setSortConfig({ key: 'createdAt', direction: 'desc' });
    } else {
      setSortConfig({ key, direction });
    }
  };

  const filteredRecentProducts = useMemo(() => {
    return productsList.filter(product => {
      if (columnFilters.category.length > 0) {
        const cat = product.categoryName || "Handmade";
        if (!columnFilters.category.includes(cat)) return false;
      }
      if (columnFilters.availability.length > 0) {
        const status = product.inStock && product.stockCount > 0 ? "In Stock" : "Out of Stock";
        if (!columnFilters.availability.includes(status)) return false;
      }
      return true;
    }).sort((a, b) => {
      if (!sortConfig.key) return 0;
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (sortConfig.key === 'createdAt') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (sortConfig.key === 'name') {
        valA = (valA || '').toLowerCase();
        valB = (valB || '').toLowerCase();
      } else if (sortConfig.key === 'price') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }).slice(0, 6);
  }, [productsList, columnFilters, sortConfig]);

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
              <ShoppingBag size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text)" }}>
                {stats.abandonedCount} Abandoned Checkout{stats.abandonedCount > 1 ? 's' : ''} Pending
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                Follow up with customers who didn&apos;t complete their purchase.
              </div>
            </div>
          </div>
          <Link href="/admin/orders?status=abandoned" className={styles.btnPrimary} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
            View in Orders
          </Link>
        </div>
      )}

      {/* Recent Products Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Recent Products</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {(columnFilters.category.length > 0 || columnFilters.availability.length > 0 || sortConfig.key !== 'createdAt') && (
            <button 
              type="button" 
              onClick={() => { setColumnFilters({ category: [], availability: [] }); setSortConfig({ key: 'createdAt', direction: 'desc' }); }}
              style={{ background: "none", border: "1px solid var(--color-border)", borderRadius: "6px", padding: "4px 8px", fontSize: "0.75rem", cursor: "pointer", color: "#666" }}
            >
              Reset Filters
            </button>
          )}
          <Link href="/admin/products" className={styles.viewAll}>
            View all <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className={styles.tableContainer} style={{ position: "relative" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              {/* Product Header with Sort Filter */}
              <th style={{ minWidth: "240px", position: "relative" }}>
                <div className={styles.filterHeaderCell} onClick={() => setActivePopover(activePopover === 'name' ? null : 'name')}>
                  <span>Product</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    {(sortConfig.key === 'name' || sortConfig.key === 'createdAt') && (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} color="var(--color-primary)" /> : <ArrowDown size={14} color="var(--color-primary)" />
                    )}
                    <button className={`${styles.excelFilterBtn} ${sortConfig.key === 'name' || sortConfig.key === 'createdAt' ? styles.activeFilter : ''}`} type="button">
                      <Filter size={13} />
                    </button>
                  </div>
                </div>

                {activePopover === 'name' && (
                  <div className={styles.excelPopover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.excelPopoverHeader}>
                      <span>Sort Product</span>
                      <X size={14} style={{ cursor: "pointer" }} onClick={() => setActivePopover(null)} />
                    </div>
                    <div className={styles.excelSortOptions}>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'createdAt' && sortConfig.direction === 'desc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('createdAt', 'desc')}
                      >
                        <Calendar size={13} /> Date: Newest First
                      </button>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'createdAt' && sortConfig.direction === 'asc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('createdAt', 'asc')}
                      >
                        <Calendar size={13} /> Date: Oldest First
                      </button>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'name' && sortConfig.direction === 'asc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('name', 'asc')}
                      >
                        <ArrowUp size={13} /> Name: A to Z
                      </button>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'name' && sortConfig.direction === 'desc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('name', 'desc')}
                      >
                        <ArrowDown size={13} /> Name: Z to A
                      </button>
                    </div>
                  </div>
                )}
              </th>

              {/* Collection Header */}
              <th style={{ minWidth: "140px", position: "relative" }}>
                <div className={styles.filterHeaderCell} onClick={() => setActivePopover(activePopover === 'category' ? null : 'category')}>
                  <span>Collection</span>
                  <button className={`${styles.excelFilterBtn} ${columnFilters.category.length > 0 ? styles.activeFilter : ''}`} type="button">
                    <Filter size={13} />
                  </button>
                </div>

                {activePopover === 'category' && (
                  <div className={styles.excelPopover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.excelPopoverHeader}>
                      <span>Filter Collection</span>
                      <X size={14} style={{ cursor: "pointer" }} onClick={() => setActivePopover(null)} />
                    </div>
                    <div className={styles.excelValuesList}>
                      {distinctCategories.map(cat => (
                        <label key={cat} className={styles.excelValueItem}>
                          <input 
                            type="checkbox" 
                            checked={columnFilters.category.includes(cat)} 
                            onChange={() => toggleFilter('category', cat)} 
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.excelPopoverFooter}>
                      <button className={styles.excelClearBtn} onClick={() => { setColumnFilters(prev => ({ ...prev, category: [] })); setActivePopover(null); }}>Clear</button>
                      <button className={styles.excelApplyBtn} onClick={() => setActivePopover(null)}>Done</button>
                    </div>
                  </div>
                )}
              </th>

              {/* Price Header */}
              <th style={{ minWidth: "120px", position: "relative" }}>
                <div className={styles.filterHeaderCell} onClick={() => setActivePopover(activePopover === 'price' ? null : 'price')}>
                  <span>Price</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    {sortConfig.key === 'price' && (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} color="var(--color-primary)" /> : <ArrowDown size={14} color="var(--color-primary)" />
                    )}
                    <button className={`${styles.excelFilterBtn} ${sortConfig.key === 'price' ? styles.activeFilter : ''}`} type="button">
                      <ArrowUpDown size={13} />
                    </button>
                  </div>
                </div>

                {activePopover === 'price' && (
                  <div className={styles.excelPopover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.excelPopoverHeader}>
                      <span>Sort Price</span>
                      <X size={14} style={{ cursor: "pointer" }} onClick={() => setActivePopover(null)} />
                    </div>
                    <div className={styles.excelSortOptions}>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'price' && sortConfig.direction === 'asc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('price', 'asc')}
                      >
                        <ArrowUp size={13} /> Lowest to Highest
                      </button>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'price' && sortConfig.direction === 'desc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('price', 'desc')}
                      >
                        <ArrowDown size={13} /> Highest to Lowest
                      </button>
                    </div>
                  </div>
                )}
              </th>

              {/* Status Header */}
              <th style={{ minWidth: "130px", position: "relative" }}>
                <div className={styles.filterHeaderCell} onClick={() => setActivePopover(activePopover === 'availability' ? null : 'availability')}>
                  <span>Status</span>
                  <button className={`${styles.excelFilterBtn} ${columnFilters.availability.length > 0 ? styles.activeFilter : ''}`} type="button">
                    <Filter size={13} />
                  </button>
                </div>

                {activePopover === 'availability' && (
                  <div className={styles.excelPopover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.excelPopoverHeader}>
                      <span>Filter Status</span>
                      <X size={14} style={{ cursor: "pointer" }} onClick={() => setActivePopover(null)} />
                    </div>
                    <div className={styles.excelValuesList}>
                      {["In Stock", "Out of Stock"].map(status => (
                        <label key={status} className={styles.excelValueItem}>
                          <input 
                            type="checkbox" 
                            checked={columnFilters.availability.includes(status)} 
                            onChange={() => toggleFilter('availability', status)} 
                          />
                          <span>{status}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.excelPopoverFooter}>
                      <button className={styles.excelClearBtn} onClick={() => { setColumnFilters(prev => ({ ...prev, availability: [] })); setActivePopover(null); }}>Clear</button>
                      <button className={styles.excelApplyBtn} onClick={() => setActivePopover(null)}>Done</button>
                    </div>
                  </div>
                )}
              </th>

              {/* Added / Date Header */}
              <th style={{ minWidth: "120px", position: "relative" }}>
                <div className={styles.filterHeaderCell} onClick={() => setActivePopover(activePopover === 'added' ? null : 'added')}>
                  <span>Added</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    {sortConfig.key === 'createdAt' && (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} color="var(--color-primary)" /> : <ArrowDown size={14} color="var(--color-primary)" />
                    )}
                    <button className={`${styles.excelFilterBtn} ${sortConfig.key === 'createdAt' ? styles.activeFilter : ''}`} type="button">
                      <ArrowUpDown size={13} />
                    </button>
                  </div>
                </div>

                {activePopover === 'added' && (
                  <div className={styles.excelPopover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.excelPopoverHeader}>
                      <span>Sort by Date</span>
                      <X size={14} style={{ cursor: "pointer" }} onClick={() => setActivePopover(null)} />
                    </div>
                    <div className={styles.excelSortOptions}>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'createdAt' && sortConfig.direction === 'desc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('createdAt', 'desc')}
                      >
                        <ArrowDown size={13} /> Newest to Oldest
                      </button>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'createdAt' && sortConfig.direction === 'asc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('createdAt', 'asc')}
                      >
                        <ArrowUp size={13} /> Oldest to Newest
                      </button>
                    </div>
                  </div>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRecentProducts.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>💅</div>
                  <h3 style={{ fontSize: "1.125rem", color: "var(--color-primary-800)", marginBottom: "var(--space-2)", fontFamily: "var(--font-heading)" }}>No products found</h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "var(--space-6)" }}>No products matched your filters.</p>
                  <button 
                    type="button"
                    onClick={() => { setColumnFilters({ category: [], availability: [] }); setSortConfig({ key: 'createdAt', direction: 'desc' }); }}
                    className={styles.btnPrimary} 
                    style={{ display: "inline-flex", margin: "0 auto" }}
                  >
                    Clear Filters
                  </button>
                </td>
              </tr>
            ) : (
              filteredRecentProducts.map((product, index, arr) => {
                const isCurrentlyInStock = product.stockCount > 0 && product.inStock;
                return (
                  <tr key={product.id}>
                    {/* Product cell */}
                    <td>
                      <div className={styles.productCell} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
                          <Image 
                            src={product.images?.[0] || '/images/hero.png'} 
                            alt={product.name} 
                            className={styles.productImg} 
                            width={44} 
                            height={44} 
                            style={{ objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} 
                          />
                          <span className={styles.productName} style={{ wordBreak: "break-word" }}>{product.name}</span>
                        </div>

                        {/* 3-dots Action button beside product name */}
                        <button 
                          className={styles.kebabTriggerBtn}
                          onClick={(e) => handleMenuClick(product.id, e)}
                          title="Product Actions"
                          style={{ 
                            background: openMenuId === product.id ? "rgba(0,0,0,0.06)" : "none", 
                            border: "1px solid var(--color-border-light)", 
                            borderRadius: "6px",
                            cursor: "pointer", 
                            color: "#666", 
                            padding: "4px 6px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>

                    <td>{product.categoryName || "Handmade"}</td>
                    <td style={{ fontWeight: 500 }}>{formatPrice(product.price)}</td>
                    <td>
                      <span 
                        className={`${styles.badge} ${isCurrentlyInStock ? styles.inStock : styles.outOfStock}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleToggleStock(product.id)}
                        title="Click to toggle stock"
                      >
                        {updatingStockId === product.id ? "Updating..." : (isCurrentlyInStock ? "In Stock" : "Out of Stock")}
                      </span>
                    </td>
                    <td style={{ color: "#666", fontSize: "0.82rem" }}>
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "Recent"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Kebab Action Menu (Rendered outside table container so it escapes overflow clipping) */}
      {openMenuId && (() => {
        const activeProduct = productsList.find(p => p.id === openMenuId);
        if (!activeProduct) return null;
        const isCurrentlyInStock = activeProduct.stockCount > 0 && activeProduct.inStock;

        return (
          <div 
            className={styles.kebabMenu}
            style={{
              position: "fixed",
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              zIndex: 99999,
              minWidth: "175px",
              background: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
              border: "1px solid var(--color-border)"
            }}
          >
            <button 
              className={styles.kebabItem} 
              onClick={() => handleToggleStock(activeProduct.id)}
              style={{ 
                fontWeight: 600,
                color: isCurrentlyInStock ? "#DC2626" : "#16A34A",
                borderBottom: "1px solid var(--color-border-light)"
              }}
            >
              {isCurrentlyInStock ? "Mark Out of Stock" : "Mark In Stock"}
            </button>
            <button className={styles.kebabItem} onClick={() => handleEdit(activeProduct.id)}>Edit Details</button>
            <button className={styles.kebabItem} onClick={() => handleDuplicate(activeProduct.id)}>Duplicate</button>
            <button className={styles.kebabItem} onClick={() => handleToggleFeature(activeProduct.id)}>
              {activeProduct.bestseller ? "Unmark Featured" : "Mark Featured"}
            </button>
            <button className={`${styles.kebabItem} ${styles.kebabDelete}`} onClick={() => handleDeleteClick(activeProduct.id)}>Delete Product</button>
          </div>
        );
      })()}

      {productToDelete && (
        <div className={styles.modalOverlay} onClick={() => setProductToDelete(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Product</h3>
            <p className={styles.modalText}>Are you sure you want to delete this product? Any associated review or cart references will be cleaned up safely.</p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtnCancel} onClick={() => setProductToDelete(null)} disabled={isDeleting}>Cancel</button>
              <button className={styles.modalBtnDelete} onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

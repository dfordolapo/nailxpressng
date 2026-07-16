"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, Filter, MoreVertical, Star, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/styles/admin.module.css";
import { formatPrice } from "@/lib/utils";
// Using Supabase Live Data

function ProductsContent({ initialProducts }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const collection = searchParams.get("collection");
  const activeTab = collection === "handmade" ? "Handmade" : collection === "factory" ? "Factory Made" : "All";
  
  const [productsList, setProductsList] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDuplicate = (id) => {
    const product = productsList.find(p => p.id === id);
    if (product) {
      const newProduct = { ...product, id: Date.now(), name: product.name + " (Copy)" };
      setProductsList(prev => [newProduct, ...prev]);
    }
    setOpenMenuId(null);
  };

  const handleToggleFeature = (id) => {
    setProductsList(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    router.push(`/admin/products/new?edit=${id}`);
    setOpenMenuId(null);
  };
  
  const filteredProducts = productsList.filter(product => {
    // Tab Filter
    if (activeTab !== "All" && product.categoryName !== activeTab) return false;
    
    // Search Filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Status/Featured Filter
    if (statusFilter === "In Stock" && !product.inStock) return false;
    if (statusFilter === "Out of Stock" && product.inStock) return false;
    if (statusFilter === "Featured" && !product.bestseller) return false;
    
    return true;
  });

  const handleTabClick = (tab, query) => {
    setCurrentPage(1);
    router.push(`/admin/products${query ? `?collection=${query}` : ''}`);
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.pageSubtitle}>Manage all your products in one place.</p>
        </div>
        <Link href="/admin/products/new" className={styles.btnPrimary}>
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === "All" ? styles.active : ""}`}
            onClick={() => handleTabClick("All", null)}
          >
            All
          </button>
          <button 
            className={`${styles.tab} ${activeTab === "Handmade" ? styles.active : ""}`}
            onClick={() => handleTabClick("Handmade", "handmade")}
          >
            Handmade
          </button>
          <button 
            className={`${styles.tab} ${activeTab === "Factory Made" ? styles.active : ""}`}
            onClick={() => handleTabClick("Factory Made", "factory")}
          >
            Factory Made
          </button>
        </div>
        
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={16} color="#888" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className={styles.searchInput} 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <button 
              className={styles.filterBtn}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ borderColor: statusFilter !== "All" ? "var(--color-primary)" : "var(--color-border)" }}
            >
              <Filter size={16} color={statusFilter !== "All" ? "var(--color-primary)" : "#555"} />
              Filter {statusFilter !== "All" && `(${statusFilter})`}
            </button>
            
            {isFilterOpen && (
              <div style={{ 
                position: "absolute", 
                top: "100%", 
                right: 0, 
                marginTop: "10px", 
                background: "white", 
                border: "1px solid var(--color-border)", 
                borderRadius: "12px", 
                padding: "15px", 
                width: "200px", 
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                zIndex: 10 
              }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "10px" }}>Filter By</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", cursor: "pointer" }}>
                    <input type="radio" name="status" checked={statusFilter === "All"} onChange={() => { setStatusFilter("All"); setCurrentPage(1); }} /> All
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", cursor: "pointer" }}>
                    <input type="radio" name="status" checked={statusFilter === "In Stock"} onChange={() => { setStatusFilter("In Stock"); setCurrentPage(1); }} /> In Stock
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", cursor: "pointer" }}>
                    <input type="radio" name="status" checked={statusFilter === "Out of Stock"} onChange={() => { setStatusFilter("Out of Stock"); setCurrentPage(1); }} /> Out of Stock
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", cursor: "pointer" }}>
                    <input type="radio" name="status" checked={statusFilter === "Featured"} onChange={() => { setStatusFilter("Featured"); setCurrentPage(1); }} /> Featured
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Collection</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Availability</th>
              <th>Featured</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.productCell}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.images?.[0] || '/images/hero.png'} alt={product.name} className={styles.productImg} />
                    <span className={styles.productName}>{product.name}</span>
                  </div>
                </td>
                <td style={{ color: "#555" }}>{product.categoryName}</td>
                <td style={{ fontWeight: 500 }}>{formatPrice(product.price)}</td>
                <td style={{ color: "#555" }}>{product.stockCount}</td>
                <td>
                  <span className={`${styles.badge} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td>
                  <Star 
                    size={20} 
                    color={product.bestseller ? "#F59E0B" : "#D1D5DB"} 
                    fill={product.bestseller ? "#F59E0B" : "none"} 
                  />
                </td>
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
                      style={filteredProducts.length > 2 && index >= filteredProducts.length - 2 ? { top: "auto", bottom: "30px" } : {}}
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
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>🔍</div>
                  <h3 style={{ fontSize: "1.125rem", color: "var(--color-primary-800)", marginBottom: "var(--space-2)", fontFamily: "var(--font-heading)" }}>No products matched</h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "var(--space-6)" }}>We couldn&apos;t find any products matching your search or filter.</p>
                  <button 
                    onClick={() => { setSearchQuery(""); setStatusFilter("All"); }} 
                    className={styles.btnPrimary} 
                    style={{ display: "inline-flex", margin: "0 auto" }}
                  >
                    Clear Filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", color: "#666", fontSize: "0.9rem" }}>
        <span>Showing {filteredProducts.length > 0 ? "1" : "0"} to {filteredProducts.length} of {activeTab === "All" ? 128 : filteredProducts.length} products</span>
        <div style={{ display: "flex", gap: "5px" }}>
          <button 
            style={{ padding: "5px 10px", border: "1px solid #EEE", background: "white", borderRadius: "6px", cursor: currentPage > 1 ? "pointer" : "not-allowed", opacity: currentPage > 1 ? 1 : 0.5 }}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          ><ChevronLeft size={16}/></button>
          
          <button 
            style={{ padding: "5px 12px", border: currentPage === 1 ? "1px solid var(--color-bg-warm)" : "1px solid #EEE", background: currentPage === 1 ? "var(--color-bg-warm)" : "white", color: currentPage === 1 ? "var(--color-primary)" : "#333", borderRadius: "6px", fontWeight: currentPage === 1 ? "bold" : "normal", cursor: "pointer" }}
            onClick={() => setCurrentPage(1)}
          >1</button>
          <button 
            style={{ padding: "5px 12px", border: currentPage === 2 ? "1px solid var(--color-bg-warm)" : "1px solid #EEE", background: currentPage === 2 ? "var(--color-bg-warm)" : "white", color: currentPage === 2 ? "var(--color-primary)" : "#333", borderRadius: "6px", fontWeight: currentPage === 2 ? "bold" : "normal", cursor: "pointer" }}
            onClick={() => setCurrentPage(2)}
          >2</button>
          <button 
            style={{ padding: "5px 12px", border: currentPage === 3 ? "1px solid var(--color-bg-warm)" : "1px solid #EEE", background: currentPage === 3 ? "var(--color-bg-warm)" : "white", color: currentPage === 3 ? "var(--color-primary)" : "#333", borderRadius: "6px", fontWeight: currentPage === 3 ? "bold" : "normal", cursor: "pointer" }}
            onClick={() => setCurrentPage(3)}
          >3</button>
          
          <span style={{ padding: "5px" }}>...</span>
          
          <button 
            style={{ padding: "5px 12px", border: currentPage === 21 ? "1px solid var(--color-bg-warm)" : "1px solid #EEE", background: currentPage === 21 ? "var(--color-bg-warm)" : "white", color: currentPage === 21 ? "var(--color-primary)" : "#333", borderRadius: "6px", fontWeight: currentPage === 21 ? "bold" : "normal", cursor: "pointer" }}
            onClick={() => setCurrentPage(21)}
          >21</button>
          
          <button 
            style={{ padding: "5px 10px", border: "1px solid #EEE", background: "white", borderRadius: "6px", cursor: currentPage < 21 ? "pointer" : "not-allowed", opacity: currentPage < 21 ? 1 : 0.5 }}
            onClick={() => setCurrentPage(p => Math.min(21, p + 1))}
            disabled={currentPage === 21}
          ><ChevronRight size={16}/></button>
        </div>
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

export default function ProductsClient({ initialProducts }) {
  return (
    <Suspense fallback={<div className={styles.tableContainer}>Loading...</div>}>
      <ProductsContent initialProducts={initialProducts} />
    </Suspense>
  );
}

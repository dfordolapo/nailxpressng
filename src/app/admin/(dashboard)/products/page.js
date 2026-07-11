"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, Filter, MoreVertical, Star, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/styles/admin.module.css";

const DUMMY_PRODUCTS = [
  { id: 1, name: "Blush Bloom", collection: "Handmade", price: 12500, stock: 24, status: "In Stock", featured: true, image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=80" },
  { id: 2, name: "Red Romance", collection: "Factory Made", price: 8000, stock: 15, status: "In Stock", featured: true, image: "https://images.unsplash.com/photo-1522337360788-8b13fee7a371?auto=format&fit=crop&q=80&w=80" },
  { id: 3, name: "Gold Luxe", collection: "Handmade", price: 15000, stock: 0, status: "Out of Stock", featured: true, image: "https://images.unsplash.com/photo-1595868228308-0118fb01b315?auto=format&fit=crop&q=80&w=80" },
  { id: 4, name: "Soft Pink", collection: "Factory Made", price: 6500, stock: 40, status: "In Stock", featured: false, image: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80&w=80" },
  { id: 5, name: "Purple Haze", collection: "Factory Made", price: 7500, stock: 12, status: "In Stock", featured: false, image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=80" },
  { id: 6, name: "Pearl Shine", collection: "Handmade", price: 14000, stock: 5, status: "In Stock", featured: true, image: "https://images.unsplash.com/photo-1522337360788-8b13fee7a371?auto=format&fit=crop&q=80&w=80" },
];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const collection = searchParams.get("collection");
  const activeTab = collection === "handmade" ? "Handmade" : collection === "factory" ? "Factory Made" : "All";
  
  const [productsList, setProductsList] = useState(DUMMY_PRODUCTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleMenuClick = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProductsList(prev => prev.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
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
    if (activeTab !== "All" && product.collection !== activeTab) return false;
    
    // Search Filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Status/Featured Filter
    if (statusFilter === "In Stock" && product.status !== "In Stock") return false;
    if (statusFilter === "Out of Stock" && product.status !== "Out of Stock") return false;
    if (statusFilter === "Featured" && !product.featured) return false;
    
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
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.productCell}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt={product.name} className={styles.productImg} />
                    <span className={styles.productName}>{product.name}</span>
                  </div>
                </td>
                <td style={{ color: "#555" }}>{product.collection}</td>
                <td style={{ fontWeight: 500 }}>₦{product.price.toLocaleString()}</td>
                <td style={{ color: "#555" }}>{product.stock}</td>
                <td>
                  <span className={`${styles.badge} ${product.status === "In Stock" ? styles.inStock : styles.outOfStock}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <Star 
                    size={20} 
                    color={product.featured ? "#F59E0B" : "#D1D5DB"} 
                    fill={product.featured ? "#F59E0B" : "none"} 
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
                    <div className={styles.kebabMenu}>
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
                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>No products found.</td>
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
            style={{ padding: "5px 12px", border: currentPage === 1 ? "1px solid var(--color-primary)" : "1px solid #EEE", background: currentPage === 1 ? "var(--color-primary-100)" : "white", color: currentPage === 1 ? "var(--color-primary)" : "#333", borderRadius: "6px", fontWeight: currentPage === 1 ? "bold" : "normal", cursor: "pointer" }}
            onClick={() => setCurrentPage(1)}
          >1</button>
          <button 
            style={{ padding: "5px 12px", border: currentPage === 2 ? "1px solid var(--color-primary)" : "1px solid #EEE", background: currentPage === 2 ? "var(--color-primary-100)" : "white", color: currentPage === 2 ? "var(--color-primary)" : "#333", borderRadius: "6px", fontWeight: currentPage === 2 ? "bold" : "normal", cursor: "pointer" }}
            onClick={() => setCurrentPage(2)}
          >2</button>
          <button 
            style={{ padding: "5px 12px", border: currentPage === 3 ? "1px solid var(--color-primary)" : "1px solid #EEE", background: currentPage === 3 ? "var(--color-primary-100)" : "white", color: currentPage === 3 ? "var(--color-primary)" : "#333", borderRadius: "6px", fontWeight: currentPage === 3 ? "bold" : "normal", cursor: "pointer" }}
            onClick={() => setCurrentPage(3)}
          >3</button>
          
          <span style={{ padding: "5px" }}>...</span>
          
          <button 
            style={{ padding: "5px 12px", border: currentPage === 21 ? "1px solid var(--color-primary)" : "1px solid #EEE", background: currentPage === 21 ? "var(--color-primary-100)" : "white", color: currentPage === 21 ? "var(--color-primary)" : "#333", borderRadius: "6px", fontWeight: currentPage === 21 ? "bold" : "normal", cursor: "pointer" }}
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

export default function AdminProducts() {
  return (
    <Suspense fallback={<div className={styles.tableContainer}>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

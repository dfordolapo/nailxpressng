"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, UploadCloud, X, Heart } from "lucide-react";
import styles from "@/styles/admin.module.css";
import { useState } from "react";

export default function NewProduct() {
  const [activeTab, setActiveTab] = useState("basic");
  
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div style={{ display: "flex", gap: "15px" }}>
          <Link href="/admin/products" style={{ color: "#666", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className={styles.pageTitle} style={{ fontSize: "1.5rem" }}>Add New Product</h1>
            <p className={styles.pageSubtitle}>Create a new product for your store.</p>
          </div>
        </div>
      </div>

      <div className={styles.formContainer}>
        {/* Form Sidebar */}
        <div className={styles.formSidebar}>
          <button className={`${styles.formNavBtn} ${activeTab === "basic" ? styles.active : ""}`} onClick={() => setActiveTab("basic")}>
            <Sparkles size={16} />
            Basic Information
          </button>
          <button className={`${styles.formNavBtn} ${activeTab === "images" ? styles.active : ""}`} onClick={() => setActiveTab("images")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Images
          </button>
          <button className={`${styles.formNavBtn} ${activeTab === "details" ? styles.active : ""}`} onClick={() => setActiveTab("details")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Details
          </button>
          <button className={`${styles.formNavBtn} ${activeTab === "pricing" ? styles.active : ""}`} onClick={() => setActiveTab("pricing")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Pricing & Status
          </button>
        </div>

        {/* Main Form Area */}
        <div className={styles.formMain}>
          {activeTab === "basic" && (
            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>Basic Information</h2>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Product Name</label>
                <input type="text" className={styles.input} placeholder="e.g. Blush Bloom" />
              </div>

              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Collection</label>
                  <select className={styles.select}>
                    <option>Select collection</option>
                    <option>Handmade</option>
                    <option>Factory Made</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select className={styles.select}>
                    <option>Select category</option>
                    <option>Floral</option>
                    <option>Minimalist</option>
                  </select>
                  <Link href="/admin/settings/attributes" style={{ fontSize: "0.8rem", color: "var(--color-primary)", marginTop: "8px", display: "inline-block", textDecoration: "underline" }}>Manage Categories</Link>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} placeholder="Write a one liner about this product."></textarea>
                <div className={styles.charCount}>0/300</div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnSecondary} onClick={() => window.history.back()}>Cancel</button>
                <button className={styles.btnPrimary} onClick={() => setActiveTab("images")}>Next</button>
              </div>
            </div>
          )}

          {activeTab === "images" && (
            <div className={styles.formSection}>
               <h2 className={styles.formSectionTitle}>Product Images</h2>
               <p style={{color: "#666", fontSize: "0.9rem", marginBottom: "20px"}}>Upload high quality images of your product.</p>
               
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <div style={{ border: "2px dashed var(--color-border)", borderRadius: "12px", height: "150px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "var(--color-bg)", cursor: "pointer", marginBottom: "20px" }}>
                      <UploadCloud size={30} color="#888" style={{ marginBottom: "10px" }} />
                      <div style={{ fontSize: "0.9rem", color: "#333", fontWeight: 500 }}>Upload Image</div>
                      <div style={{ fontSize: "0.75rem", color: "#888" }}>PNG, JPG (Max 5MB)</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                       {/* Mock Image Previews */}
                       <div style={{ position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", backgroundColor: "#EEE" }}>
                         <button style={{ position: "absolute", top: "5px", right: "5px", background: "white", borderRadius: "50%", padding: "2px", border: "none", cursor: "pointer", width: "20px", height: "20px", display: "flex", alignItems: "center", justify: "center" }}><X size={12}/></button>
                         <img src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=200" alt="Preview" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                       </div>
                       <div style={{ position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", backgroundColor: "#EEE" }}>
                         <button style={{ position: "absolute", top: "5px", right: "5px", background: "white", borderRadius: "50%", padding: "2px", border: "none", cursor: "pointer", width: "20px", height: "20px", display: "flex", alignItems: "center", justify: "center" }}><X size={12}/></button>
                         <img src="https://images.unsplash.com/photo-1522337360788-8b13fee7a371?auto=format&fit=crop&q=80&w=200" alt="Preview" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                       </div>
                    </div>
                  </div>
                  
                  {/* Fake Storefront Preview */}
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "10px" }}>Preview (As Customer Sees)</div>
                    <div style={{ border: "1px solid #EEE", borderRadius: "16px", padding: "15px", backgroundColor: "white", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                       <div style={{ aspectRatio: "3/4", borderRadius: "12px", backgroundColor: "var(--color-bg)", marginBottom: "15px", overflow: "hidden", position: "relative" }}>
                          <img src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=300" alt="Preview" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                       </div>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                         <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Blush Bloom</div>
                         <Heart size={16} color="#888" />
                       </div>
                       <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "15px", lineHeight: "1.4" }}>
                         Handmade press-on nails with soft pink base and 3D floral accents...
                       </div>
                       <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "15px" }}>₦12,500</div>
                       <button style={{ width: "100%", backgroundColor: "var(--color-primary)", color: "white", padding: "10px", borderRadius: "8px", border: "none", fontWeight: 500 }}>Add to Cart</button>
                    </div>
                  </div>
               </div>

               <div className={styles.formActions}>
                 <button className={styles.btnSecondary} onClick={() => setActiveTab("basic")}>Back</button>
                 <button className={styles.btnPrimary} style={{ backgroundColor: "var(--color-primary)" }}>Save Changes</button>
               </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>Details</h2>
              
              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nail Shape</label>
                  <select className={styles.select}>
                    <option>Select shape</option>
                    <option>Almond</option>
                    <option>Coffin</option>
                    <option>Square</option>
                  </select>
                  <Link href="/admin/settings/attributes" style={{ fontSize: "0.8rem", color: "var(--color-primary)", marginTop: "8px", display: "inline-block", textDecoration: "underline" }}>Manage Shapes</Link>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Length</label>
                  <select className={styles.select}>
                    <option>Select length</option>
                    <option>Short</option>
                    <option>Medium</option>
                    <option>Long</option>
                  </select>
                  <Link href="/admin/settings/attributes" style={{ fontSize: "0.8rem", color: "var(--color-primary)", marginTop: "8px", display: "inline-block", textDecoration: "underline" }}>Manage Lengths</Link>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Style & Finish</label>
                <select className={styles.select}>
                  <option>Select style</option>
                  <option>Glossy</option>
                  <option>Matte</option>
                  <option>3D Art</option>
                </select>
                <Link href="/admin/settings/attributes" style={{ fontSize: "0.8rem", color: "var(--color-primary)", marginTop: "8px", display: "inline-block", textDecoration: "underline" }}>Manage Styles</Link>
              </div>

              <div className={styles.formActions}>
                 <button className={styles.btnSecondary} onClick={() => setActiveTab("images")}>Back</button>
                 <button className={styles.btnPrimary} onClick={() => setActiveTab("pricing")}>Next</button>
               </div>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>Pricing & Status</h2>
              
              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Price</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: "15px", color: "#666", fontWeight: 500 }}>₦</span>
                    <input type="number" className={styles.input} placeholder="0.00" style={{ paddingLeft: "35px" }} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Inventory</label>
                  <input type="number" className={styles.input} placeholder="Quantity in stock" />
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Status</label>
                  <select className={styles.select}>
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Featured Product</label>
                  <div style={{ display: "flex", alignItems: "center", height: "46px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input type="checkbox" style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)" }} />
                      <span style={{ fontSize: "0.95rem", color: "#333" }}>Show on homepage</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                 <button className={styles.btnSecondary} onClick={() => setActiveTab("details")}>Back</button>
                 <button className={styles.btnPrimary}>Save Product</button>
               </div>
            </div>
          )}
        </div>

        {/* Tips Sidebar */}
        <div className={styles.tipsSidebar}>
          <div className={styles.tipsTitle}>
            <Sparkles size={18} color="var(--color-accent)" />
            Tips
          </div>
          <ul className={styles.tipsList}>
            <li>Use a clear, descriptive product name</li>
            <li>High quality images sell more</li>
            <li>Add details about shape, length and finish</li>
            <li>Set the right price for your market</li>
          </ul>
          
          <div style={{ marginTop: "40px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#555", fontWeight: 500 }}>
             <Sparkles size={16} color="var(--color-accent)" />
             You're doing amazing Queen. 💅
          </div>
        </div>
      </div>
    </>
  );
}

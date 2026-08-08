"use client";

import Link from "next/link";
import { ArrowLeft, UploadCloud, X, Heart } from "lucide-react";
import styles from "@/styles/admin.module.css";
import { nailShapes, nailLengths, styles as nailStyles, categories as nailCategories } from "@/data/categories";
import HandmadeProductCard from "@/components/product/HandmadeProductCard";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NewProduct() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("basic");
  
  // Form State
  const [name, setName] = useState("");
  const [collection, setCollection] = useState("Handmade");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState("");
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [nailShape, setNailShape] = useState("Square");
  const [nailLength, setNailLength] = useState("Medium");
  const [nailStyle, setNailStyle] = useState("Solid");
  
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [availability, setAvailability] = useState("In Stock");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddTag = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleStockChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setStockQuantity("");
      return;
    }
    const num = parseInt(val, 10);
    if (num >= 0) {
      setStockQuantity(num);
      if (num === 0) {
        setAvailability("Out of Stock");
      } else if (num > 0 && stockQuantity === 0) {
        setAvailability("In Stock");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert("Name and Price are required.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      const normalPrice = parseFloat(price) || 0;
      const sale = salePrice ? parseFloat(salePrice) : null;
      const onSale = sale !== null && sale > 0 && sale < normalPrice;
      formData.append('price', onSale ? sale : normalPrice);
      if (onSale) formData.append('compareAtPrice', normalPrice);
      formData.append('category', collection); // Map collection to category
      formData.append('stockCount', stockQuantity || '0');
      formData.append('featured', isBestseller); // Or isFeatured depending on preference
      formData.append('tags', tags.join(','));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to create product");
      
      alert("Product created successfully!");
      router.push('/admin/products');
      
    } catch (err) {
      console.error(err);
      alert("Error creating product: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
          <button type="button" className={`${styles.formNavBtn} ${activeTab === "basic" ? styles.active : ""}`} onClick={() => setActiveTab("basic")}>
            Basic Information
          </button>
          <button type="button" className={`${styles.formNavBtn} ${activeTab === "images" ? styles.active : ""}`} onClick={() => setActiveTab("images")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Images
          </button>
          <button type="button" className={`${styles.formNavBtn} ${activeTab === "details" ? styles.active : ""}`} onClick={() => setActiveTab("details")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Details
          </button>
          <button type="button" className={`${styles.formNavBtn} ${activeTab === "pricing" ? styles.active : ""}`} onClick={() => setActiveTab("pricing")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Pricing & Status
          </button>
        </div>

        {/* Main Form Area */}
        <div className={styles.formMain}>
          <form onSubmit={handleSubmit}>
          {activeTab === "basic" && (
            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>Basic Information</h2>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Product Name</label>
                <input type="text" className={styles.input} placeholder="e.g. Blush Bloom" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Collection</label>
                  <select className={styles.select} value={collection} onChange={e => setCollection(e.target.value)}>
                    {nailCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category / Tags</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                    {tags.map(tag => (
                      <span key={tag} style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-800)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-primary-800)', padding: 0 }}>&times;</button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder={tags.length === 0 ? "Type & press Enter..." : ""}
                      style={{ border: 'none', outline: 'none', flex: 1, minWidth: '150px', fontSize: '0.9rem', background: 'transparent' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#666', marginRight: '4px' }}>Suggested:</span>
                    {nailStyles.filter(s => !tags.includes(s.name)).slice(0, 8).map(s => (
                      <button key={s.id} type="button" onClick={() => setTags([...tags, s.name])} style={{ background: '#f4f4f4', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>
                        + {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} placeholder="Write a one liner about this product." value={description} onChange={e => setDescription(e.target.value)}></textarea>
                <div className={styles.charCount}>{description.length}/300</div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => window.history.back()}>Cancel</button>
                <button type="button" className={styles.btnPrimary} onClick={() => setActiveTab("images")}>Next</button>
              </div>
            </div>
          )}

          {activeTab === "images" && (
            <div className={styles.formSection}>
               <h2 className={styles.formSectionTitle}>Product Images</h2>
               <p style={{color: "#666", fontSize: "0.9rem", marginBottom: "20px"}}>Upload high quality images of your product.</p>
               
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{ border: "2px dashed var(--color-border)", borderRadius: "12px", height: "150px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "var(--color-bg)", cursor: "pointer", marginBottom: "20px" }}
                    >
                      <UploadCloud size={30} color="#888" style={{ marginBottom: "10px" }} />
                      <div style={{ fontSize: "0.9rem", color: "#333", fontWeight: 500 }}>Upload Image</div>
                      <div style={{ fontSize: "0.75rem", color: "#888" }}>PNG, JPG (Max 5MB)</div>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                       {imagePreview && (
                         <div style={{ position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", backgroundColor: "#EEE" }}>
                           <button type="button" onClick={removeImage} style={{ position: "absolute", top: "5px", right: "5px", background: "white", borderRadius: "50%", padding: "2px", border: "none", cursor: "pointer", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={12}/></button>
                           <img src={imagePreview} alt="Preview" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                         </div>
                       )}
                    </div>
                  </div>
                  
                  {/* Real Component Preview */}
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "10px" }}>Preview (As Customer Sees)</div>
                    <div style={{ pointerEvents: "auto", width: "100%", maxWidth: "300px" }}>
                      <HandmadeProductCard 
                        product={{
                          id: "preview",
                          name: name || "Product Name",
                          price: parseFloat(salePrice || price || "0"),
                          category: collection.toLowerCase().replace(' ', '-'),
                          image: imagePreview || "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=300",
                          shortDescription: description || "Product description goes here.",
                          sizes: ["XS", "S", "M", "L"],
                          lengths: ["Short", "Medium", "Long"],
                          bestseller: isBestseller,
                          newArrival: true
                        }} 
                        viewMode="grid" 
                      />
                    </div>
                  </div>
               </div>

               <div className={styles.formActions}>
                 <button type="button" className={styles.btnSecondary} onClick={() => setActiveTab("basic")}>Back</button>
                 <button type="button" className={styles.btnPrimary} onClick={() => setActiveTab("details")}>Next</button>
               </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>Details</h2>
              
              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nail Shape</label>
                  <select className={styles.select} value={nailShape} onChange={e => setNailShape(e.target.value)}>
                    {nailShapes.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                  <Link href="/admin/settings/attributes" style={{ fontSize: "0.8rem", color: "var(--color-primary)", marginTop: "8px", display: "inline-block", textDecoration: "underline" }}>Manage Shapes</Link>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Length</label>
                  <select className={styles.select} value={nailLength} onChange={e => setNailLength(e.target.value)}>
                    {nailLengths.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                  </select>
                  <Link href="/admin/settings/attributes" style={{ fontSize: "0.8rem", color: "var(--color-primary)", marginTop: "8px", display: "inline-block", textDecoration: "underline" }}>Manage Lengths</Link>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Style & Finish</label>
                <select className={styles.select} value={nailStyle} onChange={e => setNailStyle(e.target.value)}>
                  {nailStyles.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                <Link href="/admin/settings/attributes" style={{ fontSize: "0.8rem", color: "var(--color-primary)", marginTop: "8px", display: "inline-block", textDecoration: "underline" }}>Manage Styles</Link>
              </div>

              <div className={styles.formActions}>
                 <button type="button" className={styles.btnSecondary} onClick={() => setActiveTab("images")}>Back</button>
                 <button type="button" className={styles.btnPrimary} onClick={() => setActiveTab("pricing")}>Next</button>
               </div>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>Pricing & Status</h2>
              
              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Price (Normal Price)</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: "15px", color: "#666", fontWeight: 500 }}>₦</span>
                    <input type="number" className={styles.input} placeholder="0.00" style={{ paddingLeft: "35px" }} value={price} onChange={e => setPrice(e.target.value)} required />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Sale / Discounted Price</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: "15px", color: "#666", fontWeight: 500 }}>₦</span>
                    <input type="number" className={styles.input} placeholder="0.00" style={{ paddingLeft: "35px" }} value={salePrice} onChange={e => setSalePrice(e.target.value)} />
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "6px" }}>Enter a lower price to show a "-% OFF" badge. Leave blank if the product is not on sale.</div>
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Inventory</label>
                  <input 
                    type="number" 
                    className={styles.input} 
                    placeholder="Quantity in stock" 
                    min="0"
                    value={stockQuantity}
                    onChange={handleStockChange}
                  />
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Availability</label>
                  <select 
                    className={styles.select}
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Product Tags & Visibility</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)" }} 
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                      />
                      <span style={{ fontSize: "0.95rem", color: "#333" }}>Featured (Show on homepage)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)" }} 
                        checked={isBestseller}
                        onChange={(e) => setIsBestseller(e.target.checked)}
                      />
                      <span style={{ fontSize: "0.95rem", color: "#333" }}>Bestseller (Add bestseller badge)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                 <button type="button" className={styles.btnSecondary} onClick={() => setActiveTab("details")}>Back</button>
                 <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                   {isSubmitting ? "Saving..." : "Save Product"}
                 </button>
               </div>
            </div>
          )}
          </form>
        </div>

        {/* Tips Sidebar */}
        <div className={styles.tipsSidebar}>
          <div className={styles.tipsTitle}>
            Tips
          </div>
          <ul className={styles.tipsList}>
            <li>Use a clear, descriptive product name</li>
            <li>High quality images sell more</li>
            <li>Add details about shape, length and finish</li>
            <li>Set the right price for your market</li>
          </ul>
          
          <div style={{ marginTop: "40px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#555", fontWeight: 500 }}>
             You're doing amazing Queen. 💅
          </div>
        </div>
      </div>
    </>
  );
}

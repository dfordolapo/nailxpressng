"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Tag, Shapes, Ruler } from "lucide-react";
import styles from "@/styles/admin.module.css";

const INITIAL_ATTRIBUTES = {
  categories: ["Floral", "Minimalist", "Bling", "Abstract", "Ombre"],
  shapes: ["Almond", "Coffin", "Square", "Stiletto", "Oval"],
  lengths: ["Short", "Medium", "Long", "Extra Long"],
  styles: ["Glossy", "Matte", "Chrome", "3D Art"]
};

export default function AdminAttributes() {
  const [activeTab, setActiveTab] = useState("categories");
  const [attributes, setAttributes] = useState(INITIAL_ATTRIBUTES);
  const [newValue, setNewValue] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newValue.trim()) return;
    
    setAttributes(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newValue.trim()]
    }));
    setNewValue("");
  };

  const handleDelete = (indexToDelete) => {
    setAttributes(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((_, i) => i !== indexToDelete)
    }));
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Store Attributes</h1>
          <p className={styles.pageSubtitle}>Manage options for your product details.</p>
        </div>
      </div>

      <div className={styles.settingsLayout}>
        
        {/* Sidebar Nav */}
        <div className={styles.settingsNav}>
          <div 
            className={`${styles.settingsNavItem} ${activeTab === "categories" ? styles.active : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <Tag size={16} /> Categories
          </div>
          <div 
            className={`${styles.settingsNavItem} ${activeTab === "shapes" ? styles.active : ""}`}
            onClick={() => setActiveTab("shapes")}
          >
            <Shapes size={16} /> Nail Shapes
          </div>
          <div 
            className={`${styles.settingsNavItem} ${activeTab === "lengths" ? styles.active : ""}`}
            onClick={() => setActiveTab("lengths")}
          >
            <Ruler size={16} /> Lengths
          </div>
          <div 
            className={`${styles.settingsNavItem} ${activeTab === "styles" ? styles.active : ""}`}
            onClick={() => setActiveTab("styles")}
          >
            Styles & Finishes
          </div>
        </div>

        {/* Content Area */}
        <div>
          <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "12px", padding: "24px" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "20px", textTransform: "capitalize", color: "var(--color-text)" }}>Manage {activeTab}</h2>
            
            <form onSubmit={handleAdd} style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
              <input 
                type="text" 
                placeholder={`Add new ${activeTab === 'categories' ? 'category' : activeTab.slice(0, -1)}...`}
                className={styles.input}
                style={{ flex: 1 }}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
              <button type="submit" className={styles.btnPrimary} disabled={!newValue.trim()}>
                <Plus size={16} /> Add
              </button>
            </form>

            <div style={{ border: "1px solid var(--color-border)", borderRadius: "8px", overflow: "hidden" }}>
              {attributes[activeTab].map((item, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", borderBottom: index !== attributes[activeTab].length - 1 ? "1px solid var(--color-border)" : "none", background: index % 2 === 0 ? "white" : "var(--color-bg)" }}>
                  <span style={{ fontWeight: 500, color: "var(--color-text)" }}>{item}</span>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className={styles.actionBtn}>
                      <Edit2 size={16} />
                    </button>
                    <button className={styles.actionBtn} style={{ color: "#EF4444", borderColor: "#FEE2E2" }} onClick={() => handleDelete(index)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {attributes[activeTab].length === 0 && (
                <div style={{ padding: "30px", textAlign: "center", color: "var(--color-text-tertiary)" }}>
                  No {activeTab} found. Add your first one above!
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

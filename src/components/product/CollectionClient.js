"use client";

import { useState, useMemo } from "react";
import { PackageSearch } from "lucide-react";
import HandmadeProductCard from "@/components/product/HandmadeProductCard";
import ShapeFilterBar from "@/components/product/ShapeFilterBar";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import { SORT_OPTIONS } from "@/lib/constants";
import pageStyles from "@/styles/pages/collection.module.css";
import filterStyles from "@/styles/components/filter.module.css";
import gridStyles from "@/components/product/handmade-card.module.css";

// Helper functions for client-side filtering and sorting
function filterProductsList(productList, filters) {
  let filtered = [...productList];
  if (filters.nailShape && filters.nailShape.length > 0) {
    filtered = filtered.filter((p) => filters.nailShape.includes(p.nailShape));
  }
  if (filters.length && filters.length.length > 0) {
    filtered = filtered.filter((p) =>
      p.lengths.some((l) => filters.length.includes(l))
    );
  }
  return filtered;
}

function sortProductsList(productList, sortBy) {
  const sorted = [...productList];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "popular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return sorted;
  }
}

export default function CollectionClient({ category, allProducts, featuredProducts }) {
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selectedLengths, setSelectedLengths] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");

  const filtered = useMemo(() => {
    const shapeFilters = { nailShape: selectedShapes, length: selectedLengths };
    const f = filterProductsList(allProducts, shapeFilters);
    return sortProductsList(f, sortBy);
  }, [allProducts, selectedShapes, selectedLengths, sortBy]);

  const toggleShape = (shapeId) => {
    setSelectedShapes(prev => 
      prev.includes(shapeId) ? [] : [shapeId]
    );
  };

  const toggleLength = (lengthId) => {
    setSelectedLengths(prev => 
      prev.includes(lengthId) ? [] : [lengthId]
    );
  };

  return (
    <div className={pageStyles.collectionPage} id={`${category?.slug}-collection`}>
      <div className="container">
        <div className={pageStyles.collectionHeader} style={{ position: "relative" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <h1 className={pageStyles.collectionTitle}>{category?.name || "Collection"} Nails</h1>
            <span style={{
              position: "absolute",
              bottom: "2px",
              left: "50%",
              transform: "translateX(-50%) rotate(-1deg)",
              width: "60%",
              height: "8px",
              background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
              borderRadius: "var(--radius-full)",
              opacity: 0.6,
              pointerEvents: "none",
            }} />
          </div>
        </div>

        <ShapeFilterBar 
          selectedShapes={selectedShapes} 
          onToggleShape={toggleShape} 
          selectedLengths={selectedLengths} 
          onToggleLength={toggleLength} 
        />

        <CategoryShowcase mini items={featuredProducts} />

        <div className={filterStyles.collectionLayout}>
          <div className={filterStyles.collectionMain}>
            <div className={filterStyles.sortBar}>
              <span className={filterStyles.resultCount}>
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </span>
              <div className={filterStyles.viewToggle}>
                <button
                  className={`${filterStyles.viewBtn} ${viewMode === "grid" ? filterStyles.active : ""}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </button>
                <button
                  className={`${filterStyles.viewBtn} ${viewMode === "list" ? filterStyles.active : ""}`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
                  </svg>
                </button>
              </div>
              <select
                className={filterStyles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                id="sort-select"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className={filterStyles.noResults} style={{ 
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "80px 20px", background: "var(--color-bg-card)", borderRadius: "var(--radius-xl)", 
                border: "1px dashed var(--color-border)", textAlign: "center", minHeight: "400px"
              }}>
                <PackageSearch size={48} color="var(--color-primary)" style={{ marginBottom: "20px", opacity: 0.8 }} />
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-text)", marginBottom: "8px" }}>We're fresh out of sets!</h3>
                <p className={filterStyles.mobileSmallText} style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", maxWidth: "450px", marginBottom: "24px", lineHeight: "1.6" }}>
                  We couldn't find any nails matching your exact shape and length preferences. Try tweaking your selection.
                </p>
                <button 
                  onClick={() => { setSelectedShapes([]); setSelectedLengths([]); }}
                  style={{
                    padding: "10px 24px", backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-full)", color: "var(--color-text)", fontSize: "0.85rem", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? gridStyles.masonryGrid : gridStyles.listGrid}>
                {filtered.map((product, i) => (
                  <div key={product.id} className={gridStyles.masonryItem}>
                    <HandmadeProductCard product={product} index={i} viewMode={viewMode} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { PackageSearch } from "lucide-react";
import { products, filterProducts, sortProducts, getFeaturedProducts } from "@/data/products";
import HandmadeProductCard from "@/components/product/HandmadeProductCard";
import FilterSidebar from "@/components/product/FilterSidebar";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import { SORT_OPTIONS } from "@/lib/constants";
import pageStyles from "@/styles/pages/collection.module.css";
import filterStyles from "@/styles/components/filter.module.css";
import gridStyles from "@/components/product/handmade-card.module.css";

export default function ShopPage() {
  const allProducts = products;
  const [filters, setFilters] = useState({ nailShape: [], style: [], length: [], priceRange: null, inStockOnly: false });
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");

  const featured = useMemo(() => {
    return getFeaturedProducts();
  }, []);

  const filtered = useMemo(() => {
    const f = filterProducts(allProducts, filters);
    return sortProducts(f, sortBy);
  }, [allProducts, filters, sortBy]);

  return (
    <div className={pageStyles.collectionPage} id="shop-collection">
      <div className="container">
        <div className={pageStyles.collectionHeader} style={{ position: "relative" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <h1 className={pageStyles.collectionTitle}>Shop All Products</h1>
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
          <p className={pageStyles.collectionDescription}>Browse our complete collection of handcrafted and factory-made nails.</p>
        </div>

        <CategoryShowcase mini items={featured} />

        <div className={filterStyles.collectionLayout}>
          <FilterSidebar filters={filters} onFilterChange={setFilters} />

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
                id="sort-select-shop"
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
                  We couldn't find any nails matching those exact filters. Try tweaking your search!
                </p>
                <button 
                  onClick={() => setFilters({ nailShape: [], style: [], length: [], priceRange: null, inStockOnly: false })}
                  style={{
                    padding: "10px 24px", backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-full)", color: "var(--color-text)", fontSize: "0.85rem", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  Clear all filters
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

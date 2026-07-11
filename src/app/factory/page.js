"use client";

import { useState, useMemo } from "react";
import { getProductsByCategory, filterProducts, sortProducts, getFeaturedProducts } from "@/data/products";
import { getCategoryBySlug } from "@/data/categories";
import HandmadeProductCard from "@/components/product/HandmadeProductCard";
import FilterSidebar from "@/components/product/FilterSidebar";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import { SORT_OPTIONS } from "@/lib/constants";
import pageStyles from "@/styles/pages/collection.module.css";
import filterStyles from "@/styles/components/filter.module.css";
import gridStyles from "@/components/product/handmade-card.module.css";

export default function FactoryPage() {
  const category = getCategoryBySlug("factory");
  const allProducts = getProductsByCategory("factory");
  const [filters, setFilters] = useState({ nailShape: [], style: [], length: [], priceRange: null, inStockOnly: false });
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");

  const featuredFactory = useMemo(() => {
    return getFeaturedProducts().filter(p => p.category === "factory");
  }, []);

  const filtered = useMemo(() => {
    const f = filterProducts(allProducts, filters);
    return sortProducts(f, sortBy);
  }, [allProducts, filters, sortBy]);

  return (
    <div className={pageStyles.collectionPage} id="factory-collection">
      <div className="container">
        <div className={pageStyles.collectionHeader} style={{ position: "relative" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <h1 className={pageStyles.collectionTitle}>{category.name} Nails</h1>
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
          <p className={pageStyles.collectionDescription}>{category.description}</p>
        </div>

        <CategoryShowcase mini items={featuredFactory} />

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
                id="sort-select-factory"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className={filterStyles.noResults}>
                <p>No products match your filters.</p>
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

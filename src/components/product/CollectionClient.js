"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PackageSearch, Sparkles } from "lucide-react";
import HandmadeProductCard from "@/components/product/HandmadeProductCard";
import ProductCard from "@/components/product/ProductCard";
import ShapeFilterBar from "@/components/product/ShapeFilterBar";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FactoryVideos from "@/components/product/FactoryVideos";
import { SORT_OPTIONS } from "@/lib/constants";
import pageStyles from "@/styles/pages/collection.module.css";
import filterStyles from "@/styles/components/filter.module.css";
import gridStyles from "@/components/product/handmade-card.module.css";

// Helper functions for client-side filtering and sorting
function filterProductsList(productList, filters) {
  let filtered = [...productList];
  if (filters.nailShape && filters.nailShape.length > 0) {
    filtered = filtered.filter((p) =>
      filters.nailShape.some((s) => p.nailShape?.toLowerCase() === s.toLowerCase())
    );
  }
    if (filters.lengths && filters.lengths.length > 0) {
      filtered = filtered.filter((p) =>
        p.lengths && p.lengths.some((l) =>
          filters.lengths.some((fl) => l.toLowerCase() === fl.toLowerCase())
        )
      );
    }
    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors && p.colors.some((productColor) => 
          filters.colors.some((filterColor) => productColor.toLowerCase() === filterColor.toLowerCase())
        )
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
    default:
      return sorted;
  }
}

const SPECIAL_MIX_MATCH_NAMES = ["amber haze", "bridal bows", "polka dot", "gothic flora", "emerald flora"];

function distributeSpecialProducts(productList, pageSize) {
  const specials = [];
  const normal = [];
  
  productList.forEach(p => {
    if (SPECIAL_MIX_MATCH_NAMES.includes(p.name.toLowerCase())) {
      specials.push(p);
    } else {
      normal.push(p);
    }
  });

  if (specials.length === 0) return productList;

  const result = [];
  let normalIdx = 0;
  let specialIdx = 0;
  
  while (normalIdx < normal.length || specialIdx < specials.length) {
    const pageItems = [];
    
    if (specialIdx < specials.length) {
      pageItems.push(specials[specialIdx]);
      specialIdx++;
    }
    
    while (pageItems.length < pageSize && normalIdx < normal.length) {
      pageItems.push(normal[normalIdx]);
      normalIdx++;
    }
    
    result.push(...pageItems);
  }
  
  return result;
}

const PAGE_SIZE = 8;

export default function CollectionClient({ category, allProducts, featuredProducts }) {
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selectedLengths, setSelectedLengths] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const shapeFilters = { nailShape: selectedShapes, lengths: selectedLengths, colors: selectedColors };
    const f = filterProductsList(allProducts, shapeFilters);
    const sorted = sortProductsList(f, sortBy);
    return distributeSpecialProducts(sorted, PAGE_SIZE);
  }, [allProducts, selectedShapes, selectedLengths, selectedColors, sortBy]);

  const paginated = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const hasMore = visibleCount < filtered.length;

  const toggleShape = (shapeId) => {
    setSelectedShapes(prev => 
      prev.includes(shapeId) ? [] : [shapeId]
    );
    setVisibleCount(PAGE_SIZE);
  };

  const toggleLength = (lengthId) => {
    setSelectedLengths(prev => 
      prev.includes(lengthId) ? [] : [lengthId]
    );
    setVisibleCount(PAGE_SIZE);
  };

  const toggleColor = (colorId) => {
    setSelectedColors(prev => 
      prev.includes(colorId) ? [] : [colorId]
    );
    setVisibleCount(PAGE_SIZE);
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
          selectedColors={selectedColors}
          onToggleColor={toggleColor}
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
                onChange={(e) => { setSortBy(e.target.value); setVisibleCount(PAGE_SIZE); }}
                id="sort-select"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {allProducts.length === 0 ? (
              <div className={filterStyles.noResults} style={{ 
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "80px 20px", background: "var(--color-bg-card)", borderRadius: "var(--radius-xl)", 
                border: "1px dashed var(--color-border)", textAlign: "center", minHeight: "400px"
              }}>
                <PackageSearch size={48} color="var(--color-primary)" style={{ marginBottom: "20px", opacity: 0.8 }} />
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-text)", marginBottom: "8px" }}>We're fresh out of sets!</h3>
                <p className={filterStyles.mobileSmallText} style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", maxWidth: "450px", marginBottom: "24px", lineHeight: "1.6" }}>
                  We're currently sold out of this entire collection! Check back soon for restocks.
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className={filterStyles.noResults} style={{ 
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "60px 20px", background: "var(--color-bg-card)", borderRadius: "var(--radius-xl)", 
                border: "1px dashed var(--color-border)", textAlign: "center", minHeight: "360px"
              }}>
                <PackageSearch size={44} color="var(--color-primary)" style={{ marginBottom: "16px", opacity: 0.85 }} />
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-text)", marginBottom: "8px", fontWeight: 600 }}>No exact matches found</h3>
                <p className={filterStyles.mobileSmallText} style={{ color: "var(--color-text-secondary)", fontSize: "1rem", maxWidth: "480px", marginBottom: "24px", lineHeight: "1.6" }}>
                  We couldn&apos;t find any sets with this exact combination. Want one made for you?
                </p>
                <div style={{ display: "flex", gap: "14px", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link
                    href="/custom-order"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "46px",
                      width: "190px",
                      backgroundColor: "var(--color-primary)",
                      color: "white",
                      borderRadius: "var(--radius-full)",
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(122, 64, 61, 0.2)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    Custom Order
                  </Link>
                  <button 
                    onClick={() => { setSelectedShapes([]); setSelectedLengths([]); setSelectedColors([]); }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "46px",
                      width: "190px",
                      backgroundColor: "var(--color-bg)", 
                      border: "1.5px solid var(--color-border)",
                      borderRadius: "var(--radius-full)", 
                      color: "var(--color-text)", 
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem", 
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      cursor: "pointer", 
                      transition: "all 0.2s ease"
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={viewMode === "grid" ? gridStyles.masonryGrid : gridStyles.listGrid}>
                  {paginated.map((product, i) => (
                    <div key={product.id} className={gridStyles.masonryItem}>
                      {product.category === 'handmade' ? (
                        <HandmadeProductCard product={product} index={i} viewMode={viewMode} />
                      ) : (
                        <ProductCard product={product} index={i} viewMode={viewMode} />
                      )}
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-12)' }}>
                    <button 
                      onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                      style={{
                        padding: "12px 32px",
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-text-inverse)",
                        border: "none",
                        borderRadius: "var(--radius-full)",
                        fontSize: "1rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        minWidth: "200px"
                      }}
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {category?.slug === 'factory' && <FactoryVideos />}
        {category?.slug === 'handmade' && <FactoryVideos />}
      </div>
    </div>
  );
}

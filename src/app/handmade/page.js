"use client";

import { useState, useMemo } from "react";
import { getProductsByCategory, filterProducts, sortProducts } from "@/data/products";
import { getCategoryBySlug } from "@/data/categories";
import ProductGrid from "@/components/product/ProductGrid";
import FilterSidebar from "@/components/product/FilterSidebar";
import { SORT_OPTIONS } from "@/lib/constants";
import pageStyles from "@/styles/pages/collection.module.css";
import filterStyles from "@/styles/components/filter.module.css";

export default function HandmadePage() {
  const category = getCategoryBySlug("handmade");
  const allProducts = getProductsByCategory("handmade");
  const [filters, setFilters] = useState({ nailShape: [], style: [], length: [], priceRange: null, inStockOnly: false });
  const [sortBy, setSortBy] = useState("popular");

  const filtered = useMemo(() => {
    const f = filterProducts(allProducts, filters);
    return sortProducts(f, sortBy);
  }, [allProducts, filters, sortBy]);

  return (
    <div className={pageStyles.collectionPage} id="handmade-collection">
      <div className="container">
        <div className={pageStyles.collectionHeader}>
          <h1 className={pageStyles.collectionTitle}>{category.name} Nails</h1>
          <p className={pageStyles.collectionDescription}>{category.description}</p>
        </div>

        <div className={filterStyles.collectionLayout}>
          <FilterSidebar filters={filters} onFilterChange={setFilters} />

          <div className={filterStyles.collectionMain}>
            <div className={filterStyles.sortBar}>
              <span className={filterStyles.resultCount}>
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </span>
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

            <ProductGrid products={filtered} />
          </div>
        </div>
      </div>
    </div>
  );
}

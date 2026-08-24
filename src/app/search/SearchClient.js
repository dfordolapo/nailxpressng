"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/product/ProductGrid";
import pageStyles from "@/styles/pages/collection.module.css";

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function searchLocalProducts(query, productList) {
  const lowercaseQuery = query.toLowerCase();
  return productList.filter((product) => {
    return (
      product.name?.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery) ||
      product.category?.toLowerCase().includes(lowercaseQuery) ||
      product.color?.toLowerCase().includes(lowercaseQuery) ||
      product.nailShape?.toLowerCase().includes(lowercaseQuery) ||
      (product.colors && product.colors.some((c) => c.toLowerCase().includes(lowercaseQuery))) ||
      (product.lengths && product.lengths.some((l) => l.toLowerCase().includes(lowercaseQuery))) ||
      (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)))
    );
  });
}

function SearchContent({ allProducts }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return allProducts;
    return searchLocalProducts(query, allProducts);
  }, [query, allProducts]);

  return (
    <div className={pageStyles.searchPage} id="search-page">
      <div className="container">
        <div className={pageStyles.searchHeader}>
          <h1 className={pageStyles.searchTitle}>Search</h1>
          <div className={pageStyles.searchInputWrapper}>
            <span className={pageStyles.searchIcon}><SearchIcon /></span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for nails, styles, colors..."
              className={pageStyles.searchInput}
              autoFocus
              id="search-page-input"
            />
          </div>
        </div>

        {query.trim() && results.length === 0 ? (
          <div className={pageStyles.noResults}>
            <div className={pageStyles.noResultsIcon}>🔍</div>
            <h2 style={{ fontSize: "1.125rem", color: "var(--color-primary-800)", marginBottom: "var(--space-2)", fontFamily: "var(--font-heading)" }}>We drew a blank...</h2>
            <p className={pageStyles.noResultsText} style={{ maxWidth: "400px", margin: "0 auto", fontSize: "0.875rem" }}>
              We couldn&apos;t find any styles matching your search. Try adjusting your filters or browsing our bestsellers.
            </p>
          </div>
        ) : (
          <>
            <p style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-tertiary)",
              marginBottom: "var(--space-6)",
              textAlign: "center",
            }}>
              {query.trim()
                ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
                : `Showing all ${results.length} products`
              }
            </p>
            <ProductGrid products={results} />
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchClient({ allProducts }) {
  return (
    <Suspense fallback={
      <div style={{ textAlign: "center", padding: "var(--space-20) 0" }}>
        <p>Loading search...</p>
      </div>
    }>
      <SearchContent allProducts={allProducts} />
    </Suspense>
  );
}

"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchProducts, products } from "@/data/products";
import ProductGrid from "@/components/product/ProductGrid";
import pageStyles from "@/styles/pages/collection.module.css";

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return products;
    return searchProducts(query);
  }, [query]);

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
            <p className={pageStyles.noResultsText}>
              No results found for &ldquo;{query}&rdquo;. Try a different search term.
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: "center", padding: "var(--space-20) 0" }}>
        <p>Loading search...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

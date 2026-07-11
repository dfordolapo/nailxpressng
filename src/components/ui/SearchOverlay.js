"use client";

import Link from "next/link";
import { useSearch } from "@/context/SearchContext";
import { formatPrice } from "@/lib/utils";
import styles from "@/styles/pages/collection.module.css";

function SearchIconSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function SearchOverlay() {
  const { query, results, isSearching, isOpen, updateQuery, closeSearch } = useSearch();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(254, 252, 250, 0.97)",
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 200ms ease-out",
      }}
      id="search-overlay"
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--space-6)",
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        width: "100%",
      }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "var(--text-xl)", color: "var(--color-text-secondary)" }}>
          Search
        </h2>
        <button
          onClick={closeSearch}
          aria-label="Close search"
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius-full)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-text-secondary)",
            transition: "background var(--transition-fast)",
          }}
          id="close-search-btn"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Search Input */}
      <div style={{ maxWidth: 360, margin: "0 auto", width: "100%", padding: "0 var(--space-6)" }}>
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon}><SearchIconSVG /></span>
          <input
            type="text"
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            placeholder="Search for nails, styles, colors..."
            className={styles.searchInput}
            autoFocus
            id="search-input"
          />
        </div>
      </div>

      {/* Results */}
      <div style={{
        flex: 1,
        overflow: "auto",
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        width: "100%",
        padding: "var(--space-8) var(--space-6)",
      }}>
        {isSearching && (
          <p style={{ textAlign: "center", color: "var(--color-text-tertiary)" }}>Searching...</p>
        )}

        {!isSearching && query && results.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <p className={styles.noResultsText}>No results found for &ldquo;{query}&rdquo;</p>
          </div>
        )}

        {!isSearching && results.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "var(--space-4)" }}>
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={closeSearch}
                style={{
                  display: "flex",
                  gap: "var(--space-4)",
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-light)",
                  transition: "all var(--transition-fast)",
                  textDecoration: "none",
                  color: "inherit",
                }}
                id={`search-result-${product.slug}`}
              >
                <div style={{
                  width: 70,
                  height: 90,
                  borderRadius: "var(--radius-md)",
                  background: "linear-gradient(135deg, var(--color-primary-100), var(--color-surface))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  flexShrink: 0,
                }}>
                  💅
                </div>
                <div>
                  <p style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 500,
                    marginBottom: "var(--space-1)",
                  }}>
                    {product.name}
                  </p>
                  <p style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "var(--space-1)",
                  }}>
                    {product.category}
                  </p>
                  <p style={{ fontWeight: 600 }}>{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}


      </div>
    </div>
  );
}

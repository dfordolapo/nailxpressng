"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearch } from "@/context/SearchContext";
import { getProducts } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { SOCIAL_LINKS } from "@/lib/constants";
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

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const placeholders = [
    "Search for nails, styles, colors...",
    "try 'almond shape'...",
    "try 'bridal set'...",
    "search for 'ombré'..."
  ];

  useEffect(() => {
    if (!isOpen) return;
    getProducts().then(setAllProducts).catch(() => {});
  }, [isOpen]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matches = allProducts
      .filter((p) => p.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        return aStarts - bStarts;
      })
      .slice(0, 6);
    return matches;
  }, [query, allProducts]);

  const localResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    });
  }, [query, allProducts]);

  const hasLocal = allProducts.length > 0;
  const displayResults = hasLocal ? localResults : results;
  const displaySearching = !hasLocal && isSearching && query.trim();

  useEffect(() => {
    if (!isOpen || query) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen, query]);

  const trendingSearches = ["Bridal", "Coffin Shape", "Ombré"];
  
  const categories = [
    { name: "Handmade", color: "linear-gradient(135deg, var(--color-primary-100), var(--color-bg-warm))", query: "handmade" },
    { name: "Factory", color: "linear-gradient(135deg, #FDEAE6, var(--color-bg-warm))", query: "factory" },
    { name: "Bridal", color: "linear-gradient(135deg, #F4F0EE, var(--color-bg-warm))", query: "bridal" },
    { name: "Art", color: "linear-gradient(135deg, #E8EAE6, var(--color-bg-warm))", query: "art" },
  ];

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
      <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "var(--space-12) var(--space-6) var(--space-6)" }}>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            placeholder={placeholders[placeholderIndex]}
            autoFocus
            id="search-input"
            style={{ 
              width: "100%",
              background: "transparent",
              border: "none",
              borderBottom: "2px solid var(--color-border)",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontFamily: "var(--font-heading)",
              color: "var(--color-text)",
              padding: "var(--space-2) 0 var(--space-4)",
              outline: "none",
              transition: "border-color var(--transition-base)",
              lineHeight: 1.2
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
            onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
          />
        </div>
      </div>

      {/* Autocomplete Suggestions */}
      {query.trim() && suggestions.length > 0 && (
        <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "0 var(--space-6)" }}>
          <div style={{ display: "flex", flexDirection: "column", background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border-light)", boxShadow: "0 8px 30px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            {suggestions.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                onClick={closeSearch}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "10px var(--space-4)",
                  textDecoration: "none",
                  color: "inherit",
                  borderBottom: "1px solid var(--color-border-light)",
                  transition: "background var(--transition-fast)",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-50)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                id={`suggestion-${p.slug}`}
              >
                <span style={{ fontSize: "0.85rem", color: "var(--color-primary)", flexShrink: 0 }}>⌕</span>
                <span style={{ flex: 1, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.name}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)", flexShrink: 0 }}>
                  {formatPrice(p.price)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div style={{
        flex: 1,
        overflow: "auto",
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        width: "100%",
        padding: "var(--space-8) var(--space-6)",
      }}>
        {!query && !isSearching && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* Trending Searches */}
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', fontWeight: 600 }}>Trending Searches</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {trendingSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => updateQuery(term)}
                    style={{
                      background: 'white',
                      border: '1px solid var(--color-border)',
                      padding: '6px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.875rem',
                      color: 'var(--color-text)',
                      transition: 'all var(--transition-fast)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.color = 'var(--color-text)';
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Quick Picks */}
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', fontWeight: 600 }}>Quick Browse</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => updateQuery(cat.query)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: '100%',
                      aspectRatio: '1/1',
                      background: cat.color,
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      transition: 'transform var(--transition-fast)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      💅
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {displaySearching && (
          <p style={{ textAlign: "center", color: "var(--color-text-tertiary)" }}>Searching...</p>
        )}

        {!displaySearching && query && displayResults.length === 0 && (
          <div className={styles.noResults} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-8) 0' }}>
            <div className={styles.noResultsIcon} style={{ fontSize: '3rem', marginBottom: '0' }}>🔍</div>
            <p className={styles.noResultsText} style={{ marginBottom: 'var(--space-2)' }}>No results found for &ldquo;{query}&rdquo;</p>
            <Link 
              href={`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(`Hi, I'm looking for a custom order similar to: '${query}'. Can you help?`)}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                background: 'var(--color-primary)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                transition: 'transform var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={closeSearch}
            >
              Can't find it? Request a custom order →
            </Link>
          </div>
        )}

        {!displaySearching && displayResults.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-6)" }}>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={closeSearch}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  background: "var(--color-primary)",
                  color: "white",
                  padding: "10px 24px",
                  borderRadius: "var(--radius-full)",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  transition: "transform var(--transition-fast)",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                id="view-all-results-btn"
              >
                View all results for &ldquo;{query}&rdquo; →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "var(--space-4)" }}>
            {displayResults.map((product) => (
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
          </div>
        )}


      </div>
    </div>
  );
}

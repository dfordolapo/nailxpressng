"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearch } from "@/context/SearchContext";
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
  const placeholders = [
    "Search for nails, styles, colors...",
    "try 'almond shape'...",
    "try 'bridal set'...",
    "search for 'ombré'..."
  ];

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
      <div style={{ maxWidth: 360, margin: "0 auto", width: "100%", padding: "0 var(--space-6)" }}>
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon}><SearchIconSVG /></span>
          <input
            type="text"
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            placeholder={placeholders[placeholderIndex]}
            className={styles.searchInput}
            autoFocus
            id="search-input"
            style={{ transition: "all 0.3s ease" }}
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

        {isSearching && query && (
          <p style={{ textAlign: "center", color: "var(--color-text-tertiary)" }}>Searching...</p>
        )}

        {!isSearching && query && results.length === 0 && (
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

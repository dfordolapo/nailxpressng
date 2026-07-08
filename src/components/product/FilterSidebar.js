"use client";

import { useState } from "react";
import { nailShapes, nailLengths, styles as styleOptions } from "@/data/categories";
import filterStyles from "@/styles/components/filter.module.css";

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function FilterSidebar({ filters, onFilterChange, productCounts = {} }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = (type, value) => {
    const current = filters[type] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [type]: updated });
  };

  const clearFilters = () => {
    onFilterChange({ nailShape: [], style: [], length: [], priceRange: null, inStockOnly: false });
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => (Array.isArray(v) && v.length > 0) || (v !== null && v !== false && !Array.isArray(v))
  );

  return (
    <>
      <button
        className={`${filterStyles.mobileFilterBtn}`}
        onClick={() => setIsOpen(true)}
        style={{
          padding: "var(--space-3) var(--space-5)",
          border: "1.5px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--weight-semibold)",
          display: "none",
        }}
        id="mobile-filter-toggle"
      >
        Filters {hasActiveFilters && "•"}
      </button>

      <aside className={`${filterStyles.sidebar} ${isOpen ? filterStyles.open : ""}`} id="filter-sidebar">
        {/* Mobile close */}
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            style={{
              marginBottom: "var(--space-4)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-semibold)",
              color: "var(--color-primary)",
            }}
          >
            ✕ Close Filters
          </button>
        )}

        {/* Nail Shape */}
        <div className={filterStyles.filterGroup}>
          <h4 className={filterStyles.filterTitle}>Nail Shape</h4>
          {nailShapes.map((shape) => (
            <label key={shape.id} className={filterStyles.filterOption} onClick={() => toggleFilter("nailShape", shape.id)}>
              <span className={`${filterStyles.checkbox} ${(filters.nailShape || []).includes(shape.id) ? filterStyles.checked : ""}`}>
                {(filters.nailShape || []).includes(shape.id) && <CheckIcon />}
              </span>
              {shape.name}
            </label>
          ))}
        </div>

        {/* Style */}
        <div className={filterStyles.filterGroup}>
          <h4 className={filterStyles.filterTitle}>Style</h4>
          {styleOptions.map((style) => (
            <label key={style.id} className={filterStyles.filterOption} onClick={() => toggleFilter("style", style.id)}>
              <span className={`${filterStyles.checkbox} ${(filters.style || []).includes(style.id) ? filterStyles.checked : ""}`}>
                {(filters.style || []).includes(style.id) && <CheckIcon />}
              </span>
              {style.name}
            </label>
          ))}
        </div>

        {/* Length */}
        <div className={filterStyles.filterGroup}>
          <h4 className={filterStyles.filterTitle}>Length</h4>
          {nailLengths.map((length) => (
            <label key={length.id} className={filterStyles.filterOption} onClick={() => toggleFilter("length", length.id)}>
              <span className={`${filterStyles.checkbox} ${(filters.length || []).includes(length.id) ? filterStyles.checked : ""}`}>
                {(filters.length || []).includes(length.id) && <CheckIcon />}
              </span>
              {length.name}
            </label>
          ))}
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button className={filterStyles.clearFilters} onClick={clearFilters} id="clear-filters">
            Clear all filters
          </button>
        )}
      </aside>
    </>
  );
}

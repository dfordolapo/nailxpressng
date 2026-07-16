"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { searchProducts } from "@/lib/api";
import { debounce } from "@/lib/utils";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const performSearch = useCallback(
    debounce(async (q) => {
      if (!q.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }
      try {
        const found = await searchProducts(q);
        setResults(found);
      } catch (e) {
        console.error(e);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const updateQuery = (q) => {
    setQuery(q);
    setIsSearching(true);
    performSearch(q);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsSearching(false);
  };

  const openSearch = () => setIsOpen(true);
  const closeSearch = () => {
    setIsOpen(false);
    clearSearch();
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        results,
        isSearching,
        isOpen,
        updateQuery,
        clearSearch,
        openSearch,
        closeSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

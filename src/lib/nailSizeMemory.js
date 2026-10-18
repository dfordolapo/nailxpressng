"use client";

const NAIL_SIZE_STORAGE_KEY = "nailexpress_saved_nail_size";

/**
 * Retrieves the customer's saved nail size preference from localStorage
 * Returns e.g. "S", "M", "L", or null if not yet set
 */
export function getSavedNailSize() {
  if (typeof window === "undefined") return null;
  try {
    const val = localStorage.getItem(NAIL_SIZE_STORAGE_KEY);
    return val ? val.trim() : null;
  } catch {
    return null;
  }
}

/**
 * Persists customer's nail size preference across all sessions and pages
 * Dispatches an event so other components immediately react
 */
export function saveNailSize(size) {
  if (typeof window === "undefined" || !size) return;
  try {
    const clean = String(size).trim();
    localStorage.setItem(NAIL_SIZE_STORAGE_KEY, clean);
    window.dispatchEvent(new CustomEvent("nailexpress:nail-size-changed", { detail: clean }));
  } catch {
    // Ignore private browsing quota errors
  }
}

/**
 * Clears saved nail size preference
 */
export function clearSavedNailSize() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(NAIL_SIZE_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("nailexpress:nail-size-changed", { detail: null }));
  } catch {
    // Ignore
  }
}

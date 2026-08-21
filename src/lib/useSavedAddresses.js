"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "nailexpress_saved_addresses";
const ACTIVE_KEY = "nailexpress_active_address_id";

export const INITIAL_PRESETS = [
  {
    id: "home",
    label: "Home",
    presetLabel: "Home",
    tag: "home",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
  },
  {
    id: "office",
    label: "Office",
    presetLabel: "Office",
    tag: "office",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
  },
  {
    id: "gift",
    label: "Gift / Recipient",
    presetLabel: "",
    tag: "gift",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
  },
];

export function useSavedAddresses() {
  const [addresses, setAddresses] = useState(INITIAL_PRESETS);
  const [activeAddressId, setActiveAddressId] = useState("home");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const activeId = localStorage.getItem(ACTIVE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map(p => 
            p.id === "gift" ? { ...p, fullName: "", email: "", phone: "", address: "", state: "", city: "", presetLabel: "" } : p
          );
          setAddresses(sanitized);
        }
      }

      if (activeId) {
        setActiveAddressId(activeId);
      }
    } catch (e) {
      console.error("Error loading saved addresses from storage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save helper
  const persistAddresses = useCallback((newList, newActiveId) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      if (newActiveId) {
        localStorage.setItem(ACTIVE_KEY, newActiveId);
      }
    } catch (e) {
      console.error("Error persisting addresses:", e);
    }
  }, []);

  // Select active address
  const selectAddress = useCallback((id) => {
    setActiveAddressId(id);
    try {
      localStorage.setItem(ACTIVE_KEY, id);
    } catch (e) {}
  }, []);

  // Save or update an address preset with custom name/label support
  const saveAddress = useCallback((formData, targetId = "home", customLabel = "") => {
    const finalLabel = customLabel || formData.presetLabel || (targetId === "home" ? "Home" : targetId === "office" ? "Office" : targetId === "gift" ? "Gift" : "Saved Details");
    
    // If saving to the generic 'gift' slot, we always spawn a new individual entry 
    // so users can have multiple gift recipients without overwriting.
    const actualTargetId = targetId === "gift" ? `gift_${Date.now()}` : targetId;

    setAddresses((prev) => {
      let updated;
      const existingIndex = prev.findIndex((item) => item.id === actualTargetId);

      if (existingIndex > -1) {
        // Update existing address preset
        updated = prev.map((item, i) =>
          i === existingIndex
            ? {
                ...item,
                ...formData,
                label: finalLabel,
                presetLabel: finalLabel,
                tag: formData.tag || item.tag || actualTargetId,
              }
            : item
        );
      } else {
        // Create new preset
        const newAddress = {
          id: actualTargetId || `custom_${Date.now()}`,
          label: finalLabel,
          presetLabel: finalLabel,
          tag: formData.tag || (actualTargetId.startsWith("custom") || actualTargetId.startsWith("gift_") ? "gift" : actualTargetId),
          ...formData,
        };
        updated = [...prev, newAddress];
      }

      persistAddresses(updated, actualTargetId);
      return updated;
    });
    setActiveAddressId(actualTargetId);
    return actualTargetId;
  }, [persistAddresses]);

  // Delete a saved address preset
  const deleteAddress = useCallback((idToDelete) => {
    setAddresses((prev) => {
      let updated;
      // If default preset (home, office, gift), reset fields instead of deleting tag slot
      if (["home", "office", "gift"].includes(idToDelete)) {
        updated = prev.map((item) =>
          item.id === idToDelete
            ? { ...item, fullName: "", email: "", phone: "", address: "", state: "", city: "" }
            : item
        );
      } else {
        updated = prev.filter((item) => item.id !== idToDelete);
      }

      const nextActive = updated.find((a) => a.id !== idToDelete)?.id || "home";
      persistAddresses(updated, nextActive);
      setActiveAddressId(nextActive);
      return updated;
    });
  }, [persistAddresses]);

  const activeAddress = addresses.find((item) => item.id === activeAddressId) || null;

  return {
    addresses,
    activeAddressId,
    activeAddress,
    isLoaded,
    selectAddress,
    saveAddress,
    deleteAddress,
  };
}

"use client";

import { useEffect } from "react";

/**
 * Custom hook to lock body & html scroll completely when a modal is open.
 * Prevents mobile touch drag-through on background while allowing smooth scrolling inside the modal.
 */
export function useLockBodyScroll(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    // Save previous styles
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevTouchAction = document.body.style.touchAction;

    // Lock scroll
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.classList.add("modal-open");
    document.documentElement.classList.add("modal-open");

    // Prevent touch drag on background for iOS/Android
    const handleTouchMove = (e) => {
      // Allow scrolling ONLY if touch originates inside a designated scroll container (.modalBody or scrollable area)
      const scrollable = e.target.closest("[data-modal-scroll='true'], [class*='modalBody'], [class*='modalContent']");
      if (!scrollable) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.touchAction = prevTouchAction;
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isLocked]);
}

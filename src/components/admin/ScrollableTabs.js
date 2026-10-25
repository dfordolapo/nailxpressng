"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import styles from "@/styles/admin.module.css";

export default function ScrollableTabs({ children, className = "", style = {} }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth + 4;
      setCanScrollLeft(el.scrollLeft > 6);
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      setCanScrollRight(hasOverflow && !isAtEnd);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });

    // Ensure active tab is scrolled into view if selected
    const activeEl = el.querySelector(`.${styles.active}`) || el.querySelector('[aria-selected="true"]');
    if (activeEl) {
      const elRect = el.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      if (activeRect.left < elRect.left || activeRect.right > elRect.right) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }

    // Extra check after DOM renders/fonts load
    const timeout = setTimeout(checkScroll, 120);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timeout);
    };
  }, [checkScroll, children]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -180, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 180, behavior: "smooth" });
    }
  };

  return (
    <div className={`${styles.tabsScrollWrapper} ${className}`} style={style}>
      {canScrollLeft && (
        <button
          type="button"
          onClick={handleScrollLeft}
          className={styles.tabsScrollChevronLeft}
          aria-label="Scroll left to see earlier categories"
          title="Previous categories"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      <div ref={scrollRef} className={styles.tabsScrollContent}>
        {children}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={handleScrollRight}
          className={styles.tabsScrollChevron}
          aria-label="Scroll right to see more categories"
          title="More categories"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

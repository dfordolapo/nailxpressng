"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import styles from "@/styles/admin.module.css";

export default function ScrollableTabs({ children, className = "", style = {} }) {
  const scrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth + 4;
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

    // Extra check after DOM renders/fonts load
    const timeout = setTimeout(checkScroll, 100);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timeout);
    };
  }, [checkScroll, children]);

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 160, behavior: "smooth" });
    }
  };

  return (
    <div className={`${styles.tabsScrollWrapper} ${className}`} style={style}>
      <div ref={scrollRef} className={styles.tabsScrollContent}>
        {children}
      </div>
      {canScrollRight && (
        <button
          type="button"
          onClick={handleScrollRight}
          className={styles.tabsScrollChevron}
          aria-label="Scroll right to see more filters"
          title="More options"
        >
          <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

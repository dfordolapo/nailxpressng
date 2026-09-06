"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteRestoration() {
  const pathname = usePathname();

  // 1. Save the current full URL whenever the user navigates or page changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Do not save administrative or checkout-success/temporary URLs as the restore target
    if (pathname.startsWith("/admin") || pathname.startsWith("/checkout/success")) {
      return;
    }

    const currentUrl = pathname + (window.location.search || "");
    const scrollY = window.scrollY || 0;

    try {
      localStorage.setItem("nailexpress_last_route", currentUrl);
      localStorage.setItem("nailexpress_last_scroll", scrollY.toString());
      localStorage.setItem("nailexpress_last_active_time", Date.now().toString());
    } catch (e) {
      // Storage safety
    }
  }, [pathname]);

  // 2. Track window visibility / background minimization & scroll position
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saveCurrentState = () => {
      if (pathname.startsWith("/admin") || pathname.startsWith("/checkout/success")) return;
      const currentUrl = pathname + (window.location.search || "");
      try {
        localStorage.setItem("nailexpress_last_route", currentUrl);
        localStorage.setItem("nailexpress_last_scroll", (window.scrollY || 0).toString());
        localStorage.setItem("nailexpress_last_active_time", Date.now().toString());
      } catch (e) {}
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveCurrentState();
      } else if (document.visibilityState === "visible") {
        // App resumed from background: restore exact scroll position if on same page
        try {
          const savedScroll = localStorage.getItem("nailexpress_last_scroll");
          if (savedScroll && parseInt(savedScroll, 10) > 0) {
            setTimeout(() => {
              window.scrollTo({
                top: parseInt(savedScroll, 10),
                behavior: "instant"
              });
            }, 100);
          }
        } catch (e) {}
      }
    };

    const handleBeforeUnload = () => {
      saveCurrentState();
    };

    const handleScroll = () => {
      try {
        localStorage.setItem("nailexpress_last_scroll", (window.scrollY || 0).toString());
      } catch (e) {}
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handleBeforeUnload);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check on initial cold start (e.g. if PWA opened at "/" but was minimized elsewhere within last 12 hours)
    try {
      const isStandalone =
        (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
        Boolean(window.navigator.standalone);

      if (isStandalone && pathname === "/") {
        const lastRoute = localStorage.getItem("nailexpress_last_route");
        const lastActive = localStorage.getItem("nailexpress_last_active_time");
        if (lastRoute && lastRoute !== "/" && lastActive) {
          const hoursAgo = (Date.now() - parseInt(lastActive, 10)) / (1000 * 60 * 60);
          if (hoursAgo < 12) {
            // Restore last active route
            window.location.replace(lastRoute);
          }
        }
      }
    } catch (e) {}

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handleBeforeUnload);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return null;
}

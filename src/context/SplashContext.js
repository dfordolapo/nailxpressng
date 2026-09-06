"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const SplashContext = createContext({
  isSplashComplete: true,
  setSplashComplete: () => {},
});

export function SplashProvider({ children }) {
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    // Check if user already saw splash within the last 24 hours
    try {
      if (typeof window !== "undefined") {
        const match = document.cookie.match(new RegExp('(^| )hasSeenSplashTimestamp=([^;]+)'));
        const cookieTime = match ? parseInt(match[2], 10) : null;
        const localTime = window.localStorage ? parseInt(localStorage.getItem("lastSeenSplashTimestamp") || "0", 10) : null;
        const lastSeen = cookieTime || localTime;

        if (lastSeen) {
          const hoursSinceLastSeen = (Date.now() - lastSeen) / (1000 * 60 * 60);
          if (hoursSinceLastSeen < 24) {
            setIsSplashComplete(true);
          }
        }
      }
    } catch (e) {
      // Storage access safety
    }
  }, []);

  return (
    <SplashContext.Provider value={{ isSplashComplete, setIsSplashComplete }}>
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  return useContext(SplashContext);
}

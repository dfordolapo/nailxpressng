"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const SplashContext = createContext({
  isSplashComplete: true,
  setSplashComplete: () => {},
});

export function SplashProvider({ children }) {
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    // Check if user already saw splash in this session
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        if (sessionStorage.getItem("hasSeenSplash")) {
          setIsSplashComplete(true);
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

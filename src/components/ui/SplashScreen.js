"use client";

import { useState, useEffect } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="splash-screen"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FAF8F5",
        transition: "opacity 0.4s ease-out",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      onTransitionEnd={() => {
        if (!visible) {
          const el = document.getElementById("splash-screen");
          if (el) el.remove();
        }
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: visible ? "scale(1)" : "scale(0.9)",
          opacity: visible ? 1 : 0,
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="80" height="80" rx="16" fill="#D4AF7A" />
          <text
            x="40"
            y="52"
            textAnchor="middle"
            fontFamily="'Cormorant Upright', Georgia, serif"
            fontWeight="600"
            fontSize="32"
            fill="white"
          >
            NX
          </text>
        </svg>
      </div>
    </div>
  );
}

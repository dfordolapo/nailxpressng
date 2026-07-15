"use client";

import { useState, useEffect } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes splashFadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes splashPulse {
          0%, 100% { filter: drop-shadow(0 0 0px rgba(212,175,122,0)); }
          50% { filter: drop-shadow(0 0 12px rgba(212,175,122,0.5)); }
        }
        @keyframes splashShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes splashTextFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      ` }} />
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
          transition: "opacity 0.5s ease-out",
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
            gap: "16px",
            animation: "splashFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >
          <div style={{ animation: "splashPulse 1.2s ease-in-out infinite" }}>
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
          <span
            style={{
              fontFamily: "'Cormorant Upright', Georgia, serif",
              fontSize: "18px",
              fontWeight: 500,
              color: "#7a403d",
              letterSpacing: "2px",
              animation: "splashTextFadeIn 0.5s ease-out 0.3s both",
            }}
          >
            NAIL EXPRESS
          </span>
        </div>
      </div>
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashAnimation() {
  const [show, setShow] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Only show once per session so it doesn't annoy users while navigating
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setShow(false);
      return;
    }

    sessionStorage.setItem("hasSeenSplash", "true");

    // Check if running as an installed PWA (standalone) or in normal browser
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    const holdTime = isStandalone ? 500 : 1300;

    const timer1 = setTimeout(() => {
      setAnimate(true);
    }, holdTime);

    const timer2 = setTimeout(() => {
      setShow(false);
    }, holdTime + 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        backgroundColor: "#F5E3E5", // Hero section blush pink
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: animate ? 0 : 1,
        pointerEvents: animate ? "none" : "all",
        transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes splashPulse {
          0%, 100% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.85; }
        }
        @keyframes splashFloat {
          0% { transform: translateY(12px) scale(0.92); opacity: 0; }
          60% { transform: translateY(-4px) scale(1.02); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>

      {/* Pulsing ambient glow behind logo */}
      <div
        style={{
          position: "absolute",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(245,227,229,0) 70%)",
          animation: "splashPulse 2.4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 24px",
          transform: animate ? "scale(1.12)" : "scale(1)",
          opacity: animate ? 0 : 1,
          transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-in-out",
          animation: "splashFloat 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <Image
          src="/images/splash-logo.png"
          alt="Nailexpress Logo"
          width={320}
          height={205}
          priority
          style={{
            objectFit: "contain",
            maxWidth: "85vw",
            height: "auto",
            filter: "drop-shadow(0 14px 28px rgba(122, 64, 61, 0.18))",
          }}
        />
      </div>
    </div>
  );
}

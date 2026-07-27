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

    // Check if running as an installed PWA (standalone) or just in the normal Safari browser
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    const holdTime = isStandalone ? 400 : 1200; // Fast handoff for PWA, longer showcase for browser

    // Hold the static frame
    const timer1 = setTimeout(() => {
      setAnimate(true);
    }, holdTime);

    // Completely remove it from the DOM after the animation finishes
    const timer2 = setTimeout(() => {
      setShow(false);
    }, holdTime + 1000);

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
        background: "radial-gradient(circle at 50% 45%, #FEF3F4 0%, #FADCDD 55%, #F4C4C7 85%, #EAAFB3 100%)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: animate ? 0 : 1,
        pointerEvents: animate ? "none" : "all",
        transition: "opacity 0.8s ease-in-out",
      }}
    >
      <div
        style={{
          transform: animate ? "scale(1.15)" : "scale(1)",
          opacity: animate ? 0 : 1,
          transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-in-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <Image
          src="/images/splash-logo.png"
          alt="Nailexpress Logo"
          width={300}
          height={192}
          priority
          style={{ objectFit: "contain", maxWidth: "85vw", height: "auto", filter: "drop-shadow(0 12px 28px rgba(212, 136, 142, 0.35))" }}
        />
      </div>
    </div>
  );
}

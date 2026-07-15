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

    // Hold the static frame for a tiny moment to ensure smooth handoff from the native splash
    const timer1 = setTimeout(() => {
      setAnimate(true);
    }, 400);

    // Completely remove it from the DOM after the animation finishes
    const timer2 = setTimeout(() => {
      setShow(false);
    }, 1400);

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
        backgroundColor: "#FAF8F5",
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
          transform: animate ? "scale(1.3)" : "scale(1)",
          opacity: animate ? 0 : 1,
          transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-in-out",
        }}
      >
        <Image
          src="/icons/icon-512x512.png"
          alt="Nailexpress Logo"
          width={180}
          height={180}
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

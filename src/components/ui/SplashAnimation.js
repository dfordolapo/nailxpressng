"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashAnimation() {
  const [show, setShow] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

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
    const holdTime = isStandalone ? 2800 : 4000;

    const timer1 = setTimeout(() => {
      setAnimateOut(true);
    }, holdTime);

    const timer2 = setTimeout(() => {
      setShow(false);
    }, holdTime + 1200);

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
        width: "100vw",
        height: "100vh",
        backgroundColor: "#F5E3E5", // Hero section blush pink
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: animateOut ? 0 : 1,
        pointerEvents: animateOut ? "none" : "all",
        transition: "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: animateOut ? "scale(1.08)" : "scale(1)",
      }}
    >
      <style>{`
        /* ── Satin Wave Ripples ── */
        @keyframes satinRipple1 {
          0% { transform: scale(0.5); opacity: 0.85; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes satinRipple2 {
          0% { transform: scale(0.3); opacity: 0.7; }
          100% { transform: scale(1.9); opacity: 0; }
        }

        /* ── 3D Logo Entrance ── */
        @keyframes logo3DEntrance {
          0% {
            transform: perspective(1000px) rotateX(28deg) rotateY(-22deg) scale(0.65) translateY(45px);
            opacity: 0;
            filter: blur(8px) drop-shadow(0 25px 35px rgba(122, 64, 61, 0.35));
          }
          65% {
            transform: perspective(1000px) rotateX(-6deg) rotateY(4deg) scale(1.06) translateY(-10px);
            opacity: 1;
            filter: blur(0px) drop-shadow(0 15px 35px rgba(122, 64, 61, 0.25));
          }
          100% {
            transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0);
            opacity: 1;
            filter: blur(0px) drop-shadow(0 12px 28px rgba(122, 64, 61, 0.2));
          }
        }

        /* ── Gentle Floating Motion ── */
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1.2deg); }
        }

        /* ── Gold Metallic Shimmer Sweep ── */
        @keyframes goldShimmerSweep {
          0% { transform: translateX(-150%) rotate(25deg); opacity: 0; }
          30% { opacity: 0.85; }
          70% { opacity: 0.85; }
          100% { transform: translateX(220%) rotate(25deg); opacity: 0; }
        }

        /* ── Sparkle Twinkle ── */
        @keyframes sparkleTwinkle {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.4) rotate(180deg); opacity: 1; }
        }

        /* ── Floating Gold Particle ── */
        @keyframes particleRise {
          0% { transform: translateY(100vh) scale(0.4); opacity: 0; }
          30% { opacity: 0.9; }
          80% { opacity: 0.7; }
          100% { transform: translateY(-20vh) scale(1.3); opacity: 0; }
        }
      `}</style>

      {/* Background Satin Wave 1 */}
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          border: "2px solid rgba(211, 159, 153, 0.45)",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(245, 227, 229, 0) 70%)",
          animation: "satinRipple1 2.8s cubic-bezier(0.1, 0.8, 0.3, 1) infinite",
          pointerEvents: "none",
        }}
      />

      {/* Background Satin Wave 2 */}
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          border: "1px dashed rgba(255, 255, 255, 0.8)",
          background: "radial-gradient(circle, rgba(255, 242, 244, 0.85) 0%, rgba(245, 227, 229, 0) 65%)",
          animation: "satinRipple2 2.8s cubic-bezier(0.1, 0.8, 0.3, 1) 0.7s infinite",
          pointerEvents: "none",
        }}
      />

      {/* Floating Gold Sparkle Particles */}
      {[
        { left: "12%", delay: "0s", duration: "4.2s", size: "9px" },
        { left: "26%", delay: "1.1s", duration: "5.1s", size: "13px" },
        { left: "52%", delay: "0.4s", duration: "4.4s", size: "11px" },
        { left: "74%", delay: "1.6s", duration: "3.9s", size: "8px" },
        { left: "89%", delay: "0.7s", duration: "5.3s", size: "15px" },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.left,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "radial-gradient(circle, #FFE49E 0%, #D39F99 80%)",
            boxShadow: "0 0 12px #FFD700, 0 0 24px #FFA8B6",
            animation: `particleRise ${p.duration} ease-in-out ${p.delay} infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Twinkling 4-Point Star Sparkles */}
      {[
        { top: "26%", left: "20%", delay: "0.2s" },
        { top: "20%", right: "22%", delay: "0.6s" },
        { bottom: "28%", left: "28%", delay: "1.0s" },
        { bottom: "22%", right: "20%", delay: "0.4s" },
      ].map((s, idx) => (
        <svg
          key={idx}
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            width: "28px",
            height: "28px",
            fill: "#FFD700",
            filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.9))",
            animation: `sparkleTwinkle 1.7s ease-in-out ${s.delay} infinite`,
            pointerEvents: "none",
          }}
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      ))}

      {/* 3D Animated Logo Container */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "logo3DEntrance 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards, gentleFloat 3s ease-in-out 1.1s infinite",
        }}
      >
        <div style={{ position: "relative", overflow: "hidden", borderRadius: "16px", padding: "10px" }}>
          {/* Main Logo Image */}
          <Image
            src="/images/splash-logo.png"
            alt="Nailexpress Logo"
            width={350}
            height={223}
            priority
            style={{
              objectFit: "contain",
              maxWidth: "85vw",
              height: "auto",
              filter: "drop-shadow(0 16px 32px rgba(122, 64, 61, 0.22))",
            }}
          />

          {/* Diagonal Metallic Gold Light Sweep Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "60%",
              height: "100%",
              background: "linear-gradient(90deg, transparent 0%, rgba(255, 235, 175, 0.65) 50%, transparent 100%)",
              transform: "skewX(-25deg)",
              animation: "goldShimmerSweep 2.2s ease-in-out 0.5s infinite",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}

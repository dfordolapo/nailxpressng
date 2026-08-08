"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./VideoSection.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

export default function VideoSection({ 
  videoSrc = "/images/salon-tutorial.mp4"
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const attemptPlay = () => {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log("PWA autoplay fallback:", err);
          });
        }
      }
    };

    attemptPlay();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        attemptPlay();
      }
    };

    const handleTouch = () => {
      attemptPlay();
      window.removeEventListener("touchstart", handleTouch);
    };

    video.addEventListener("loadeddata", attemptPlay);
    video.addEventListener("canplay", attemptPlay);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("touchstart", handleTouch, { passive: true });

    return () => {
      video.removeEventListener("loadeddata", attemptPlay);
      video.removeEventListener("canplay", attemptPlay);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  return (
    <section className={styles.fullWidthSection} id="video-section">
      {/* Top Gradient Overlay */}
      <div className={styles.topGradient} aria-hidden="true" />
      
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          poster="/images/measure-guide.png"
        >
          <source src={videoSrc} type="video/mp4" />
          <source src="/videos/salon-tutorial.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-applying-nail-polish-40899-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Button overlay — sits on the section so it's full-width, not constrained by video wrapper */}
      <div className={styles.overlay}>
        <Link
          href="/shop"
          className={styles.ctaBtn}
        >
          Shop the Collection
        </Link>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className={styles.bottomGradient} aria-hidden="true" />
    </section>
  );
}

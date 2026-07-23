"use client";

import React, { useEffect, useRef } from "react";
import styles from "./VideoSection.module.css";

export default function VideoSection({ 
  videoSrc = "/images/salon-tutorial.mp4"
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Autoplay handled:", err);
        });
      }
    }
  }, []);

  return (
    <section className={styles.section} id="video-section">
      <div className="container">
        <div className={styles.videoCard}>
          {/* Organic gold stroke frame with SVG torn-paper filter */}
          <div className={styles.strokeFrame} aria-hidden="true" />

          {/* Clean video container (unaffected by filter) */}
          <div className={styles.videoInner}>
            <video
              ref={videoRef}
              className={styles.video}
              autoPlay
              loop
              muted
              playsInline
              controls
              poster="/images/measure-guide.png"
            >
              <source src={videoSrc} type="video/mp4" />
              <source src="/videos/salon-tutorial.mp4" type="video/mp4" />
              <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-applying-nail-polish-40899-large.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      {/* SVG Filter for organic torn paper edge effect matching CategoryShowcase */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <filter id="torn-paper-video">
          <feTurbulence type="fractalNoise" baseFrequency="0.075" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </section>
  );
}

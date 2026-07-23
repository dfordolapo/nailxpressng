"use client";

import React from "react";
import styles from "./VideoSection.module.css";

export default function VideoSection({ 
  videoSrc = "/videos/salon-tutorial.mp4"
}) {
  return (
    <section className={styles.section} id="video-section">
      <div className="container">
        <div className={styles.videoWrapper}>
          <video
            className={styles.video}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            controls
          />
        </div>
      </div>
    </section>
  );
}

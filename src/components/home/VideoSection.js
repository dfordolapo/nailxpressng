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
        <div className={styles.videoWrapper}>
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
            <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-applying-nail-polish-40899-large.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-painting-her-nails-40897-large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}

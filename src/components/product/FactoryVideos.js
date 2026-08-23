"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./FactoryVideos.module.css";

const VIDEOS = [
  "IMG_3441.mp4", "IMG_3450.mp4", "IMG_3437.mp4", "IMG_3445.mp4", 
  "IMG_3427.mp4", "IMG_3455.mp4", "IMG_3435.mp4", "IMG_3446.mp4", 
  "IMG_3433.mp4", "IMG_3439.mp4", "IMG_3440.mp4", "IMG_3426.mp4", 
  "IMG_3442.mp4", "IMG_3451.mp4", "IMG_3438.mp4"
];

export default function FactoryVideos() {
  const [shuffledVideos, setShuffledVideos] = useState(VIDEOS);

  useEffect(() => {
    // Shuffle the videos array on client-side
    const shuffle = [...VIDEOS].sort(() => Math.random() - 0.5);
    setShuffledVideos(shuffle);
  }, []);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Perfection in Motion</h2>
          <p className={styles.subtitle}>Get a closer look at our ready-to-wear sets.</p>
        </div>
      </div>
      
      <div className={styles.carousel}>
        {shuffledVideos.map((videoName, idx) => (
          <VideoCard key={idx} src={`/images/factory-made/${videoName}`} />
        ))}
      </div>
    </section>
  );
}

function VideoCard({ src }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div 
      className={styles.videoCard}
      onClick={() => {
        if (videoRef.current) {
          if (videoRef.current.paused) videoRef.current.play();
          else videoRef.current.pause();
        }
      }}
    >
      <video
        ref={videoRef}
        src={`${src}#t=0.001`}
        preload="metadata"
        className={styles.video}
        loop
        muted
        playsInline
      />
      <div className={styles.playIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </div>
    </div>
  );
}

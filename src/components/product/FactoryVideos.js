"use client";

import React, { useRef } from "react";
import styles from "./FactoryVideos.module.css";

const VIDEOS = [
  "IMG_3441.MOV", "IMG_3450.MOV", "IMG_3437.MOV", "IMG_3445.MOV", 
  "IMG_3427.MOV", "IMG_3455.MOV", "IMG_3435.MOV", "IMG_3446.MOV", 
  "IMG_3433.MOV", "IMG_3439.MOV", "IMG_3440.MOV", "IMG_3426.MOV", 
  "IMG_3442.MOV", "IMG_3451.MOV", "IMG_3438.MOV"
];

export default function FactoryVideos() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Perfection in Motion</h2>
          <p className={styles.subtitle}>Get a closer look at our flawless factory sets.</p>
        </div>
      </div>
      
      <div className={styles.carousel}>
        {VIDEOS.map((videoName, idx) => (
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
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
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
        className={styles.video}
        loop
        muted
        playsInline
        preload="metadata"
      />
      <div className={styles.playIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </div>
    </div>
  );
}

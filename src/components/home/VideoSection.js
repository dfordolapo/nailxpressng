"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, Clock, CheckCircle } from "lucide-react";
import styles from "./VideoSection.module.css";

const TIMESTAMPS = [
  { time: "0:05", title: "Prep & Clean", desc: "Push cuticles & wipe natural nails" },
  { time: "0:25", title: "Select Size", desc: "Find your perfect tip size" },
  { time: "0:45", title: "Apply Adhesive", desc: "Use glue or sticky tabs" },
  { time: "1:15", title: "Press & Hold", desc: "Hold firmly for 30 seconds" },
];

export default function VideoSection({ 
  videoSrc = "https://assets.mixkit.co/videos/preview/mixkit-woman-applying-nail-polish-40899-large.mp4",
  posterSrc = "/images/apply.png"
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className={styles.section} id="video-tutorial-section">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.badge}>
            <Sparkles size={14} /> Quick Video Guide
          </span>
          <h2 className={styles.title}>Watch Press-On Application in Action</h2>
          <p className={styles.subtitle}>
            Get flawless, 3-week salon results at home in under 10 minutes.
          </p>
        </div>

        <div className={styles.videoContainer}>
          <div className={styles.videoWrapper} onClick={togglePlay}>
            <video
              ref={videoRef}
              className={styles.video}
              src={videoSrc}
              poster={posterSrc}
              playsInline
              loop
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {!isPlaying && (
              <div className={styles.playOverlay}>
                <button
                  className={styles.playBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  aria-label="Play video"
                >
                  <Play size={32} fill="white" style={{ marginLeft: "4px" }} />
                </button>
                <span className={styles.playText}>Click to Watch Tutorial</span>
              </div>
            )}

            <div className={styles.controlsBar} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.controlBtn}
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>

              <div className={styles.videoTitleBar}>
                <span>How To Apply Nailexpress Press-Ons</span>
              </div>

              <button
                className={styles.controlBtn}
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.timestampsGrid}>
            {TIMESTAMPS.map((item, idx) => (
              <div key={idx} className={styles.timestampCard}>
                <div className={styles.timestampHeader}>
                  <span className={styles.timeTag}>
                    <Clock size={12} /> {item.time}
                  </span>
                  <CheckCircle size={16} className={styles.checkIcon} />
                </div>
                <h4 className={styles.stepTitle}>{item.title}</h4>
                <p className={styles.stepDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

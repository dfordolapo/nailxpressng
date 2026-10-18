"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { ArrowUpRight, ArrowRight, X, Check } from "lucide-react";
import styles from "@/styles/components/drop-timer.module.css";

function calculateTimeLeft(targetDate) {
  if (!targetDate) return null;
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export default function DropCountdownBar({ collections: passedCollections = null, onActiveChange = null }) {
  const [collections, setCollections] = useState(passedCollections || []);
  const [now, setNow] = useState(Date.now());
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const emailInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (passedCollections && Array.isArray(passedCollections) && passedCollections.length > 0) {
      setCollections(passedCollections);
    }
  }, [passedCollections]);

  // Always keep collections updated from API
  useEffect(() => {
    let active = true;

    async function loadCollections() {
      try {
        const res = await fetch("/api/collections");
        const data = await res.json();
        if (active && data.collections && Array.isArray(data.collections)) {
          setCollections(data.collections);
        }
      } catch (e) {
        console.error("Failed to load drop timer collections:", e);
      }
    }

    loadCollections();
    return () => { active = false; };
  }, []);

  // Live 1-second interval
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Find nearest upcoming drop collection
  const activeDrop = useMemo(() => {
    if (!collections || collections.length === 0) return null;

    const upcoming = collections.filter(c => {
      if (!c.drop_timer_enabled || !c.drop_date) return false;
      const dropTime = new Date(c.drop_date).getTime();
      return dropTime > now;
    }).sort((a, b) => new Date(a.drop_date).getTime() - new Date(b.drop_date).getTime());

    return upcoming.length > 0 ? upcoming[0] : null;
  }, [collections, now]);

  const isCurrentlyActive = Boolean(activeDrop);

  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(isCurrentlyActive);
    }
  }, [isCurrentlyActive, onActiveChange]);

  // Close modal on Escape key
  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  // Focus input when notify form opens
  useEffect(() => {
    if (showNotifyForm && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [showNotifyForm]);

  if (!mounted || !isCurrentlyActive) return null;

  const timeLeft = calculateTimeLeft(activeDrop.drop_date);
  if (!timeLeft) return null;

  const format2 = (n) => String(n).padStart(2, "0");
  const collectionName = activeDrop.name || "The After Hours Edit";
  const collectionDesc = activeDrop.tagline || activeDrop.description || "Bolder shades. Deeper moods. A collection made for late nights, long plans, and everything in between.";
  const collectionImg = activeDrop.image || "/images/drop-editorial.jpg";

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: `Drop Notification: ${collectionName}`,
        }),
      });
      setSubscribed(true);
    } catch (err) {
      console.error("Failed to subscribe:", err);
      setSubscribed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Top Announcement Banner ────────────────────────────────── */}
      <div 
        className={styles.bannerBar} 
        role="region" 
        aria-label="Upcoming Collection Drop"
      >
        <div className={styles.bannerInner}>
          {/* Desktop Left: NEXT COLLECTION — Title */}
          <div className={styles.desktopLeft}>
            <span className={styles.nextLabel}>NEXT COLLECTION</span>
            <span className={styles.dash} aria-hidden="true">—</span>
            <span className={styles.collectionTitle}>{collectionName}</span>
          </div>

          {/* Desktop Center/Right: Timer + VIEW DROP Button */}
          <div className={styles.desktopRight}>
            <div 
              className={styles.timerDisplay} 
              aria-label={`Unlocks in ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
            >
              <div className={styles.timerUnit}>
                <span className={styles.timerDigits}>{format2(timeLeft.days)}</span>
                <span className={styles.timerLabel}>DAYS</span>
              </div>
              <div className={styles.timerUnit}>
                <span className={styles.timerDigits}>{format2(timeLeft.hours)}</span>
                <span className={styles.timerLabel}>HOURS</span>
              </div>
              <div className={styles.timerUnit}>
                <span className={styles.timerDigits}>{format2(timeLeft.minutes)}</span>
                <span className={styles.timerLabel}>MINS</span>
              </div>
              <div className={styles.timerUnit}>
                <span key={timeLeft.seconds} className={`${styles.timerDigits} ${styles.tickPulse}`}>
                  {format2(timeLeft.seconds)}
                </span>
                <span className={styles.timerLabel}>SECS</span>
              </div>
            </div>

            <button 
              type="button" 
              className={styles.viewDropBtn}
              onClick={() => setModalOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={modalOpen}
            >
              <span>VIEW DROP</span>
              <ArrowUpRight size={13} strokeWidth={2.4} className={styles.arrowIcon} />
            </button>
          </div>

          {/* Mobile Single-line Banner: Title  06 : 14 : 27 : 03  → */}
          <div 
            className={styles.mobileBanner}
            onClick={() => setModalOpen(true)}
            role="button"
            tabIndex={0}
            aria-label={`View drop for ${collectionName}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setModalOpen(true); }}
          >
            <span className={styles.mobileTitle}>{collectionName}</span>
            <div className={styles.mobileClock}>
              <span>{format2(timeLeft.days)} : {format2(timeLeft.hours)} : {format2(timeLeft.minutes)} : {format2(timeLeft.seconds)}</span>
            </div>
            <ArrowRight size={13} strokeWidth={2.2} className={styles.mobileArrow} />
          </div>
        </div>
      </div>

      {/* ── Drop Teaser Modal ──────────────────────────────────────── */}
      {modalOpen && (
        <div 
          className={styles.modalBackdrop} 
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drop-modal-title"
        >
          <div 
            className={styles.modalCard} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              type="button" 
              className={styles.modalCloseBtn}
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
            >
              <X size={18} strokeWidth={2} />
            </button>

            {/* Left Column: Editorial Image */}
            <div 
              className={styles.modalImageCol} 
              style={{ backgroundImage: `url(${collectionImg})` }}
              role="img"
              aria-label={collectionName}
            />

            {/* Right Column: Editorial Drop Details */}
            <div className={styles.modalContentCol}>
              <div className={styles.modalSubheading}>
                UPCOMING COLLECTION
              </div>

              <h2 id="drop-modal-title" className={styles.modalTitle}>
                {collectionName}
              </h2>

              <p className={styles.modalDescription}>
                {collectionDesc}
              </p>

              {/* Modal Segmented Timer */}
              <div className={styles.modalTimerGrid}>
                <div className={styles.modalTimerUnit}>
                  <div className={styles.modalDigits}>{format2(timeLeft.days)}</div>
                  <div className={styles.modalLabel}>DAYS</div>
                </div>
                <div className={styles.modalTimerUnit}>
                  <div className={styles.modalDigits}>{format2(timeLeft.hours)}</div>
                  <div className={styles.modalLabel}>HOURS</div>
                </div>
                <div className={styles.modalTimerUnit}>
                  <div className={styles.modalDigits}>{format2(timeLeft.minutes)}</div>
                  <div className={styles.modalLabel}>MINS</div>
                </div>
                <div className={styles.modalTimerUnit}>
                  <div key={timeLeft.seconds} className={`${styles.modalDigits} ${styles.tickPulse}`}>
                    {format2(timeLeft.seconds)}
                  </div>
                  <div className={styles.modalLabel}>SECS</div>
                </div>
              </div>

              {/* Micro-Interaction Notify Me Section */}
              <div className={styles.modalActionWrap}>
                {subscribed ? (
                  <div className={styles.notifySuccess}>
                    <Check size={16} strokeWidth={2.5} />
                    <span>You&apos;re on the VIP list. We&apos;ll notify you at launch.</span>
                  </div>
                ) : showNotifyForm ? (
                  <form onSubmit={handleNotifySubmit} className={styles.notifyForm}>
                    <input 
                      ref={emailInputRef}
                      type="email" 
                      required 
                      placeholder="Enter your email address" 
                      className={styles.notifyInput}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <button 
                      type="submit" 
                      className={styles.notifySubmitBtn}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Notify Me"}
                    </button>
                  </form>
                ) : (
                  <button 
                    type="button" 
                    className={styles.notifyPillBtn}
                    onClick={() => setShowNotifyForm(true)}
                  >
                    NOTIFY ME
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

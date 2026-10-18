"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
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

export default function CollectionTeaserScreen({ category, onUnlock }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(category?.drop_date));
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const emailInputRef = useRef(null);

  useEffect(() => {
    const check = () => {
      const remaining = calculateTimeLeft(category?.drop_date);
      if (!remaining) {
        setTimeLeft(null);
        if (onUnlock) onUnlock();
      } else {
        setTimeLeft(remaining);
      }
    };

    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [category?.drop_date, onUnlock]);

  useEffect(() => {
    if (showNotifyForm && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [showNotifyForm]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubmitting(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          type: "drop_notification",
          collectionId: category?.id ? String(category.id) : null,
          collectionName: category?.name || "Collection",
        }),
      });
      setSubscribed(true);
    } catch (err) {
      console.error("Waitlist subscribe error:", err);
      setSubscribed(true);
    } finally {
      setSubmitting(false);
    }
  };

  const format2 = (n) => String(n ?? 0).padStart(2, "0");
  const collectionImg = category?.image || "/images/drop-editorial.jpg";
  const collectionDesc = category?.tagline || category?.description || "Bolder shades. Deeper moods. A collection made for late nights, long plans, and everything in between.";

  return (
    <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
      <div className={styles.modalCard} style={{ margin: "0 auto", position: "relative" }}>
        {/* Left Column: Full Bleed Editorial Photography */}
        <div 
          className={styles.modalImageCol} 
          style={{ backgroundImage: `url(${collectionImg})` }}
          role="img"
          aria-label={category?.name || "Collection Drop"}
        />

        {/* Right Column: Editorial Drop Content */}
        <div className={styles.modalContentCol}>
          <div className={styles.modalSubheading}>
            UPCOMING COLLECTION
          </div>

          <h1 className={styles.modalTitle}>
            {category?.name || "New Collection"}
          </h1>

          <p className={styles.modalDescription}>
            {collectionDesc}
          </p>

          {/* Stacked Numbers above Labels */}
          {timeLeft && (
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
          )}

          {/* Micro-Interaction Notify Me Section */}
          <div className={styles.modalActionWrap}>
            {subscribed ? (
              <div className={styles.notifySuccess}>
                <Check size={16} strokeWidth={2.5} />
                <span>You&apos;re on the VIP list. We&apos;ll notify you at launch.</span>
              </div>
            ) : showNotifyForm ? (
              <form onSubmit={handleSubscribe} className={styles.notifyForm}>
                <input
                  ref={emailInputRef}
                  type="email"
                  required
                  placeholder="Enter your email"
                  className={styles.notifyInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
                <button 
                  type="submit" 
                  className={styles.notifySubmitBtn} 
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Notify Me"}
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

          <div style={{ marginTop: "28px" }}>
            <Link 
              href="/shop" 
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#FFFFFF"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            >
              <span>Browse ready-to-wear sets</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

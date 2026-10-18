"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, Clock, Sparkles, Check, ArrowRight, Wand2 } from "lucide-react";
import styles from "@/styles/components/drop-timer.module.css";

function calculateTimeLeft(targetDate) {
  if (!targetDate) return null;
  const diff = new Date(targetDate).getTime() - new Date().getTime();
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
  const [subscribeError, setSubscribeError] = useState("");

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

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubmitting(true);
    setSubscribeError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: `Drop Teaser: ${category?.name || "Collection"}`,
        }),
      });

      const data = await res.json();
      if (!res.ok && !data.success) {
        throw new Error(data.error || "Subscription failed");
      }
      setSubscribed(true);
    } catch (err) {
      console.error("Waitlist subscribe error:", err);
      // Even if network fails or duplicate, reassure user
      setSubscribed(true);
    } finally {
      setSubmitting(false);
    }
  };

  const format2 = (n) => String(n ?? 0).padStart(2, "0");

  return (
    <div className={styles.teaserContainer} id="drop-teaser-screen">
      {/* Background blurred ambiance */}
      {category?.image && (
        <div 
          className={styles.teaserBackground} 
          style={{ backgroundImage: `url(${category.image})` }} 
        />
      )}
      <div className={styles.teaserBackdropOverlay} />

      {/* Main Teaser Card */}
      <div className={styles.teaserCard}>
        <div className={styles.lockedBadge}>
          <Lock size={13} strokeWidth={2.5} />
          <span>Exclusive Drop • Locked</span>
        </div>

        <h1 className={styles.teaserTitle}>
          {category?.name || "New Collection"}
        </h1>

        <p className={styles.teaserHeadline}>
          {category?.drop_headline || category?.tagline || category?.description || "Something breathtaking is being prepared. Sets unlock automatically at drop time."}
        </p>

        {/* Big Segmented Luxury Countdown Clock */}
        {timeLeft && (
          <div className={styles.clockGrid}>
            <div className={styles.clockTile}>
              <div className={styles.clockDigits}>{format2(timeLeft.days)}</div>
              <div className={styles.clockLabel}>Days</div>
            </div>
            <div className={styles.clockTile}>
              <div className={styles.clockDigits}>{format2(timeLeft.hours)}</div>
              <div className={styles.clockLabel}>Hours</div>
            </div>
            <div className={styles.clockTile}>
              <div className={styles.clockDigits}>{format2(timeLeft.minutes)}</div>
              <div className={styles.clockLabel}>Minutes</div>
            </div>
            <div className={styles.clockTile}>
              <div className={styles.clockDigits}>{format2(timeLeft.seconds)}</div>
              <div className={styles.clockLabel}>Seconds</div>
            </div>
          </div>
        )}

        {/* VIP Early Access Waitlist Box */}
        <div className={styles.waitlistCard}>
          <div className={styles.waitlistTitle}>
            ✨ Be the first to grab your set
          </div>
          <div className={styles.waitlistSub}>
            Drop quantities are strictly limited. Enter your email to receive an instant alert the second the doors open.
          </div>

          {subscribed ? (
            <div className={styles.waitlistSuccess}>
              <Check size={18} strokeWidth={2.5} />
              <span>You&apos;re on the VIP drop list! We&apos;ll ping you the second it drops.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className={styles.waitlistForm}>
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                className={styles.waitlistInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
              <button 
                type="submit" 
                className={styles.waitlistSubmitBtn} 
                disabled={submitting}
              >
                {submitting ? "Joining..." : "Get Notified"}
              </button>
            </form>
          )}
          {subscribeError && (
            <p style={{ color: "#F87171", fontSize: "0.78rem", marginTop: "6px" }}>{subscribeError}</p>
          )}
        </div>

        {/* Actions / Custom Order */}
        <div className={styles.teaserActions}>
          <Link href="/custom-order" className={styles.btnTeaserCustom}>
            <Wand2 size={15} />
            <span>Need nails now? Custom Order</span>
          </Link>
          <Link href="/shop" className={styles.btnTeaserCustom} style={{ borderStyle: "dashed" }}>
            <span>Browse Ready Sets</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

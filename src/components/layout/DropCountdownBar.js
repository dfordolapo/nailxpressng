"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Timer, ChevronRight, X } from "lucide-react";
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

export default function DropCountdownBar({ collections: passedCollections = null, onActiveChange = null }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [collections, setCollections] = useState(passedCollections || []);
  const [dismissedId, setDismissedId] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (passedCollections && Array.isArray(passedCollections) && passedCollections.length > 0) {
      setCollections(passedCollections);
    }
  }, [passedCollections]);

  // Always fetch fresh collections on mount & route change
  useEffect(() => {
    if (isAdmin) return;
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
  }, [isAdmin, pathname]);

  // Keep live second-by-second countdown
  useEffect(() => {
    if (isAdmin || !mounted) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  // Find the nearest upcoming drop
  const activeDrop = useMemo(() => {
    if (!collections || collections.length === 0) return null;

    const upcoming = collections.filter(c => {
      if (!c.drop_timer_enabled || !c.drop_date) return false;
      const dropTime = new Date(c.drop_date).getTime();
      return dropTime > now;
    }).sort((a, b) => new Date(a.drop_date).getTime() - new Date(b.drop_date).getTime());

    return upcoming.length > 0 ? upcoming[0] : null;
  }, [collections, now]);

  // Check session storage dismissal
  useEffect(() => {
    if (activeDrop && typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem(`dismiss_drop_${activeDrop.id || activeDrop.slug}`);
      if (isDismissed) {
        setDismissedId(activeDrop.id || activeDrop.slug);
      }
    }
  }, [activeDrop]);

  const isCurrentlyActive = Boolean(!isAdmin && activeDrop && dismissedId !== (activeDrop.id || activeDrop.slug));

  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(isCurrentlyActive);
    }
  }, [isCurrentlyActive, onActiveChange]);

  if (!mounted || !isCurrentlyActive) return null;

  const timeLeft = calculateTimeLeft(activeDrop.drop_date);
  if (!timeLeft) return null;

  const format2 = (n) => String(n).padStart(2, "0");
  const collectionUrl = `/collection/${activeDrop.slug}`;

  const handleDismiss = () => {
    const idKey = activeDrop.id || activeDrop.slug;
    setDismissedId(idKey);
    try {
      sessionStorage.setItem(`dismiss_drop_${idKey}`, "true");
    } catch {}
  };

  return (
    <div className={styles.dropBar} role="region" aria-label="Collection Drop Countdown">
      <div className={styles.dropBarInner}>
        <div className={styles.dropBarContent}>
          <div className={styles.dropBadge}>
            <span className={styles.dropBadgePulse} />
            <Sparkles size={12} strokeWidth={2} />
            <span>Drop Soon</span>
          </div>

          <div className={styles.dropTitle}>
            <strong>{activeDrop.drop_headline || `${activeDrop.name} Collection`}</strong> drops in:
          </div>

          {/* Segmented Countdown Clock */}
          <div className={styles.countdownPills}>
            {timeLeft.days > 0 && (
              <>
                <span className={styles.pillSegment}>
                  <span className={styles.pillNum}>{format2(timeLeft.days)}</span>
                  <span className={styles.pillUnit}>d</span>
                </span>
                <span className={styles.pillSep}>:</span>
              </>
            )}
            <span className={styles.pillSegment}>
              <span className={styles.pillNum}>{format2(timeLeft.hours)}</span>
              <span className={styles.pillUnit}>h</span>
            </span>
            <span className={styles.pillSep}>:</span>
            <span className={styles.pillSegment}>
              <span className={styles.pillNum}>{format2(timeLeft.minutes)}</span>
              <span className={styles.pillUnit}>m</span>
            </span>
            <span className={styles.pillSep}>:</span>
            <span className={styles.pillSegment}>
              <span className={styles.pillNum}>{format2(timeLeft.seconds)}</span>
              <span className={styles.pillUnit}>s</span>
            </span>
          </div>
        </div>

        <div className={styles.dropBarActions}>
          <Link href={collectionUrl} className={styles.dropCtaBtn}>
            <span>View Drop</span>
            <ChevronRight size={13} strokeWidth={2.5} />
          </Link>
          <button 
            type="button" 
            onClick={handleDismiss} 
            className={styles.dismissBtn}
            aria-label="Dismiss banner"
            title="Dismiss announcement"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

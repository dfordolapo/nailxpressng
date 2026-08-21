"use client";
import { useState, useEffect } from "react";
import styles from "./InstallPrompt.module.css";
import { X, Download, Share } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isStandaloneNavigator = window.navigator.standalone === true;
      return isStandaloneMedia || isStandaloneNavigator;
    };

    setIsStandalone(checkStandalone());

    // Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Check if user dismissed prompt previously
    const dismissed = localStorage.getItem("nailexpress_pwa_dismissed");
    
    if (!checkStandalone() && !dismissed) {
      if (isIOSDevice) {
        // Show iOS prompt after a short delay
        setTimeout(() => setShowPrompt(true), 2500);
      }
    }

    // Android / Chrome event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed && !checkStandalone()) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again
    localStorage.setItem("nailexpress_pwa_dismissed", "true");
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className={styles.installBanner}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <img src="/icons/icon-192x192.png" alt="NailExpress App" className={styles.appIcon} />
        </div>
        <div className={styles.textContainer}>
          <h4 className={styles.title}>Install NailExpress</h4>
          <p className={styles.subtitle}>
            {isIOS 
              ? <>Tap <Share size={12} style={{display:'inline', verticalAlign:'middle', margin:'0 2px'}}/> then "Add to Home Screen"</>
              : "Install the web app for a faster, better experience."}
          </p>
        </div>
      </div>
      <div className={styles.actions}>
        {!isIOS && (
          <button className={styles.installBtn} onClick={handleInstallClick}>
            <Download size={14} /> Install
          </button>
        )}
        <button className={styles.closeBtn} onClick={handleDismiss} aria-label="Dismiss">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

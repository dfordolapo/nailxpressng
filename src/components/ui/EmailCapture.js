"use client";

import { useState } from "react";
import { Send, CheckCircle2, Sparkles, BellRing } from "lucide-react";
import { useToast } from "@/context/ToastContext";

import styles from "@/styles/components/email-capture.module.css";

export default function EmailCapture({ 
  type = "newsletter", 
  productId = null, 
  productName = null,
  compact = false 
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success'
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type, productId, productName })
      });

      if (!res.ok) throw new Error("Failed to subscribe");

      setStatus("success");
      showToast(type === "restock" ? "✓ We'll notify you when restocked!" : "✓ Welcome to the Inner Circle!");
      setEmail("");
    } catch (err) {
      console.error(err);
      showToast("Subscription error, please try again");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.successBox}>
        <span>You’re on the list! ✨</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${compact ? styles.formCompact : ""}`}>
      <div className={styles.inputGroup}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={type === "restock" ? "Your email..." : "Enter your email..."}
          disabled={status === "loading"}
          required
          className={styles.input}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={styles.btn}
        >
          {status === "loading" ? (
            "Saving..."
          ) : type === "restock" ? (
            <>
              <span>Alert Me</span>
              <BellRing size={11} strokeWidth={2} />
            </>
          ) : (
            <>
              <span>Join</span>
              <Send size={11} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

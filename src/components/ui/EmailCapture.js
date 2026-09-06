"use client";

import { useState } from "react";
import { Send, CheckCircle2, Sparkles, BellRing } from "lucide-react";
import { useToast } from "@/context/ToastContext";

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
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 18px",
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "24px",
        border: "1px solid #d3c5c4",
        color: "var(--color-primary-800, #7a403d)",
        fontSize: "0.85rem",
        fontWeight: 600
      }}>
        <CheckCircle2 size={16} color="#10B981" />
        {type === "restock" ? "You're on the restock notification list!" : "You're in! Check your inbox for your welcome note ✨"}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: compact ? "380px" : "440px", margin: "0 auto" }}>
      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        background: "#ffffff",
        borderRadius: "30px",
        padding: "4px 5px 4px 16px",
        border: "1px solid rgba(122, 64, 61, 0.25)",
        boxShadow: "0 4px 20px rgba(122, 64, 61, 0.08)",
        transition: "border-color 0.2s, box-shadow 0.2s"
      }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={type === "restock" ? "Enter email for restock alert..." : "Enter email for VIP drops & 10% off..."}
          disabled={status === "loading"}
          required
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "0.85rem",
            color: "#2d2d2d",
            background: "transparent",
            fontFamily: "inherit"
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            background: "var(--color-primary, #7a403d)",
            color: "#ffffff",
            border: "none",
            borderRadius: "24px",
            padding: "8px 16px",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: status === "loading" ? "not-allowed" : "pointer",
            transition: "all 0.2s ease"
          }}
        >
          {status === "loading" ? (
            "Joining..."
          ) : type === "restock" ? (
            <>
              <span>Notify Me</span>
              <BellRing size={13} />
            </>
          ) : (
            <>
              <span>Join</span>
              <Send size={13} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

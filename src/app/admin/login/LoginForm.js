"use client";

import { useState, useEffect } from "react";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import styles from "@/styles/login.module.css";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // If stay logged in or active session exists in client storage, never show the login modal
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasStoredStay = localStorage.getItem("admin_stay_logged_in") === "true";
      const hasCookie = document.cookie.includes("admin_stay_logged_in=true") || document.cookie.includes("admin_session=");
      
      if (hasStoredStay || hasCookie) {
        // Auto-resume session and redirect directly without rendering the login card
        fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ autoResume: true }),
        })
          .then(() => {
            window.location.replace("/admin");
          })
          .catch(() => {
            window.location.replace("/admin");
          });
        return;
      }
    }
    setCheckingSession(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          password: password,
          rememberMe: rememberMe,
        }),
      });

      let data = null;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.ok && data?.success) {
        if (rememberMe) {
          try { localStorage.setItem("admin_stay_logged_in", "true"); } catch {}
        } else {
          try { localStorage.removeItem("admin_stay_logged_in"); } catch {}
        }
        window.location.replace("/admin");
      } else {
        setError(data?.error || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If verifying session or stay-logged-in is active, suppress the login modal completely
  if (checkingSession) {
    return (
      <div className={styles.loginPage} aria-busy="true" aria-label="Loading admin session" />
    );
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <p className={styles.subtitle}>
          Welcome back, Queen.
        </p>

        <form onSubmit={handleLogin}>
          {error && (
            <p style={{ color: "var(--color-error)", marginBottom: "15px", fontSize: "0.95rem" }}>
              {error}
            </p>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <div style={{ position: "relative" }}>
              <User
                size={18}
                color="#888"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                className={styles.input}
                style={{ paddingLeft: "40px" }}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                color="#888"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                className={styles.input}
                style={{ paddingLeft: "40px", paddingRight: "42px" }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  color: "#777",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Stay Logged In Option */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                width: "17px",
                height: "17px",
                accentColor: "var(--color-primary)",
                cursor: "pointer",
              }}
            />
            <label
              htmlFor="rememberMe"
              style={{
                fontSize: "0.95rem",
                color: "var(--color-text)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Stay logged in
            </label>
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

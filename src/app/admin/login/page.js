"use client";

import { useState } from "react";
import { Lock, User } from "lucide-react";
import styles from "@/styles/login.module.css";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                }}
              />
              <input
                type="password"
                className={styles.input}
                style={{ paddingLeft: "40px" }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Stay Logged In / Remember Me Option */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
              textAlign: "left",
              cursor: "pointer",
            }}
            onClick={() => setRememberMe(!rememberMe)}
          >
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                width: "16px",
                height: "16px",
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

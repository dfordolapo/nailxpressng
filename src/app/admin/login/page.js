"use client";

import { useState } from "react";
import { Lock, User } from "lucide-react";
import styles from "@/styles/login.module.css";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Mock login validation
    setTimeout(() => {
      setLoading(false);
      if (name.trim().toLowerCase() === "funmi" && password === "123456") {
        router.push("/admin");
      } else {
        setError("Invalid username or password");
      }
    }, 1000);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>

        <p className={styles.subtitle}>
          Back to business.<br/>
          Log in to keep Nail Express running beautifully.
        </p>

        <form onSubmit={handleLogin}>
          {error && <p style={{ color: "var(--color-error)", marginBottom: "15px", fontSize: "0.95rem" }}>{error}</p>}
          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <div style={{ position: "relative" }}>
              <User size={18} color="#888" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text" 
                className={styles.input} 
                style={{ paddingLeft: "40px" }}
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} color="#888" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="password" 
                className={styles.input} 
                style={{ paddingLeft: "40px" }}
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Sparkles, Lock, Mail } from "lucide-react";
import styles from "@/styles/login.module.css";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock login for now, simply redirect to dashboard
    setTimeout(() => {
      setLoading(false);
      router.push("/admin");
    }, 1000);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          Nail Express <Sparkles size={24} />
        </div>
        
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "30px", fontSize: "0.95rem" }}>
          Welcome back, Queen. Sign in to your dashboard.
        </p>

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} color="#888" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="email" 
                className={styles.input} 
                style={{ paddingLeft: "40px" }}
                placeholder="admin@nailexpress.ng" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

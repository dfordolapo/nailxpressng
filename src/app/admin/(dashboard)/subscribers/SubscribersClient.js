"use client";

import { useState, useEffect } from "react";
import { Mail, Bell, RefreshCw, Send, CheckCircle, Users, Sparkles, Filter } from "lucide-react";
import styles from "@/styles/admin.module.css";

export default function SubscribersClient() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all"); // "all", "newsletter", "restock"
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers");
      const data = await res.json();
      if (data.subscribers) {
        setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filtered = subscribers.filter((sub) => {
    if (filterType === "all") return true;
    return sub.subscription_type === filterType;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((s) => s.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSendRestockAlert = async () => {
    if (selectedIds.length === 0) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberIds: selectedIds,
          message: customMsg.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(false), 4000);
        setSelectedIds([]);
      }
    } catch (e) {
      console.error("Error sending alert:", e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Subscribers & Leads</h1>
          <p className={styles.subtitle}>
            Manage VIP newsletter members and customers waiting for product restocks.
          </p>
        </div>
        <button
          className={styles.secondaryBtn}
          onClick={fetchSubscribers}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <RefreshCw size={16} className={loading ? styles.spin : ""} />
          Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className={styles.statCard}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--color-primary)", marginBottom: "8px" }}>
            <Users size={20} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Total Captured Leads</span>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>{subscribers.length}</div>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#b37b77", marginBottom: "8px" }}>
            <Mail size={20} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>VIP Newsletter</span>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            {subscribers.filter((s) => s.subscription_type === "newsletter").length}
          </div>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#d97706", marginBottom: "8px" }}>
            <Bell size={20} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Restock Requests</span>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            {subscribers.filter((s) => s.subscription_type === "restock").length}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Bulk Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
          backgroundColor: "#fff",
          padding: "16px 20px",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Filter size={16} color="#777" />
          <button
            onClick={() => setFilterType("all")}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              background: filterType === "all" ? "var(--color-primary)" : "#f3ebea",
              color: filterType === "all" ? "#fff" : "#444",
            }}
          >
            All ({subscribers.length})
          </button>
          <button
            onClick={() => setFilterType("newsletter")}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              background: filterType === "newsletter" ? "var(--color-primary)" : "#f3ebea",
              color: filterType === "newsletter" ? "#fff" : "#444",
            }}
          >
            VIP Inner Circle ({subscribers.filter((s) => s.subscription_type === "newsletter").length})
          </button>
          <button
            onClick={() => setFilterType("restock")}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              background: filterType === "restock" ? "var(--color-primary)" : "#f3ebea",
              color: filterType === "restock" ? "#fff" : "#444",
            }}
          >
            Restock Alerts ({subscribers.filter((s) => s.subscription_type === "restock").length})
          </button>
        </div>

        {selectedIds.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)" }}>
              {selectedIds.length} selected
            </span>
            <button
              onClick={handleSendRestockAlert}
              disabled={isSending}
              className={styles.primaryBtn}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px" }}
            >
              <Send size={15} />
              {isSending ? "Sending..." : "Notify via Email"}
            </button>
          </div>
        )}
      </div>

      {sendSuccess && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#edf7ed",
            color: "#1e4620",
            padding: "12px 18px",
            borderRadius: "8px",
            marginBottom: "16px",
            border: "1px solid #c8e6c9",
            fontWeight: 500,
          }}
        >
          <CheckCircle size={18} />
          Restock notifications successfully dispatched to selected subscribers!
        </div>
      )}

      {/* Subscribers Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selectedIds.length === filtered.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Customer Email</th>
              <th>Channel / Intent</th>
              <th>Target Product</th>
              <th>Date Captured</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                  Loading captured leads...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                  No subscribers found for this filter.
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(sub.id)}
                      onChange={() => toggleSelect(sub.id)}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#222" }}>{sub.email}</div>
                  </td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        backgroundColor: sub.subscription_type === "restock" ? "#fef3c7" : "#f3e8ff",
                        color: sub.subscription_type === "restock" ? "#92400e" : "#6b21a8",
                      }}
                    >
                      {sub.subscription_type === "restock" ? "Restock Request" : "VIP Inner Circle"}
                    </span>
                  </td>
                  <td>
                    {sub.product_name ? (
                      <span style={{ fontWeight: 500, color: "var(--color-primary)" }}>
                        {sub.product_name}
                      </span>
                    ) : (
                      <span style={{ color: "#999", fontSize: "0.85rem" }}>All Drops (Site-wide)</span>
                    )}
                  </td>
                  <td style={{ color: "#666", fontSize: "0.85rem" }}>
                    {new Date(sub.created_at).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

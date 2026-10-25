"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Mail, 
  Bell, 
  RefreshCw, 
  Send, 
  CheckCircle, 
  Users, 
  Sparkles, 
  Search, 
  X, 
  ArrowUpRight,
  Clock,
  Layers,
  AlertCircle
} from "lucide-react";
import styles from "@/styles/admin.module.css";
import ScrollableTabs from "@/components/admin/ScrollableTabs";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";

export default function SubscribersClient({ initialSubscribers = [] }) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [loading, setLoading] = useState(initialSubscribers.length === 0);
  const [filterType, setFilterType] = useState("all"); // "all", "newsletter", "restock", "drop_notification"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [modalTarget, setModalTarget] = useState(null); // null, "bulk", or a specific sub object
  const [customMsg, setCustomMsg] = useState("");

  // Lock background scroll when modal is open
  useLockBodyScroll(Boolean(modalTarget));

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
    if (initialSubscribers && initialSubscribers.length > 0) return;
    fetchSubscribers();
  }, [initialSubscribers]);

  const filtered = useMemo(() => {
    return subscribers.filter((sub) => {
      // Type filter
      if (filterType !== "all" && sub.subscription_type !== filterType) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesEmail = sub.email?.toLowerCase().includes(q);
        const matchesProduct = sub.product_name?.toLowerCase().includes(q);
        const matchesCollection = sub.collection_name?.toLowerCase().includes(q);
        if (!matchesEmail && !matchesProduct && !matchesCollection) {
          return false;
        }
      }
      return true;
    });
  }, [subscribers, filterType, searchQuery]);

  const restockCount = useMemo(() => subscribers.filter((s) => s.subscription_type === "restock").length, [subscribers]);
  const dropCount = useMemo(() => subscribers.filter((s) => s.subscription_type === "drop_notification").length, [subscribers]);
  const newsletterCount = useMemo(() => subscribers.filter((s) => s.subscription_type === "newsletter").length, [subscribers]);

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

  const openSendModal = (target = "bulk") => {
    setModalTarget(target);
    setCustomMsg("");
  };

  const closeSendModal = () => {
    setModalTarget(null);
    setCustomMsg("");
  };

  const handleSendRestockAlert = async () => {
    const idsToSend = modalTarget === "bulk" 
      ? selectedIds 
      : modalTarget?.id ? [modalTarget.id] : [];

    if (idsToSend.length === 0) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberIds: idsToSend,
          message: customMsg.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(false), 4500);
        if (modalTarget === "bulk") {
          setSelectedIds([]);
        }
        closeSendModal();
      }
    } catch (e) {
      console.error("Error sending alert:", e);
    } finally {
      setIsSending(false);
    }
  };

  const getTargetRecipientsCount = () => {
    if (modalTarget === "bulk") return selectedIds.length;
    if (modalTarget?.id) return 1;
    return 0;
  };

  return (
    <>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Restock Leads & Alerts</h1>
          <p className={styles.pageSubtitle}>
            Track restock requests, drop waitlists, and notify waiting customers.
          </p>
        </div>
        <div className={styles.pageHeaderActions}>
          <button
            className={styles.btnSecondary}
            onClick={fetchSubscribers}
            disabled={loading}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw size={15} className={loading ? styles.spin : ""} />
            Refresh
          </button>
          {selectedIds.length > 0 && (
            <button
              className={styles.btnPrimary}
              onClick={() => openSendModal("bulk")}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Send size={15} />
              Notify Selected ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {sendSuccess && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#edf7ed",
            color: "#1e4620",
            padding: "12px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            border: "1px solid #c8e6c9",
            fontWeight: 500,
            fontSize: "0.88rem",
            animation: "fadeIn 0.2s ease-out"
          }}
        >
          <CheckCircle size={18} color="#2e7d32" />
          Restock notifications successfully dispatched to selected customer{selectedIds.length > 1 ? "s" : ""}!
        </div>
      )}

      {/* Stats Summary Grid matching Products & Orders */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total Captured Leads</div>
          <div className={styles.statValue}>{subscribers.length}</div>
          <div className={styles.statTrend} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Users size={13} /> Active subscriber pool
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>Restock Requests</div>
          <div className={styles.statValue}>{restockCount}</div>
          <div className={styles.statTrend} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Bell size={13} /> Waiting for restock
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>Drop Waitlists</div>
          <div className={styles.statValue}>{dropCount}</div>
          <div className={styles.statTrend} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Sparkles size={13} /> Next collection drops
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>VIP Inner Circle</div>
          <div className={styles.statValue}>{newsletterCount}</div>
          <div className={styles.statTrend} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Mail size={13} /> Newsletter members
          </div>
        </div>
      </div>

      {/* Toolbar: Category Tabs + Search Input */}
      <div className={styles.toolbar}>
        <ScrollableTabs>
          <button
            type="button"
            className={`${styles.tab} ${filterType === "all" ? styles.active : ""}`}
            onClick={() => setFilterType("all")}
          >
            All Leads ({subscribers.length})
          </button>
          <button
            type="button"
            className={`${styles.tab} ${filterType === "restock" ? styles.active : ""}`}
            onClick={() => setFilterType("restock")}
          >
            Restock Alerts ({restockCount})
          </button>
          <button
            type="button"
            className={`${styles.tab} ${filterType === "drop_notification" ? styles.active : ""}`}
            onClick={() => setFilterType("drop_notification")}
          >
            Drop Waitlists ({dropCount})
          </button>
          <button
            type="button"
            className={`${styles.tab} ${filterType === "newsletter" ? styles.active : ""}`}
            onClick={() => setFilterType("newsletter")}
          >
            VIP Inner Circle ({newsletterCount})
          </button>
        </ScrollableTabs>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={16} color="#888" />
            <input
              type="text"
              placeholder="Search email, product, collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
              >
                <X size={14} color="#999" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Selection Notification Bar */}
      {selectedIds.length > 0 && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          backgroundColor: "#fff",
          padding: "10px 16px",
          borderRadius: "10px",
          border: "1px solid var(--color-border-light)",
          marginBottom: "16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
        }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)" }}>
            {selectedIds.length} customer{selectedIds.length > 1 ? "s" : ""} selected for broadcast
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setSelectedIds([])}
              style={{
                background: "none",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "0.78rem",
                cursor: "pointer",
                color: "#666"
              }}
            >
              Clear Selection
            </button>
            <button
              onClick={() => openSendModal("bulk")}
              className={styles.btnPrimary}
              style={{ padding: "6px 14px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Send size={14} /> Send Alert
            </button>
          </div>
        </div>
      )}

      {/* Desktop Subscribers Table View */}
      <div className={styles.desktopTableOnly}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={handleSelectAll}
                    style={{ accentColor: "var(--color-primary)", cursor: "pointer" }}
                  />
                </th>
                <th>Customer Email</th>
                <th>Intent / Channel</th>
                <th>Target Product / Drop</th>
                <th>Date Captured</th>
                <th style={{ textAlign: "right", width: "120px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                    Loading captured leads...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                    No subscribers found for this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const isSelected = selectedIds.includes(sub.id);
                  const initial = (sub.email || "C")[0].toUpperCase();

                  return (
                    <tr 
                      key={sub.id}
                      style={{ backgroundColor: isSelected ? "rgba(122, 64, 61, 0.03)" : "transparent" }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(sub.id)}
                          style={{ accentColor: "var(--color-primary)", cursor: "pointer" }}
                        />
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            background: "var(--color-primary-100, #FDF2F4)",
                            color: "var(--color-primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            flexShrink: 0
                          }}>
                            {initial}
                          </div>
                          <span style={{ fontWeight: 600, color: "var(--color-text)", fontSize: "0.88rem" }}>
                            {sub.email}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 10px",
                            borderRadius: "12px",
                            fontSize: "0.74rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.03em",
                            backgroundColor: 
                              sub.subscription_type === "restock" 
                                ? "#FEF3C7" 
                                : sub.subscription_type === "drop_notification"
                                ? "#FFE4E6"
                                : "#F3E8FF",
                            color: 
                              sub.subscription_type === "restock" 
                                ? "#92400E" 
                                : sub.subscription_type === "drop_notification"
                                ? "#9F1239"
                                : "#6B21A8",
                          }}
                        >
                          {sub.subscription_type === "restock" ? <Bell size={11} /> : sub.subscription_type === "drop_notification" ? <Sparkles size={11} /> : <Mail size={11} />}
                          {sub.subscription_type === "restock" 
                            ? "Restock Alert" 
                            : sub.subscription_type === "drop_notification"
                            ? "Drop Waitlist"
                            : "VIP Inner Circle"}
                        </span>
                      </td>
                      <td>
                        {sub.collection_name ? (
                          <span style={{ fontWeight: 600, color: "var(--color-primary)", fontSize: "0.85rem" }}>
                            ✦ {sub.collection_name}
                          </span>
                        ) : sub.product_name ? (
                          <span style={{ fontWeight: 500, color: "var(--color-text)", fontSize: "0.85rem" }}>
                            {sub.product_name}
                          </span>
                        ) : (
                          <span style={{ color: "#888", fontSize: "0.82rem" }}>All Drops (Site-wide)</span>
                        )}
                      </td>
                      <td style={{ color: "var(--color-text-secondary)", fontSize: "0.82rem" }}>
                        {new Date(sub.created_at).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => openSendModal(sub)}
                          className={styles.btnSecondary}
                          style={{
                            padding: "4px 10px",
                            fontSize: "0.75rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px"
                          }}
                        >
                          <Send size={12} /> Notify
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Stacked Card List matching Products & Orders */}
      <div className={styles.mobileCardList}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", background: "#fff", borderRadius: "12px", color: "#666" }}>
            Loading captured leads...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", background: "#fff", borderRadius: "12px", color: "#888" }}>
            No subscribers found for this filter.
          </div>
        ) : (
          filtered.map((sub) => {
            const isSelected = selectedIds.includes(sub.id);
            const initial = (sub.email || "C")[0].toUpperCase();

            return (
              <div 
                key={sub.id} 
                className={styles.mobileCard}
                style={{
                  borderLeft: isSelected ? "3px solid var(--color-primary)" : "1px solid var(--color-border-light)"
                }}
              >
                {/* Header */}
                <div className={styles.mobileCardHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(sub.id)}
                      style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)", flexShrink: 0, cursor: "pointer" }}
                    />
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "var(--color-primary-100, #FDF2F4)",
                      color: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      flexShrink: 0
                    }}>
                      {initial}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {sub.email}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 7px",
                      borderRadius: "10px",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      flexShrink: 0,
                      backgroundColor: 
                        sub.subscription_type === "restock" 
                          ? "#FEF3C7" 
                          : sub.subscription_type === "drop_notification"
                          ? "#FFE4E6"
                          : "#F3E8FF",
                      color: 
                        sub.subscription_type === "restock" 
                          ? "#92400E" 
                          : sub.subscription_type === "drop_notification"
                          ? "#9F1239"
                          : "#6B21A8",
                    }}
                  >
                    {sub.subscription_type === "restock" 
                      ? "Restock" 
                      : sub.subscription_type === "drop_notification"
                      ? "Waitlist"
                      : "VIP"}
                  </span>
                </div>

                {/* Body Rows */}
                <div className={styles.mobileCardBody}>
                  <div className={styles.mobileCardRow}>
                    <span className={styles.mobileCardLabel}>Target Set</span>
                    <span className={styles.mobileCardValue} style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                      {sub.collection_name ? `✦ ${sub.collection_name}` : sub.product_name || "All Drops (Site-wide)"}
                    </span>
                  </div>
                  <div className={styles.mobileCardRow}>
                    <span className={styles.mobileCardLabel}>Captured</span>
                    <span className={styles.mobileCardValue}>
                      {new Date(sub.created_at).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className={styles.mobileCardFooter}>
                  <button
                    type="button"
                    onClick={() => openSendModal(sub)}
                    className={styles.btnSecondary}
                    style={{
                      width: "100%",
                      padding: "7px 12px",
                      fontSize: "0.78rem",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    <Send size={13} /> Send Alert
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Send Restock Notification Modal */}
      {modalTarget && (
        <div className={styles.modalOverlay} onClick={closeSendModal}>
          <div 
            className={styles.modalContent} 
            style={{ maxWidth: "520px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header with Title and Sticky Close Button */}
            <div className={styles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Bell size={18} color="var(--color-primary)" />
                <h3 className={styles.modalTitle} style={{ margin: 0, fontSize: "1.15rem" }}>
                  {modalTarget === "bulk" ? "Broadcast Restock Alert" : "Notify Customer"}
                </h3>
              </div>
              <button 
                type="button"
                className={styles.modalCloseBtn}
                onClick={closeSendModal}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              <div style={{
                background: "var(--color-primary-50, #fcf6f6)",
                border: "1px solid var(--color-border-light)",
                borderRadius: "8px",
                padding: "12px 14px",
                fontSize: "0.85rem",
                color: "var(--color-text)"
              }}>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                  Recipient{getTargetRecipientsCount() > 1 ? "s" : ""}: {getTargetRecipientsCount()}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                  {modalTarget === "bulk" 
                    ? `Dispatching restock alerts to ${selectedIds.length} selected subscriber${selectedIds.length > 1 ? "s" : ""}.`
                    : `Sending directly to ${modalTarget.email} (${modalTarget.product_name || modalTarget.collection_name || "Requested Set"}).`}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "6px" }}>
                  Custom Alert Message (Optional)
                </label>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  placeholder="e.g. Great news! Your requested press-on set has been officially restocked in all sizes. Order yours now before it sells out again!"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  style={{ width: "100%", fontSize: "0.85rem", resize: "vertical" }}
                />
                <span style={{ fontSize: "0.74rem", color: "#888", marginTop: "4px", display: "block" }}>
                  Leave blank to use the standard editorial luxury alert template.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className={styles.modalActions} style={{ padding: "14px 18px", borderTop: "1px solid var(--color-border-light)" }}>
              <button
                type="button"
                className={styles.modalBtnCancel}
                onClick={closeSendModal}
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleSendRestockAlert}
                disabled={isSending || getTargetRecipientsCount() === 0}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Send size={14} />
                {isSending ? "Sending Alert..." : `Dispatch Alert (${getTargetRecipientsCount()})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

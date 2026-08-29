"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Check, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import styles from "@/styles/admin.module.css";

export default function ReviewsClient({ initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loadingId, setLoadingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "approved" ? "hidden" : "approved";
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      setReviews(reviews.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
    } catch (err) {
      console.error(err);
      alert("Error updating review status");
    } finally {
      setLoadingId(null);
    }
  };

  const deleteReview = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting review");
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = reviews.filter((r) => {
    if (activeTab === "all") return true;
    if (activeTab === "with_photos") return r.photo_urls && r.photo_urls.length > 0;
    if (activeTab === "hidden") return r.status === "hidden";
    return true;
  });

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>The Press-On Journal (Reviews)</h1>
          <p className={styles.subtitle}>Moderate customer reviews, ratings, and real-hand nail photos.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "1px solid #ddd",
            backgroundColor: activeTab === "all" ? "var(--color-primary)" : "white",
            color: activeTab === "all" ? "white" : "inherit",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          All ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab("with_photos")}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "1px solid #ddd",
            backgroundColor: activeTab === "with_photos" ? "var(--color-primary)" : "white",
            color: activeTab === "with_photos" ? "white" : "inherit",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          With Photos ({reviews.filter((r) => r.photo_urls?.length > 0).length})
        </button>
        <button
          onClick={() => setActiveTab("hidden")}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "1px solid #ddd",
            backgroundColor: activeTab === "hidden" ? "var(--color-primary)" : "white",
            color: activeTab === "hidden" ? "white" : "inherit",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Hidden ({reviews.filter((r) => r.status === "hidden").length})
        </button>
      </div>

      {/* Reviews Table / Cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "12px" }}>
          <p style={{ color: "#777" }}>No reviews found in this category.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {filtered.map((rev) => (
            <div
              key={rev.id}
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #eae1e0",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                opacity: rev.status === "hidden" ? 0.6 : 1,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <strong style={{ fontSize: "1.05rem" }}>{rev.customer_name}</strong>
                    {rev.customer_location && (
                      <span style={{ fontSize: "0.8rem", color: "#888" }}>• {rev.customer_location}</span>
                    )}
                    {rev.verified_buyer && (
                      <span style={{ fontSize: "0.75rem", background: "#eaf6ef", color: "#1b8a5a", padding: "2px 8px", borderRadius: "12px", fontWeight: 600 }}>
                        Verified
                      </span>
                    )}
                    <span style={{
                      fontSize: "0.75rem",
                      background: rev.status === "approved" ? "#eef7ee" : "#fdf2f2",
                      color: rev.status === "approved" ? "#2d7a2d" : "#a83232",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontWeight: 600,
                    }}>
                      {rev.status}
                    </span>
                  </div>

                  {rev.products && (
                    <div style={{ fontSize: "0.85rem", color: "var(--color-primary)", marginTop: "4px" }}>
                      Product:{" "}
                      <Link href={`/product/${rev.products.slug}`} target="_blank" style={{ textDecoration: "underline", color: "inherit" }}>
                        {rev.products.name} <ExternalLink size={12} style={{ display: "inline" }} />
                      </Link>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() => toggleStatus(rev.id, rev.status)}
                    disabled={loadingId === rev.id}
                    title={rev.status === "approved" ? "Hide review" : "Approve review"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      background: "white",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    {rev.status === "approved" ? <EyeOff size={14} /> : <Eye size={14} />}
                    {rev.status === "approved" ? "Hide" : "Show"}
                  </button>

                  <button
                    onClick={() => deleteReview(rev.id)}
                    disabled={loadingId === rev.id}
                    title="Delete review"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid #ffcccc",
                      background: "#fff5f5",
                      color: "#c33",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Stars */}
              <div style={{ display: "flex", gap: "2px", color: "#e59840" }}>
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <Star key={i} size={15} fill="#e59840" stroke="none" />
                ))}
              </div>

              {/* Review Text */}
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#333", lineHeight: 1.5 }}>
                "{rev.review_text}"
              </p>

              {/* Photos */}
              {rev.photo_urls && rev.photo_urls.length > 0 && (
                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  {rev.photo_urls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" style={{ position: "relative", width: "70px", height: "70px", borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd" }}>
                      <Image src={url} alt="Customer upload" fill style={{ objectFit: "cover" }} />
                    </a>
                  ))}
                </div>
              )}

              <div style={{ fontSize: "0.75rem", color: "#999" }}>
                Submitted on {new Date(rev.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

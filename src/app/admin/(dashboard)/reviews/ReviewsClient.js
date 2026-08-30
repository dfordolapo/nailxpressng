"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  Trash2, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  Edit2,
  X, 
  ZoomIn,
  MessageSquareHeart,
  BadgeCheck
} from "lucide-react";
import styles from "@/styles/admin.module.css";

export default function ReviewsClient({ initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [loadingId, setLoadingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Review Modal State
  const [editingReview, setEditingReview] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // 1-Click Status Toggle (Approve / Hide)
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
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
      );
    } catch (err) {
      console.error(err);
      alert("Error updating review status");
    } finally {
      setLoadingId(null);
    }
  };

  // 1-Click Verified Buyer Toggle
  const toggleVerified = async (id, currentVerified) => {
    const nextVerified = !currentVerified;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified_buyer: nextVerified }),
      });
      if (!res.ok) throw new Error("Failed to update verified status");
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, verified_buyer: nextVerified } : r))
      );
    } catch (err) {
      console.error(err);
      alert("Error updating verified status");
    } finally {
      setLoadingId(null);
    }
  };

  // Open Edit Modal
  const openEditModal = (review) => {
    setEditingReview({
      id: review.id,
      customer_name: review.customer_name || "",
      customer_location: review.customer_location || "",
      rating: review.rating || 5,
      review_text: review.review_text || "",
      verified_buyer: Boolean(review.verified_buyer),
      status: review.status || "approved",
    });
  };

  // Submit Edit Review
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingReview) return;
    setIsSavingEdit(true);

    try {
      const res = await fetch(`/api/admin/reviews/${editingReview.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: editingReview.customer_name,
          customer_location: editingReview.customer_location,
          rating: editingReview.rating,
          review_text: editingReview.review_text,
          verified_buyer: editingReview.verified_buyer,
          status: editingReview.status,
        }),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      const data = await res.json();

      setReviews((prev) =>
        prev.map((r) => (r.id === editingReview.id ? { ...r, ...data.review } : r))
      );
      setEditingReview(null);
    } catch (err) {
      console.error(err);
      alert("Error saving review changes");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Confirm delete
  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete));
      setReviewToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting review");
    } finally {
      setIsDeleting(false);
    }
  };

  // Metrics calculation
  const totalCount = reviews.length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const hiddenCount = reviews.filter((r) => r.status === "hidden").length;
  const withPhotosCount = reviews.filter((r) => r.photo_urls && r.photo_urls.length > 0).length;
  const verifiedCount = reviews.filter((r) => r.verified_buyer).length;

  const averageRating = totalCount > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalCount).toFixed(1)
    : "5.0";

  // Filter logic
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // Tab filter
      if (activeTab === "approved" && r.status !== "approved") return false;
      if (activeTab === "hidden" && r.status !== "hidden") return false;
      if (activeTab === "with_photos" && (!r.photo_urls || r.photo_urls.length === 0)) return false;

      // Star rating filter
      if (starFilter !== "all" && Number(r.rating || 5) !== Number(starFilter)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const customerName = (r.customer_name || "").toLowerCase();
        const location = (r.customer_location || "").toLowerCase();
        const productName = (r.products?.name || "").toLowerCase();
        const reviewText = (r.review_text || "").toLowerCase();
        return (
          customerName.includes(query) ||
          location.includes(query) ||
          productName.includes(query) ||
          reviewText.includes(query)
        );
      }

      return true;
    });
  }, [reviews, activeTab, starFilter, searchQuery]);

  return (
    <>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Customer Reviews</h1>
          <p className={styles.pageSubtitle}>
            Moderate, verify, edit, and curate real customer reviews and nail photos.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total Reviews</div>
          <div className={styles.statValue}>{totalCount}</div>
          <div className={styles.statTrend}>{approvedCount} Approved & Live</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>Average Rating</div>
          <div className={styles.statValue} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {averageRating} <Star size={22} fill="#F59E0B" color="#F59E0B" style={{ display: "inline" }} />
          </div>
          <div className={styles.statTrend}>Overall store rating</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>Verified Buyers</div>
          <div className={styles.statValue}>{verifiedCount}</div>
          <div className={styles.statTrend}>
            {totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0}% verified customers
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>With Photos</div>
          <div className={styles.statValue}>{withPhotosCount}</div>
          <div className={styles.statTrend}>Customer nail swatches</div>
        </div>
      </div>

      {/* Toolbar: Tabs & Search / Filter */}
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "all" ? styles.active : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "approved" ? styles.active : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved ({approvedCount})
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "with_photos" ? styles.active : ""}`}
            onClick={() => setActiveTab("with_photos")}
          >
            With Photos ({withPhotosCount})
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "hidden" ? styles.active : ""}`}
            onClick={() => setActiveTab("hidden")}
          >
            Hidden ({hiddenCount})
          </button>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={16} color="#888" />
            <input
              type="text"
              placeholder="Search reviewer or product..."
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

          <select
            value={starFilter}
            onChange={(e) => setStarFilter(e.target.value)}
            className={styles.select}
            style={{ width: "auto", minWidth: "130px", padding: "8px 28px 8px 12px", fontSize: "0.85rem" }}
          >
            <option value="all">All Stars</option>
            <option value="5">5 Stars ★</option>
            <option value="4">4 Stars ★</option>
            <option value="3">3 Stars ★</option>
            <option value="2">2 Stars ★</option>
            <option value="1">1 Star ★</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className={styles.tableContainer} style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-3)" }}>
            <MessageSquareHeart size={44} color="var(--color-primary-300, #d98894)" />
          </div>
          <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary)", marginBottom: "6px", fontFamily: "var(--font-heading)" }}>
            No reviews found
          </h3>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", maxWidth: "380px", margin: "0 auto" }}>
            {searchQuery || starFilter !== "all"
              ? "No reviews match your current filter criteria. Try adjusting your search query or filters."
              : "Customer reviews and photo submissions will appear here for moderation."}
          </p>
        </div>
      ) : (
        <div className={styles.reviewsGrid}>
          {filteredReviews.map((rev) => {
            const initials = (rev.customer_name || "C")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            const isHidden = rev.status === "hidden";

            return (
              <div
                key={rev.id}
                className={`${styles.reviewCard} ${isHidden ? styles.reviewCardHidden : ""}`}
              >
                {/* Header */}
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewCustomerInfo}>
                    <div className={styles.reviewAvatar}>{initials}</div>
                    <div className={styles.reviewMeta}>
                      <div className={styles.reviewNameRow}>
                        <span className={styles.reviewCustomerName}>{rev.customer_name || "Anonymous Customer"}</span>
                        {rev.customer_location && (
                          <span className={styles.reviewLocation}>• {rev.customer_location}</span>
                        )}
                        {rev.verified_buyer ? (
                          <span className={styles.reviewVerifiedBadge}>
                            <CheckCircle2 size={12} /> Verified Buyer
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.72rem", background: "#f3f4f6", color: "#6b7280", padding: "2px 8px", borderRadius: "12px", fontWeight: 500 }}>
                            Unverified
                          </span>
                        )}
                        <span
                          className={`${styles.reviewStatusBadge} ${
                            rev.status === "approved"
                              ? styles.reviewStatusApproved
                              : styles.reviewStatusHidden
                          }`}
                        >
                          {rev.status === "approved" ? "Approved" : "Hidden"}
                        </span>
                      </div>

                      {rev.products && (
                        <Link
                          href={`/product/${rev.products.slug}`}
                          target="_blank"
                          className={styles.reviewProductLink}
                        >
                          Product: {rev.products.name} <ExternalLink size={12} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.reviewControls}>
                    {/* 1-Click Verify Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleVerified(rev.id, rev.verified_buyer)}
                      disabled={loadingId === rev.id}
                      className={styles.reviewControlBtn}
                      title={rev.verified_buyer ? "Mark as unverified" : "Mark as verified buyer"}
                    >
                      <BadgeCheck size={14} color={rev.verified_buyer ? "#10B981" : "#888"} />
                      {rev.verified_buyer ? "Verified" : "Verify"}
                    </button>

                    {/* 1-Click Approve / Hide Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleStatus(rev.id, rev.status)}
                      disabled={loadingId === rev.id}
                      className={styles.reviewControlBtn}
                      title={rev.status === "approved" ? "Hide review from store" : "Approve and publish review"}
                    >
                      {rev.status === "approved" ? (
                        <>
                          <EyeOff size={14} /> Hide
                        </>
                      ) : (
                        <>
                          <Eye size={14} color="#10B981" /> Approve
                        </>
                      )}
                    </button>

                    {/* Edit Modal Button */}
                    <button
                      type="button"
                      onClick={() => openEditModal(rev)}
                      className={styles.reviewControlBtn}
                      title="Edit review details"
                    >
                      <Edit2 size={14} /> Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => setReviewToDelete(rev.id)}
                      disabled={loadingId === rev.id}
                      className={styles.reviewDeleteBtn}
                      title="Permanently delete review"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                {/* Rating & Date */}
                <div className={styles.reviewRatingRow}>
                  <div className={styles.reviewStars}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        fill={i < (rev.rating || 5) ? "#F59E0B" : "none"}
                        color={i < (rev.rating || 5) ? "#F59E0B" : "#D1D5DB"}
                      />
                    ))}
                  </div>
                  <span className={styles.reviewDate}>
                    {new Date(rev.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Review Body */}
                <p className={styles.reviewBody}>
                  "{rev.review_text}"
                </p>

                {/* Customer Photo Uploads */}
                {rev.photo_urls && rev.photo_urls.length > 0 && (
                  <div className={styles.reviewPhotos}>
                    {rev.photo_urls.map((url, idx) => (
                      <div
                        key={idx}
                        className={styles.reviewPhotoThumb}
                        onClick={() => setSelectedImage(url)}
                        title="Click to view full photo"
                      >
                        <Image
                          src={url}
                          alt={`Review photo ${idx + 1}`}
                          fill
                          sizes="80px"
                          style={{ objectFit: "cover" }}
                        />
                        <div className={styles.reviewPhotoOverlay}>
                          <ZoomIn size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className={styles.modalOverlay} onClick={() => setEditingReview(null)}>
          <div className={styles.editModalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className={styles.modalTitle} style={{ margin: 0, fontSize: "1.35rem" }}>
                Edit Review
              </h3>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              {/* Customer Name & Location */}
              <div className={styles.grid2} style={{ marginBottom: "15px" }}>
                <div>
                  <label className={styles.label}>Customer Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingReview.customer_name}
                    onChange={(e) => setEditingReview({ ...editingReview, customer_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Customer Location</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Lagos, Abuja"
                    value={editingReview.customer_location}
                    onChange={(e) => setEditingReview({ ...editingReview, customer_location: e.target.value })}
                  />
                </div>
              </div>

              {/* Rating & Status */}
              <div className={styles.grid2} style={{ marginBottom: "15px" }}>
                <div>
                  <label className={styles.label}>Rating (Stars)</label>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "6px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditingReview({ ...editingReview, rating: star })}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
                      >
                        <Star
                          size={24}
                          fill={star <= editingReview.rating ? "#F59E0B" : "none"}
                          color={star <= editingReview.rating ? "#F59E0B" : "#D1D5DB"}
                        />
                      </button>
                    ))}
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, marginLeft: "6px", color: "var(--color-text)" }}>
                      {editingReview.rating} / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className={styles.label}>Status</label>
                  <select
                    className={styles.select}
                    value={editingReview.status}
                    onChange={(e) => setEditingReview({ ...editingReview, status: e.target.value })}
                  >
                    <option value="approved">Approved (Live)</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              {/* Review Text */}
              <div style={{ marginBottom: "20px" }}>
                <label className={styles.label}>Review Content</label>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  value={editingReview.review_text}
                  onChange={(e) => setEditingReview({ ...editingReview, review_text: e.target.value })}
                  required
                />
              </div>

              {/* Verified Buyer Checkbox */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  id="editVerifiedBuyer"
                  checked={editingReview.verified_buyer}
                  onChange={(e) => setEditingReview({ ...editingReview, verified_buyer: e.target.checked })}
                  style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)", cursor: "pointer" }}
                />
                <label htmlFor="editVerifiedBuyer" style={{ fontSize: "0.95rem", color: "var(--color-text)", cursor: "pointer", userSelect: "none" }}>
                  Mark as <strong>Verified Buyer</strong> (verified purchase badge)
                </label>
              </div>

              {/* Modal Actions */}
              <div className={styles.modalActions} style={{ justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className={styles.modalBtnCancel}
                  onClick={() => setEditingReview(null)}
                  disabled={isSavingEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  style={{ minWidth: "120px" }}
                  disabled={isSavingEdit}
                >
                  {isSavingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div className={styles.lightboxOverlay} onClick={() => setSelectedImage(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={() => setSelectedImage(null)}
              aria-label="Close photo"
            >
              <X size={20} />
            </button>
            <div style={{ position: "relative", width: "80vw", maxWidth: "600px", height: "70vh", maxHeight: "600px", borderRadius: "12px", overflow: "hidden" }}>
              <Image
                src={selectedImage}
                alt="Customer nail photo"
                fill
                sizes="(max-width: 768px) 90vw, 600px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <div className={styles.modalOverlay} onClick={() => setReviewToDelete(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Review?</h3>
            <p className={styles.modalText}>
              Are you sure you want to permanently delete this review? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalBtnCancel}
                onClick={() => setReviewToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.modalBtnDelete}
                onClick={confirmDeleteReview}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

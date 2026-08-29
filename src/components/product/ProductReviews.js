"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Star, Camera, X, Check, UploadCloud, MessageSquareHeart, Sparkles } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import styles from "@/styles/components/reviews.module.css";

// Star rating icon renderer
function RenderStars({ count = 5, size = 16, interactive = false, onSelect, hoverCount = 0, onHover }) {
  return (
    <div className={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hoverCount || count) >= star;
        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              className={styles.starPickBtn}
              onClick={() => onSelect && onSelect(star)}
              onMouseEnter={() => onHover && onHover(star)}
              onMouseLeave={() => onHover && onHover(0)}
              aria-label={`${star} star`}
            >
              <Star
                size={size}
                fill={filled ? "#e59840" : "none"}
                stroke={filled ? "#e59840" : "#d3c5c4"}
                strokeWidth={1.5}
              />
            </button>
          );
        }
        return (
          <Star
            key={star}
            size={size}
            fill={filled ? "#e59840" : "none"}
            stroke={filled ? "#e59840" : "#d3c5c4"}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}

export default function ProductReviews({ product, compact = false }) {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 5.0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Form input states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch reviews for this product
  useEffect(() => {
    if (!product?.id && !product?.slug) return;
    
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const param = product.id ? `productId=${product.id}` : `slug=${product.slug}`;
        const res = await fetch(`/api/reviews?${param}`);
        if (!res.ok) {
          setReviews([]);
          return;
        }
        const data = await res.json();
        setReviews(data.reviews || []);
        if (data.stats) setStats(data.stats);
        if (data.photos) setPhotos(data.photos);
      } catch (err) {
        console.warn("Reviews notice:", err.message);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Check if URL has review=open or hash #write-review
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("review") === "open" || window.location.hash === "#write-review") {
        setIsModalOpen(true);
      }
    }
  }, [product?.id, product?.slug]);

  // Handle Photo selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Limit to 4 images
    const combinedFiles = [...selectedFiles, ...files].slice(0, 4);
    setSelectedFiles(combinedFiles);

    // Generate previews
    const newPreviews = combinedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removePhoto = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  // Submit review without login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Please tell us your name");
      return;
    }
    if (!reviewText.trim()) {
      showToast("Please share your thoughts on the set");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("productId", product.id);
      formData.append("customerName", name);
      if (location) formData.append("customerLocation", location);
      formData.append("rating", rating.toString());
      formData.append("reviewText", reviewText);
      formData.append("verifiedBuyer", "true");

      selectedFiles.forEach((file) => {
        formData.append("photos", file);
      });

      const res = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      showToast("Chef's kiss! Thanks for making our feed look good. ✨");

      // Optimistic update
      const created = data.review;
      if (created) {
        setReviews((prev) => [created, ...prev]);
        setStats((prev) => {
          const newTotal = prev.total + 1;
          const newBreakdown = { ...prev.breakdown, [rating]: (prev.breakdown[rating] || 0) + 1 };
          const sum = Object.entries(newBreakdown).reduce((acc, [r, count]) => acc + parseInt(r) * count, 0);
          return {
            total: newTotal,
            average: parseFloat((sum / newTotal).toFixed(1)),
            breakdown: newBreakdown,
          };
        });

        if (created.photo_urls && created.photo_urls.length > 0) {
          const newUploadedPhotos = created.photo_urls.map((url) => ({
            url,
            reviewer: created.customer_name,
            rating: created.rating,
            reviewText: created.review_text,
            date: created.created_at,
          }));
          setPhotos((prev) => [...newUploadedPhotos, ...prev]);
        }
      }

      // Reset form
      setName("");
      setLocation("");
      setRating(5);
      setReviewText("");
      setSelectedFiles([]);
      setPreviews([]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to submit review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={`${styles.reviewsContainer} ${compact ? styles.compactContainer : ""}`} id="press-on-journal">
      {/* Header */}
      <div className={styles.headerSection}>
        <div className={styles.titleGroup}>
          <h3 className={styles.sectionTitle}>The Press-On Journal</h3>
          <p className={styles.sectionSubtitle}>
            Got compliments? Tell us everything. Show us how you styled it.
          </p>
        </div>

        <button
          className={styles.writeReviewBtn}
          onClick={() => setIsModalOpen(true)}
          id="open-review-modal-btn"
        >
          <Sparkles size={16} />
          Flaunt Your Set
        </button>
      </div>

      {/* Breakdown Box (if reviews exist) */}
      {reviews.length > 0 && (
        <div className={styles.summaryBox}>
          <div className={styles.scoreCol}>
            <div className={styles.averageScore}>{stats.average}</div>
            <RenderStars count={Math.round(stats.average)} size={20} />
            <span className={styles.totalReviewsCount}>
              Based on {stats.total} {stats.total === 1 ? "entry" : "entries"}
            </span>
          </div>

          <div className={styles.barsCol}>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.breakdown[stars] || 0;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={stars} className={styles.barRow}>
                  <span className={styles.barLabel}>{stars} Stars</span>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={styles.barCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Real-Hand Photo Strip */}
      {photos.length > 0 && (
        <div className={styles.photosSection}>
          <div className={styles.photosHeader}>
            <Camera size={18} />
            <span>Customer Photo Gallery ({photos.length})</span>
          </div>
          <div className={styles.photoStrip}>
            {photos.map((item, idx) => (
              <button
                key={idx}
                className={styles.photoThumbnail}
                onClick={() => setSelectedPhoto(item)}
                aria-label={`View photo by ${item.reviewer}`}
              >
                <Image
                  src={item.url}
                  alt={`Nail set worn by ${item.reviewer}`}
                  fill
                  sizes="90px"
                  style={{ objectFit: "cover" }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-8) 0", color: "var(--color-text-secondary)" }}>
          Loading the journal...
        </div>
      ) : reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <h4 className={styles.emptyTitle}>No reviews yet</h4>
          <button
            className={styles.tellUsBtn}
            onClick={() => setIsModalOpen(true)}
            id="empty-state-review-btn"
          >
            Tell us about your nails →
          </button>
        </div>
      ) : (
        <div className={styles.reviewsGrid}>
          {reviews.map((rev) => (
            <div key={rev.id} className={styles.reviewCard}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.authorName}>
                    <span>{rev.customer_name}</span>
                    {rev.verified_buyer && (
                      <span className={styles.verifiedBadge}>
                        <Check size={11} strokeWidth={3} /> Verified
                      </span>
                    )}
                  </div>
                  {rev.customer_location && (
                    <div className={styles.authorLocation}>{rev.customer_location}</div>
                  )}
                </div>
                <div className={styles.reviewDate}>
                  {new Date(rev.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>

              <RenderStars count={rev.rating} size={15} />

              <p className={styles.reviewText}>{rev.review_text}</p>

              {rev.photo_urls && rev.photo_urls.length > 0 && (
                <div className={styles.cardPhotos}>
                  {rev.photo_urls.map((photoUrl, pIdx) => (
                    <button
                      key={pIdx}
                      className={styles.cardPhotoThumb}
                      onClick={() =>
                        setSelectedPhoto({
                          url: photoUrl,
                          reviewer: rev.customer_name,
                          rating: rev.rating,
                          reviewText: rev.review_text,
                          date: rev.created_at,
                        })
                      }
                    >
                      <Image
                        src={photoUrl}
                        alt={`Photo by ${rev.customer_name}`}
                        fill
                        sizes="60px"
                        style={{ objectFit: "cover" }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal via Portal */}
      {mounted && isModalOpen && createPortal(
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeaderSticky}>
              <div>
                <h3 className={styles.modalTitle}>Flaunt Your Set</h3>
                <p className={styles.modalSubtitle}>
                  How was the fit and feel?
                </p>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBodyScroll}>
              <form onSubmit={handleSubmit}>
              {/* Rating */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Overall Rating</label>
                <RenderStars
                  count={rating}
                  size={26}
                  interactive={true}
                  onSelect={setRating}
                  hoverCount={hoverRating}
                  onHover={setHoverRating}
                />
              </div>

              {/* Name */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Name / Nickname *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chioma O. or BabeWithNails"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              {/* Location (optional) */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Location (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Lagos, Abuja, London"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              {/* Review Text */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Thoughts *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Did they stay on through life? How was the fit? Give us the tea..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>

              {/* Photo Upload */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Add Photos (Optional, Up to 4)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                <div
                  className={styles.dropzone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud size={24} className={styles.uploadIcon} />
                  <p className={styles.uploadPrompt}>Show us how you styled it</p>
                  <p className={styles.uploadSub}>Tap to browse or take a photo</p>
                </div>

                {previews.length > 0 && (
                  <div className={styles.previewGrid}>
                    {previews.map((src, i) => (
                      <div key={i} className={styles.previewThumb}>
                        <Image
                          src={src}
                          alt={`Uploaded preview ${i + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          className={styles.removeThumbBtn}
                          onClick={() => removePhoto(i)}
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={styles.submitBtn}
                id="submit-review-btn"
              >
                {submitting ? "Publishing to Journal..." : "Add to The Journal ✨"}
              </button>
            </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Lightbox for customer photos via Portal */}
      {mounted && selectedPhoto && createPortal(
        <div className={styles.lightboxOverlay} onClick={() => setSelectedPhoto(null)}>
          <div className={styles.lightboxCard} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.lightboxCloseBtn}
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo"
            >
              <X size={18} />
            </button>

            <div className={styles.lightboxImageWrapper}>
              <Image
                src={selectedPhoto.url}
                alt={`Photo by ${selectedPhoto.reviewer}`}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            <div className={styles.lightboxDetails}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontWeight: 600, fontSize: "1rem" }}>{selectedPhoto.reviewer}</span>
                <RenderStars count={selectedPhoto.rating || 5} size={16} />
              </div>
              {selectedPhoto.reviewText && (
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#d8cbcb", lineHeight: 1.5 }}>
                  "{selectedPhoto.reviewText}"
                </p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

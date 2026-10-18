"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { uploadImageDirect } from "@/lib/uploadImage";
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Check, 
  Eye, 
  EyeOff, 
  Sparkles, 
  RefreshCw, 
  X, 
  UploadCloud, 
  Package,
  AlertCircle,
  Timer,
  Lock
} from "lucide-react";
import styles from "./collections.module.css";

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toDateTimeLocalString(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

export default function CollectionsClient() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'published', 'draft'
  const [toast, setToast] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [slugManualEdit, setSlugManualEdit] = useState(false);
  const [formTagline, setFormTagline] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formImageFile, setFormImageFile] = useState(null);
  const [formImagePreview, setFormImagePreview] = useState("");
  const [formDropTimerEnabled, setFormDropTimerEnabled] = useState(false);
  const [formDropDate, setFormDropDate] = useState("");
  const [formDropHeadline, setFormDropHeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/collections");
      const data = await res.json();
      if (data.collections) {
        setCollections(data.collections);
      }
    } catch (err) {
      console.error("Failed to load collections:", err);
      showToast("Failed to load collections: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/collections")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.collections) {
          setCollections(data.collections);
        }
      })
      .catch((err) => {
        console.error("Failed to load collections:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedCollection(null);
    setFormName("");
    setFormSlug("");
    setSlugManualEdit(false);
    setFormTagline("");
    setFormDescription("");
    setFormIsPublished(true);
    setFormDisplayOrder(collections.length);
    setFormImageFile(null);
    setFormImagePreview("");
    setFormDropTimerEnabled(false);
    setFormDropDate("");
    setFormDropHeadline("");
    setIsModalOpen(true);
  };

  const openEditModal = (col) => {
    setModalMode("edit");
    setSelectedCollection(col);
    setFormName(col.name || "");
    setFormSlug(col.slug || "");
    setSlugManualEdit(true);
    setFormTagline(col.tagline || "");
    setFormDescription(col.description || "");
    setFormIsPublished(col.is_published !== false);
    setFormDisplayOrder(col.display_order ?? 0);
    setFormImageFile(null);
    setFormImagePreview(col.image || "");
    setFormDropTimerEnabled(Boolean(col.drop_timer_enabled));
    setFormDropDate(toDateTimeLocalString(col.drop_date));
    setFormDropHeadline(col.drop_headline || "");
    setIsModalOpen(true);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormName(val);
    if (!slugManualEdit) {
      setFormSlug(slugify(val));
    }
  };

  const handleSlugChange = (e) => {
    setSlugManualEdit(true);
    setFormSlug(slugify(e.target.value));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormImageFile(file);
    try {
      const objectUrl = URL.createObjectURL(file);
      setFormImagePreview(objectUrl);
    } catch {
      setFormImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast("Collection name is required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const targetSlug = formSlug || slugify(formName);
      let coverImageUrl = formImagePreview && !formImagePreview.startsWith("blob:") ? formImagePreview : "";

      // Upload cover image directly to Supabase Storage (bypasses Vercel 4.5MB payload limit)
      if (formImageFile) {
        showToast("Uploading cover photo...", "info");
        try {
          coverImageUrl = await uploadImageDirect(formImageFile, `collection-${targetSlug}`);
        } catch (uploadErr) {
          console.warn("Direct upload fallback to server:", uploadErr);
        }
      }

      const formData = new FormData();
      formData.append("name", formName.trim());
      formData.append("slug", targetSlug);
      formData.append("tagline", formTagline.trim());
      formData.append("description", formDescription.trim());
      formData.append("is_published", formIsPublished ? "true" : "false");
      formData.append("display_order", String(formDisplayOrder));
      formData.append("drop_timer_enabled", formDropTimerEnabled ? "true" : "false");
      formData.append("drop_date", formDropDate ? new Date(formDropDate).toISOString() : "");
      formData.append("drop_headline", formDropHeadline.trim());

      if (coverImageUrl) {
        formData.append("image_url", coverImageUrl);
      } else if (formImageFile) {
        formData.append("image", formImageFile);
      }

      const url = modalMode === "create" 
        ? "/api/admin/collections" 
        : `/api/admin/collections/${selectedCollection.id}`;

      const res = await fetch(url, {
        method: modalMode === "create" ? "POST" : "PUT",
        body: formData,
      });

      let data;
      const resText = await res.text();
      try {
        data = JSON.parse(resText);
      } catch {
        throw new Error(res.status === 413 ? "Cover image is too large." : `Server returned error (${res.status}): ${resText.slice(0, 100)}`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save collection");
      }

      showToast(
        modalMode === "create" 
          ? `Collection "${formName}" created! ${formIsPublished ? "It is now live in the hamburger dropdown." : "Saved as draft."}`
          : `Collection "${formName}" updated!`
      );

      setIsModalOpen(false);
      fetchCollections();
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (col) => {
    const nextState = !col.is_published;
    // Optimistic UI update
    setCollections(prev => prev.map(c => c.id === col.id ? { ...c, is_published: nextState } : c));

    try {
      const res = await fetch(`/api/admin/collections/${col.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: nextState }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      showToast(
        nextState 
          ? `"${col.name}" is now Published and visible in hamburger menu!` 
          : `"${col.name}" is now Draft and hidden from hamburger menu.`
      );
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
      // Rollback
      setCollections(prev => prev.map(c => c.id === col.id ? { ...c, is_published: col.is_published } : c));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/collections/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete collection");
      }

      showToast(`Collection "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchCollections();
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    }
  };

  const filtered = collections.filter((c) => {
    const matchesSearch = 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "published") return c.is_published === true;
    if (statusFilter === "draft") return c.is_published === false;
    return true;
  });

  const totalPublished = collections.filter(c => c.is_published !== false).length;
  const totalDraft = collections.filter(c => c.is_published === false).length;

  const getCollectionStoreUrl = (slug) => {
    if (slug === "handmade") return "/handmade";
    if (slug === "factory") return "/factory";
    return `/collection/${slug}`;
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          background: toast.type === "error" ? "#dc2626" : "#059669",
          color: "#ffffff",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          zIndex: 2000,
          fontSize: "0.9rem",
          fontWeight: 500,
        }}>
          {toast.type === "error" ? <AlertCircle size={18} strokeWidth={1.5} /> : <Check size={18} strokeWidth={1.5} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Collections Management</h1>
          <p className={styles.pageSubtitle}>
            Create and organize product collections. Any collection marked as <strong>Published</strong> will automatically appear in the storefront hamburger dropdown menu.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            className={styles.btnSecondary} 
            onClick={fetchCollections} 
            disabled={loading}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw size={15} strokeWidth={1.5} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button className={styles.btnPrimary} onClick={openCreateModal}>
            <Plus size={18} strokeWidth={1.5} />
            New Collection
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(139, 44, 61, 0.1)", color: "var(--color-primary)" }}>
            <Layers size={22} strokeWidth={1.5} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{collections.length}</span>
            <span className={styles.statLabel}>Total Collections</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
            <Eye size={22} strokeWidth={1.5} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalPublished}</span>
            <span className={styles.statLabel}>Live in Hamburger Menu</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
            <EyeOff size={22} strokeWidth={1.5} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalDraft}</span>
            <span className={styles.statLabel}>Draft / Hidden</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <Search size={16} strokeWidth={1.5} color="var(--color-text-secondary)" />
          <input
            type="text"
            placeholder="Search collections by name, slug or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${statusFilter === "all" ? styles.active : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All ({collections.length})
          </button>
          <button
            className={`${styles.filterTab} ${statusFilter === "published" ? styles.active : ""}`}
            onClick={() => setStatusFilter("published")}
          >
            Published ({totalPublished})
          </button>
          <button
            className={`${styles.filterTab} ${statusFilter === "draft" ? styles.active : ""}`}
            onClick={() => setStatusFilter("draft")}
          >
            Drafts ({totalDraft})
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.emptyState}>
            <RefreshCw size={28} className="animate-spin" color="var(--color-primary)" />
            <p className={styles.emptyText}>Loading collections...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <Sparkles size={36} color="var(--color-primary)" style={{ opacity: 0.5 }} />
            <h3 className={styles.emptyTitle}>No collections found</h3>
            <p className={styles.emptyText}>
              {searchQuery ? `No collections matching "${searchQuery}".` : "No collections available. Create your first collection!"}
            </p>
            {searchQuery ? (
              <button className={styles.btnSecondary} onClick={() => setSearchQuery("")}>Clear Search</button>
            ) : (
              <button className={styles.btnPrimary} onClick={openCreateModal}>
                <Plus size={16} strokeWidth={1.5} /> Create Collection
              </button>
            )}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Collection</th>
                  <th>Tagline / Description</th>
                  <th>Published in Hamburger</th>
                  <th>Drop Countdown</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((col) => {
                  const isCore = col.slug === "handmade" || col.slug === "factory";
                  const storeUrl = getCollectionStoreUrl(col.slug);

                  return (
                    <tr key={col.id || col.slug}>
                      {/* Collection Info */}
                      <td>
                        <div className={styles.collectionCell}>
                          <div className={styles.thumbWrapper}>
                            {col.image ? (
                              <Image 
                                src={col.image} 
                                alt={col.name} 
                                fill
                                sizes="52px"
                                className={styles.thumbImg} 
                                unoptimized
                              />
                            ) : (
                              <Layers size={20} strokeWidth={1.5} color="var(--color-primary)" />
                            )}
                          </div>
                          <div className={styles.collectionMeta}>
                            <div className={styles.collectionName}>
                              {col.name}
                              {isCore && <span className={styles.systemBadge}>Core</span>}
                            </div>
                            <span className={styles.collectionSlug}>/{col.slug}</span>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td style={{ maxWidth: "260px" }}>
                        <div style={{ fontWeight: 500, fontSize: "0.85rem", color: "var(--color-text)" }}>
                          {col.tagline || "—"}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {col.description || "No description"}
                        </div>
                      </td>

                      {/* Published in Hamburger Toggle */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <label className={styles.toggleSwitch} title={col.is_published !== false ? "Published (Visible in hamburger)" : "Draft (Hidden from hamburger)"}>
                            <input
                              type="checkbox"
                              checked={col.is_published !== false}
                              onChange={() => handleTogglePublish(col)}
                            />
                            <span className={styles.toggleSlider} />
                          </label>
                          <span className={`${styles.badge} ${col.is_published !== false ? styles.badgePublished : styles.badgeDraft}`}>
                            {col.is_published !== false ? (
                              <>
                                <Check size={11} strokeWidth={2} />
                                Published
                              </>
                            ) : (
                              <>
                                <EyeOff size={11} strokeWidth={2} />
                                Draft
                              </>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Drop Countdown Status */}
                      <td>
                        {(() => {
                          if (!col.drop_timer_enabled || !col.drop_date) {
                            return (
                              <span className={styles.badgeTimerOff} title="No drop countdown scheduled">
                                <Timer size={12} strokeWidth={1.5} />
                                Inactive
                              </span>
                            );
                          }
                          const dropTime = new Date(col.drop_date).getTime();
                          const isUpcoming = dropTime > Date.now();
                          const formatted = new Date(col.drop_date).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          });

                          if (isUpcoming) {
                            const diff = dropTime - Date.now();
                            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            return (
                              <span className={styles.badgeTimerActive} title={`Locked until: ${formatted}`}>
                                <Lock size={12} strokeWidth={1.7} />
                                Drops {formatted} {d > 0 ? `(${d}d ${h}h)` : `(${h}h)`}
                              </span>
                            );
                          }

                          return (
                            <span className={styles.badgeTimerDropped} title={`Dropped on ${formatted} - Live now`}>
                              <Check size={12} strokeWidth={2} />
                              Dropped (Live)
                            </span>
                          );
                        })()}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right" }}>
                        <div className={styles.actionsCell} style={{ justifyContent: "flex-end" }}>
                          <a
                            href={storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.iconBtn}
                            title="View on storefront"
                          >
                            <ExternalLink size={15} strokeWidth={1.5} />
                          </a>
                          <button
                            className={styles.iconBtn}
                            onClick={() => openEditModal(col)}
                            title="Edit collection"
                          >
                            <Edit3 size={15} strokeWidth={1.5} />
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.deleteBtn}`}
                            onClick={() => setDeleteTarget(col)}
                            title="Delete collection"
                          >
                            <Trash2 size={15} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => !isSubmitting && setIsModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modalMode === "create" ? "Add New Collection" : `Edit Collection "${selectedCollection?.name}"`}
              </h2>
              <button 
                className={styles.iconBtn} 
                onClick={() => setIsModalOpen(false)} 
                disabled={isSubmitting}
                style={{ border: "none" }}
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                {/* Publish notice */}
                <div className={styles.publishNotice}>
                  <Sparkles size={18} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong>Hamburger Navigation Visibility:</strong> When &quot;Published&quot; is enabled, this collection will immediately appear in the mobile hamburger dropdown menu for all visitors.
                  </div>
                </div>

                {/* Name */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Collection Name *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g. Bridal Glam, Luxury Sculpted, Summer Gel"
                    value={formName}
                    onChange={handleNameChange}
                    required
                  />
                </div>

                {/* Slug */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>URL Slug *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g. bridal-glam"
                    value={formSlug}
                    onChange={handleSlugChange}
                    required
                  />
                  <div className={styles.previewPill}>
                    URL: /collection/{formSlug || "your-slug"}
                  </div>
                </div>

                {/* Tagline */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tagline (Optional)</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g. Timeless luxury for unforgettable moments"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    className={styles.formTextarea}
                    rows={3}
                    placeholder="Describe what makes this collection unique..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                </div>

                {/* Cover Image */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Cover Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageFileChange}
                  />

                  {formImagePreview ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img 
                        src={formImagePreview} 
                        alt="Preview" 
                        style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--color-border-light)" }}
                        className={styles.previewThumb} 
                      />
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          onClick={() => {
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                              fileInputRef.current.click();
                            }
                          }}
                          style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                        >
                          Change Image
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormImageFile(null);
                            setFormImagePreview("");
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          style={{ border: "none", background: "none", color: "#dc2626", fontSize: "0.75rem", cursor: "pointer", textAlign: "left", padding: 0 }}
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.uploadArea} onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                        fileInputRef.current.click();
                      }
                    }}>
                      <UploadCloud size={24} strokeWidth={1.5} color="var(--color-primary)" />
                      <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--color-text)" }}>
                        Click to upload cover image
                      </div>
                      <div className={styles.helperText}>
                        JPG, PNG, or WEBP (Max 5MB)
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Switch */}
                <div className={styles.formGroup} style={{ paddingTop: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div className={styles.formLabel}>Publish Collection</div>
                      <div className={styles.helperText}>
                        When enabled, customers can view this collection and find it in the hamburger menu.
                      </div>
                    </div>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        checked={formIsPublished}
                        onChange={(e) => setFormIsPublished(e.target.checked)}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>
                </div>

                {/* Drop Countdown Timer Section */}
                <div className={styles.timerSection}>
                  <div className={styles.timerSectionHeader}>
                    <div className={styles.timerTitleGroup}>
                      <Timer size={18} strokeWidth={1.5} />
                      <span>Collection Drop Countdown Timer</span>
                    </div>
                    <label className={styles.toggleSwitch} title="Toggle Drop Countdown">
                      <input
                        type="checkbox"
                        checked={formDropTimerEnabled}
                        onChange={(e) => setFormDropTimerEnabled(e.target.checked)}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>

                  <div className={styles.helperText}>
                    When enabled, this collection will be locked with a live countdown timer and announcement bar across the site until the scheduled drop time.
                  </div>

                  {formDropTimerEnabled && (
                    <>
                      <div className={styles.formGroup} style={{ marginTop: "4px" }}>
                        <label className={styles.formLabel}>Drop Date & Time *</label>
                        <input
                          type="datetime-local"
                          className={styles.formInput}
                          value={formDropDate}
                          onChange={(e) => setFormDropDate(e.target.value)}
                          required={formDropTimerEnabled}
                        />
                        <div className={styles.helperText}>
                          Select when the countdown reaches zero and the collection automatically unlocks to the public.
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Teaser Headline (Optional)</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="e.g. Exclusive Halloween Capsule Drop"
                          value={formDropHeadline}
                          onChange={(e) => setFormDropHeadline(e.target.value)}
                        />
                        <div className={styles.helperText}>
                          Displayed above the countdown timer on the locked teaser screen and announcement bar.
                        </div>
                      </div>

                      {formDropDate && (
                        <div className={styles.timerPreviewBox}>
                          <div className={styles.timerPreviewLabel}>Drop Status Preview</div>
                          <div className={styles.timerPreviewContent}>
                            {new Date(formDropDate).getTime() > Date.now() ? (
                              <>
                                <Lock size={15} color="#b45309" strokeWidth={1.7} />
                                <span>
                                  <strong>Locked:</strong> Unlocks on {new Date(formDropDate).toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <>
                                <Check size={15} color="#059669" strokeWidth={2} />
                                <span>
                                  <strong>Already Passed:</strong> Drop date is in the past — collection will be fully unlocked.
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Saving...
                    </>
                  ) : modalMode === "create" ? (
                    <>
                      <Plus size={16} strokeWidth={1.5} />
                      Create Collection
                    </>
                  ) : (
                    <>
                      <Check size={16} strokeWidth={1.5} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modalCard} style={{ maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle} style={{ color: "#dc2626" }}>Delete Collection?</h2>
              <button className={styles.iconBtn} onClick={() => setDeleteTarget(null)} style={{ border: "none" }}>
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text)", lineHeight: 1.5 }}>
                Are you sure you want to permanently delete the collection <strong>&quot;{deleteTarget.name}&quot;</strong>?
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                style={{ background: "#dc2626" }}
                onClick={confirmDelete}
              >
                Delete Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

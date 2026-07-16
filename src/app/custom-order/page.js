"use client";

import { useState } from "react";
import { nailShapes, nailLengths } from "@/data/categories";
import { SOCIAL_LINKS } from "@/lib/constants";
import pageStyles from "@/styles/pages/collection.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

const STEPS = [
  { id: 1, label: "Shape" },
  { id: 2, label: "Length" },
  { id: 3, label: "Design" },
  { id: 4, label: "Details" },
  { id: 5, label: "Review" },
];

const DESIGN_OPTIONS = [
  { id: "solid", name: "Solid Color", emoji: "🎨", description: "One beautiful color, perfectly applied" },
  { id: "french", name: "French Tips", emoji: "🤍", description: "Classic or colored French tip style" },
  { id: "ombre", name: "Ombré / Gradient", emoji: "🌅", description: "Smooth color transition" },
  { id: "glitter", name: "Glitter / Shimmer", emoji: "✨", description: "Add sparkle and shine" },
  { id: "art", name: "Nail Art", emoji: "🖌️", description: "Custom hand-painted designs" },
  { id: "marble", name: "Marble Effect", emoji: "🪨", description: "Elegant marble swirl patterns" },
  { id: "chrome", name: "Chrome / Mirror", emoji: "🪞", description: "High-shine metallic finish" },
  { id: "custom", name: "Upload Reference", emoji: "📷", description: "Send us your inspiration photo" },
];

export default function CustomOrderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [order, setOrder] = useState({
    shape: "",
    length: "",
    design: "",
    color: "",
    notes: "",
    referenceImage: null,
    name: "",
    email: "",
    phone: "",
  });

  const updateOrder = (field, value) => {
    setOrder({ ...order, [field]: value });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return order.shape !== "";
      case 2: return order.length !== "";
      case 3: return order.design !== "";
      case 4: return order.name !== "" && order.email !== "";
      default: return true;
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // 1. Save to database
      const res = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      
      if (!res.ok) {
        console.error("Failed to save custom order to database");
      }

      // 2. Format WhatsApp message
      const message = [
        "Hi! I'd like to place a custom order:",
        `Shape: ${order.shape}`,
        `Length: ${order.length}`,
        `Design: ${order.design}`,
        order.color && `Color: ${order.color}`,
        order.notes && `Notes: ${order.notes}`,
        `Name: ${order.name}`,
        `Email: ${order.email}`,
        order.phone && `WhatsApp: ${order.phone}`,
      ].filter(Boolean).join("\n");

      // 3. Open WhatsApp
      window.open(`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
      
      // Optional: Reset form or show success state here
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={pageStyles.customOrderPage} id="custom-order-page">
      <div className="container container--narrow">
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <h1 className={pageStyles.collectionTitle}>Custom Order</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-base)", marginTop: "var(--space-3)" }}>
            Design your dream nail set — we&apos;ll bring it to life ✨
          </p>
        </div>

        {/* Step Indicator */}
        <div className={pageStyles.stepIndicator}>
          {STEPS.map((step, i) => (
            <div key={step.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <div className={`${pageStyles.step} ${currentStep === step.id ? pageStyles.active : ""} ${currentStep > step.id ? pageStyles.completed : ""}`}>
                <span className={pageStyles.stepNumber}>
                  {currentStep > step.id ? "✓" : step.id}
                </span>
                <span className={pageStyles.stepLabel}>{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${pageStyles.stepLine} ${currentStep > step.id ? pageStyles.completed : ""}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div style={{ animation: "fadeInUp 300ms ease-out" }}>
          {/* Step 1: Shape */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontStyle: "italic", marginBottom: "var(--space-6)", textAlign: "center" }}>
                Pick Your Nail Shape
              </h2>
              <div className={pageStyles.shapeGrid}>
                {nailShapes.map((shape) => (
                  <button
                    key={shape.id}
                    className={`${pageStyles.shapeCard} ${order.shape === shape.id ? pageStyles.selected : ""}`}
                    onClick={() => updateOrder("shape", shape.id)}
                  >
                    <div className={pageStyles.shapeIcon}>{shape.icon}</div>
                    <div className={pageStyles.shapeName}>{shape.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Length */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontStyle: "italic", marginBottom: "var(--space-6)", textAlign: "center" }}>
                Choose Your Length
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
                {nailLengths.map((length) => (
                  <button
                    key={length.id}
                    className={`${pageStyles.shapeCard} ${order.length === length.id ? pageStyles.selected : ""}`}
                    onClick={() => updateOrder("length", length.id)}
                    style={{ padding: "var(--space-6)" }}
                  >
                    <div className={pageStyles.shapeName}>{length.name}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginTop: "var(--space-1)" }}>
                      {length.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Design */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontStyle: "italic", marginBottom: "var(--space-6)", textAlign: "center" }}>
                Select a Design Style
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "var(--space-4)" }}>
                {DESIGN_OPTIONS.map((design) => (
                  <button
                    key={design.id}
                    className={`${pageStyles.shapeCard} ${order.design === design.id ? pageStyles.selected : ""}`}
                    onClick={() => updateOrder("design", design.id)}
                    style={{ textAlign: "left", padding: "var(--space-5)" }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "var(--space-2)" }}>{design.emoji}</div>
                    <div className={pageStyles.shapeName}>{design.name}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginTop: "var(--space-1)" }}>
                      {design.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontStyle: "italic", marginBottom: "var(--space-6)", textAlign: "center" }}>
                Tell Us More
              </h2>
              <div style={{ maxWidth: 500, margin: "0 auto" }}>
                <div className={pageStyles.formGroup}>
                  <label className={pageStyles.formLabel} htmlFor="custom-color">Preferred Color(s)</label>
                  <input
                    className={pageStyles.formInput}
                    type="text"
                    id="custom-color"
                    value={order.color}
                    onChange={(e) => updateOrder("color", e.target.value)}
                    placeholder="e.g., Baby pink with gold accents"
                  />
                </div>

                <div className={pageStyles.formGroup}>
                  <label className={pageStyles.formLabel} htmlFor="custom-notes">Special Notes / Instructions</label>
                  <textarea
                    className={pageStyles.formInput}
                    id="custom-notes"
                    value={order.notes}
                    onChange={(e) => updateOrder("notes", e.target.value)}
                    placeholder="Any specific details about your design..."
                    rows={4}
                    style={{ resize: "vertical" }}
                  />
                </div>

                <div className={pageStyles.formGroup}>
                  <label className={pageStyles.formLabel} htmlFor="custom-ref">Reference Image (Optional)</label>
                  <div style={{
                    border: "2px dashed var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-8)",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}>
                    <p style={{ fontSize: "2rem", marginBottom: "var(--space-2)" }}>📷</p>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                      Drag & drop or click to upload
                    </p>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginTop: "var(--space-1)" }}>
                      PNG, JPG up to 5MB
                    </p>
                    <input type="file" accept="image/*" style={{ display: "none" }} id="custom-ref" />
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "var(--space-6)", marginTop: "var(--space-6)" }}>
                  <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: "var(--space-4)" }}>Your Contact Info</h3>
                  <div className={pageStyles.formGroup}>
                    <label className={pageStyles.formLabel} htmlFor="custom-name">Name</label>
                    <input className={pageStyles.formInput} type="text" id="custom-name" value={order.name} onChange={(e) => updateOrder("name", e.target.value)} required />
                  </div>
                  <div className={pageStyles.formRow}>
                    <div className={pageStyles.formGroup}>
                      <label className={pageStyles.formLabel} htmlFor="custom-email">Email</label>
                      <input className={pageStyles.formInput} type="email" id="custom-email" value={order.email} onChange={(e) => updateOrder("email", e.target.value)} required />
                    </div>
                    <div className={pageStyles.formGroup}>
                      <label className={pageStyles.formLabel} htmlFor="custom-phone">WhatsApp Number</label>
                      <input className={pageStyles.formInput} type="tel" id="custom-phone" value={order.phone} onChange={(e) => updateOrder("phone", e.target.value)} placeholder="+234" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div>
              <div className={pageStyles.reviewBox}>
                {[
                  { label: "Nail Shape", value: order.shape },
                  { label: "Length", value: order.length },
                  { label: "Design Style", value: order.design },
                  { label: "Color Preference", value: order.color || "Not specified" },
                  { label: "Notes", value: order.notes || "None" },
                  { label: "Name", value: order.name },
                  { label: "Email", value: order.email },
                  { label: "WhatsApp", value: order.phone || "Not provided" },
                ].map((row) => (
                  <div key={row.label} className={pageStyles.reviewBoxRow}>
                    <span style={{ color: "var(--color-text-secondary)" }}>{row.label}</span>
                    <span style={{ fontWeight: 500, textTransform: "capitalize", textAlign: "right", maxWidth: "60%" }}>{row.value}</span>
                  </div>
                ))}

                <div style={{
                  marginTop: "var(--space-6)",
                  padding: "var(--space-4)",
                  background: "var(--color-primary-50)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-primary-700)",
                  textAlign: "center",
                }}>
                  💰 Pricing will be sent to you after review. Custom nails start from ₦12,000.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step Actions */}
        <div className={pageStyles.stepActions}>
          <button
            className={`${btnStyles.btn} ${btnStyles.outline} ${btnStyles.md}`}
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            id="prev-step-btn"
          >
            ← Back
          </button>

          {currentStep < STEPS.length ? (
            <button
              className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.md}`}
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              id="next-step-btn"
            >
              Next →
            </button>
          ) : (
            <button
              className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.lg}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
              id="submit-custom-order-btn"
            >
              {isSubmitting ? "Processing..." : "Submit Custom Order ✨"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

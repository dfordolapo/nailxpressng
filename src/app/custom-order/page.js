"use client";

import { useState } from "react";
import { nailShapes, nailLengths } from "@/data/categories";
import { SOCIAL_LINKS } from "@/lib/constants";
import customStyles from "@/styles/pages/custom-order.module.css";
import btnStyles from "@/styles/components/buttons.module.css";
import { UploadCloud, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const STEPS = [
  { id: 1, label: "Shape" },
  { id: 2, label: "Length" },
  { id: 3, label: "Design" },
  { id: 4, label: "Details" },
  { id: 5, label: "Review" },
];

const DESIGN_OPTIONS = [
  { id: "solid", name: "Solid Color", description: "One beautiful color, perfectly applied" },
  { id: "french", name: "French Tips", description: "Classic or colored French tip style" },
  { id: "ombre", name: "Ombré / Gradient", description: "Smooth color transition" },
  { id: "glitter", name: "Glitter / Shimmer", description: "Add sparkle and shine" },
  { id: "art", name: "Nail Art", description: "Custom hand-painted designs" },
  { id: "marble", name: "Marble Effect", description: "Elegant marble swirl patterns" },
  { id: "chrome", name: "Chrome / Mirror", description: "High-shine metallic finish" },
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
  const [referenceImagePreview, setReferenceImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateOrder("referenceImage", file);
      setReferenceImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let imageUrl = null;
    
    try {
      // 1. Upload image to Supabase if exists
      if (order.referenceImage) {
        const fileExt = order.referenceImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('custom-orders')
          .upload(filePath, order.referenceImage);

        if (!uploadError) {
          const { data } = supabase.storage
            .from('custom-orders')
            .getPublicUrl(filePath);
          imageUrl = data.publicUrl;
        } else {
          console.error("Upload error:", uploadError);
        }
      }

      // 2. Save to database
      const orderData = { ...order, referenceImage: imageUrl };
      const res = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (!res.ok) {
        console.error("Failed to save custom order to database");
      }

      // 3. Format WhatsApp message
      const message = [
        "Hi! I'd like to place a custom order:",
        `Shape: ${order.shape}`,
        `Length: ${order.length}`,
        `Design: ${order.design}`,
        order.color && `Color: ${order.color}`,
        order.notes && `Notes: ${order.notes}`,
        imageUrl && `Reference Image: ${imageUrl}`,
        `Name: ${order.name}`,
        `Email: ${order.email}`,
        order.phone && `WhatsApp: ${order.phone}`,
      ].filter(Boolean).join("\n");

      // 4. Open WhatsApp
      window.open(`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className={customStyles.customOrderPage} id="custom-order-page">
      <div className="container container--narrow">
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "var(--color-primary)", marginBottom: "var(--space-2)" }}>
            Custom Order
          </h1>
          <p className={customStyles.customOrderSubtitle}>
            Design your dream nail set —<br className={customStyles.mobileBreak} /> we&apos;ll bring it to life
          </p>
        </div>

        {/* Beautiful Progress Bar */}
        <div className={customStyles.progressContainer}>
          <div className={customStyles.progressBarBackground}>
            <div 
              className={customStyles.progressBarFill} 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className={customStyles.stepLabels}>
            {STEPS.map((step) => (
              <span 
                key={step.id} 
                className={`${customStyles.stepLabel} ${currentStep === step.id ? customStyles.active : ""} ${currentStep > step.id ? customStyles.completed : ""}`}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div style={{ animation: "fadeInUp 300ms ease-out" }}>
          
          {/* Step 1: Shape */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontStyle: "italic", marginBottom: "var(--space-8)", textAlign: "center", color: "var(--color-text)" }}>
                Pick Your Nail Shape
              </h2>
              <div className={customStyles.shapeGrid}>
                {nailShapes.map((shape) => (
                  <button
                    key={shape.id}
                    className={`${customStyles.visualCard} ${order.shape === shape.id ? customStyles.selected : ""}`}
                    onClick={() => updateOrder("shape", shape.id)}
                  >
                    <div className={customStyles.cardImageContainer}>
                      <img src={shape.image} alt={`${shape.name} nail shape`} />
                    </div>
                    <div className={customStyles.cardTitle}>{shape.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Length */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontStyle: "italic", marginBottom: "var(--space-8)", textAlign: "center", color: "var(--color-text)" }}>
                Choose Your Length
              </h2>
              <div className={customStyles.shapeGrid}>
                {nailLengths.map((length) => (
                  <button
                    key={length.id}
                    className={`${customStyles.visualCard} ${order.length === length.id ? customStyles.selected : ""}`}
                    onClick={() => updateOrder("length", length.id)}
                    style={{ minHeight: "180px" }}
                  >
                    <div className={customStyles.cardTitle}>{length.name}</div>
                    <div className={customStyles.cardDescription}>{length.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Design */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontStyle: "italic", marginBottom: "var(--space-8)", textAlign: "center", color: "var(--color-text)" }}>
                Select a Design Style
              </h2>
              <div className={customStyles.shapeGrid}>
                {DESIGN_OPTIONS.map((design) => (
                  <button
                    key={design.id}
                    className={`${customStyles.visualCard} ${order.design === design.id ? customStyles.selected : ""}`}
                    onClick={() => updateOrder("design", design.id)}
                    style={{ minHeight: "160px" }}
                  >
                    {design.emoji && <div style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>{design.emoji}</div>}
                    <div className={customStyles.cardTitle} style={design.emoji ? {} : { marginBottom: "var(--space-2)" }}>{design.name}</div>
                    <div className={customStyles.cardDescription}>{design.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontStyle: "italic", marginBottom: "var(--space-8)", textAlign: "center", color: "var(--color-text)" }}>
                Tell Us More
              </h2>
              <div className={customStyles.glassForm}>
                <div className={customStyles.inputGroup}>
                  <label htmlFor="custom-color">Preferred Color(s)</label>
                  <input
                    type="text"
                    id="custom-color"
                    value={order.color}
                    onChange={(e) => updateOrder("color", e.target.value)}
                    placeholder="e.g., Baby pink with gold accents"
                  />
                </div>

                <div className={customStyles.inputGroup}>
                  <label htmlFor="custom-notes">Special Notes / Instructions</label>
                  <textarea
                    id="custom-notes"
                    value={order.notes}
                    onChange={(e) => updateOrder("notes", e.target.value)}
                    placeholder="Any specific details about your design..."
                    rows={4}
                    style={{ resize: "vertical" }}
                  />
                </div>

                <div className={customStyles.inputGroup}>
                  <label htmlFor="custom-ref">Reference Image (Optional)</label>
                  <div 
                    onClick={() => document.getElementById('custom-ref').click()}
                    style={{
                      border: referenceImagePreview ? "2px solid var(--color-primary)" : "2px dashed var(--color-border)",
                      borderRadius: "var(--radius-lg)",
                      padding: referenceImagePreview ? "var(--space-2)" : "var(--space-8)",
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: referenceImagePreview ? "var(--color-primary-50)" : "rgba(255, 255, 255, 0.4)",
                      transition: "all var(--transition-fast)",
                      position: "relative"
                    }}
                  >
                    {referenceImagePreview ? (
                      <div style={{ position: "relative", width: "100%", height: "150px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                        <img src={referenceImagePreview} alt="Reference preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", top: 8, right: 8, background: "white", borderRadius: "50%", padding: 2 }}>
                          <CheckCircle size={20} color="var(--color-primary)" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={32} color="var(--color-text-tertiary)" style={{ margin: "0 auto var(--space-3)" }} />
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                          Drag & drop or click to upload
                        </p>
                        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginTop: "var(--space-1)" }}>
                          PNG, JPG up to 5MB
                        </p>
                      </>
                    )}
                    <input type="file" accept="image/*" style={{ display: "none" }} id="custom-ref" onChange={handleFileChange} />
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "var(--space-6)", marginTop: "var(--space-8)" }}>
                  <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: "var(--space-4)" }}>Your Contact Info</h3>
                  <div className={customStyles.inputGroup}>
                    <label htmlFor="custom-name">Name</label>
                    <input type="text" id="custom-name" value={order.name} onChange={(e) => updateOrder("name", e.target.value)} required />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                    <div className={customStyles.inputGroup}>
                      <label htmlFor="custom-email">Email</label>
                      <input type="email" id="custom-email" value={order.email} onChange={(e) => updateOrder("email", e.target.value)} required />
                    </div>
                    <div className={customStyles.inputGroup}>
                      <label htmlFor="custom-phone">WhatsApp Number</label>
                      <input type="tel" id="custom-phone" value={order.phone} onChange={(e) => updateOrder("phone", e.target.value)} placeholder="+234" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontStyle: "italic", marginBottom: "var(--space-8)", textAlign: "center", color: "var(--color-text)" }}>
                Review Your Order
              </h2>
              <div className={customStyles.reviewSummary}>
                {[
                  { label: "Nail Shape", value: order.shape },
                  { label: "Length", value: order.length },
                  { label: "Design Style", value: order.design },
                  { label: "Reference Image", value: referenceImagePreview ? "Attached ✓" : "None" },
                  { label: "Color Preference", value: order.color || "Not specified" },
                  { label: "Notes", value: order.notes || "None" },
                  { label: "Name", value: order.name },
                  { label: "Email", value: order.email },
                  { label: "WhatsApp", value: order.phone || "Not provided" },
                ].map((row) => (
                  <div key={row.label} className={customStyles.reviewItem}>
                    <span className={customStyles.reviewLabel}>{row.label}</span>
                    <span className={customStyles.reviewValue} style={{ textTransform: row.label.includes("Email") || row.label.includes("WhatsApp") ? "none" : "capitalize" }}>
                      {row.value}
                    </span>
                  </div>
                ))}
                
                <div style={{
                  marginTop: "var(--space-6)",
                  padding: "var(--space-4)",
                  backgroundColor: "var(--color-primary-50)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-primary-200)",
                  textAlign: "center",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-primary-dark)",
                  fontWeight: 500
                }}>
                  Pricing will be communicated to you after we review your design requirements.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className={customStyles.navigationButtons}>
          <button
            className={`${btnStyles.btn} ${btnStyles.outline} ${btnStyles.md}`}
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            style={{ opacity: currentStep === 1 ? 0 : 1, pointerEvents: currentStep === 1 ? "none" : "auto" }}
          >
            ← Back
          </button>

          {currentStep < STEPS.length ? (
            <button
              className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.md}`}
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              Next Step →
            </button>
          ) : (
            <button
              className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.lg}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Submit Custom Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

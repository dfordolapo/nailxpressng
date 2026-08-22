"use client";

import { useState, useEffect, useRef } from "react";
import { nailShapes, nailLengths } from "@/data/categories";
import { SOCIAL_LINKS } from "@/lib/constants";
import customStyles from "@/styles/pages/custom-order.module.css";
import btnStyles from "@/styles/components/buttons.module.css";
import { UploadCloud, CheckCircle, ChevronLeft, ChevronRight, Download } from "lucide-react";
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
  const scrollRef = useRef(null);

  const isScrolling = useRef(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      isScrolling.current = true;
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  };


  const handleDownload = async (e, url, id) => {
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `inspiration-${id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Download failed", err);
      window.open(url, "_blank");
    }
  };
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
    inspirationUrl: null,
  });

  const [inspirations, setInspirations] = useState([]);

  const isHovered = useRef(false);
  const isTouch = useRef(false);

  useEffect(() => {
    let animationId;
    const scrollContainer = scrollRef.current;
    
    const autoScroll = () => {
      if (scrollContainer && !isHovered.current && !isScrolling.current && inspirations.length > 0) {
        scrollContainer.scrollLeft += 1;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
           scrollContainer.scrollLeft -= scrollContainer.scrollWidth / 2;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };
    
    animationId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationId);
  }, [inspirations]);

  useEffect(() => {
    const fetchInspirations = async () => {
      try {
        const res = await fetch('/api/inspirations');
        const data = await res.json();
        if (data.images) {
          setInspirations(data.images);
        }
      } catch (err) {
        console.error("Failed to load local inspirations", err);
      }
    };
    fetchInspirations();
  }, []);

  const updateOrder = (field, value) => {
    setOrder({ ...order, [field]: value });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return order.shape !== "" || !!order.inspirationUrl;
      case 2: return order.length !== "";
      case 3: return order.design !== "" || !!order.inspirationUrl;
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
      updateOrder("inspirationUrl", null); // Clear selected inspiration if they upload a file
      setReferenceImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSelectInspiration = (url) => {
    if (order.inspirationUrl === url) {
      setOrder(prev => ({ ...prev, inspirationUrl: null }));
      setReferenceImagePreview(null);
    } else {
      setOrder(prev => ({ ...prev, inspirationUrl: url, referenceImage: null }));
      setReferenceImagePreview(url);
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
      // Prefer uploaded image, otherwise fallback to selected inspiration URL
      const finalImageUrl = imageUrl || order.inspirationUrl;
      const orderData = { ...order, referenceImage: finalImageUrl };
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

        {/* Beautiful Progress Dots */}
        <div className={customStyles.progressContainer}>
          <div className={customStyles.stepDots}>
            {STEPS.map((step) => (
              <div key={step.id} className={customStyles.stepDotWrapper}>
                <div 
                  className={`${customStyles.stepDot} ${currentStep === step.id ? customStyles.activeDot : ""} ${currentStep > step.id ? customStyles.completedDot : ""}`}
                >
                  {currentStep > step.id ? "✓" : step.id}
                </div>
                <span 
                  className={`${customStyles.stepLabel} ${currentStep === step.id ? customStyles.active : ""} ${currentStep > step.id ? customStyles.completed : ""}`}
                >
                  {step.label}
                </span>
              </div>
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

              {inspirations.length > 0 && (
                <div className={customStyles.inputGroup} style={{ marginTop: "var(--space-8)" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "var(--space-2)", textAlign: "center", color: "var(--color-primary-800)" }}>
                    Or Browse Our Inspirations
                  </h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)", textAlign: "center" }}>
                    Select a beautiful pre-designed set as your reference or download it.
                  </p>
                  
                  <div 
                    style={{ position: "relative", display: "flex", alignItems: "center" }}
                    onMouseEnter={() => { if (!isTouch.current) isHovered.current = true; }}
                    onMouseLeave={() => isHovered.current = false}
                    onTouchStart={() => { isTouch.current = true; isHovered.current = true; }}
                    onTouchEnd={() => { isHovered.current = false; setTimeout(() => isTouch.current = false, 500); }}
                  >
                    <button 
                      onClick={() => scroll('left')}
                      style={{ position: "absolute", left: "-16px", zIndex: 10, background: "white", borderRadius: "50%", padding: "6px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", border: "1px solid var(--color-border-light)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <ChevronLeft size={24} color="var(--color-text)" />
                    </button>
                    
                    <div 
                      ref={scrollRef} 
                      style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "16px", msOverflowStyle: "none", scrollbarWidth: "none", scrollBehavior: "auto", width: "100%" }}
                    >
                      {inspirations.map((insp) => (
                        <div 
                          key={insp.id}
                          onClick={() => handleSelectInspiration(insp.image_url)}
                          style={{
                            minWidth: "160px",
                            height: "160px",
                            borderRadius: "var(--radius-lg)",
                            overflow: "hidden",
                            cursor: "pointer",
                            border: order.inspirationUrl === insp.image_url ? "4px solid var(--color-primary)" : "2px solid transparent",
                            transition: "all 0.2s ease",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                            position: "relative",
                            flexShrink: 0
                          }}
                        >
                          <img src={insp.image_url} alt="Inspiration" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          {order.inspirationUrl === insp.image_url && (
                            <div style={{ position: "absolute", top: 8, right: 8, background: "white", borderRadius: "50%", padding: 2 }}>
                              <CheckCircle size={20} color="var(--color-primary)" />
                            </div>
                          )}
                          {order.inspirationUrl !== insp.image_url && (
                            <button
                              onClick={(e) => handleDownload(e, insp.image_url, insp.id)}
                              style={{
                                position: "absolute",
                                bottom: 8,
                                right: 8,
                                background: "white",
                                borderRadius: "50%",
                                padding: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "transform 0.2s"
                              }}
                              title="Download Inspiration"
                              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                              <Download size={16} color="var(--color-text)" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => scroll('right')}
                      style={{ position: "absolute", right: "-16px", zIndex: 10, background: "white", borderRadius: "50%", padding: "6px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", border: "1px solid var(--color-border-light)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <ChevronRight size={24} color="var(--color-text)" />
                    </button>
                  </div>
                </div>
              )}
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
                  <label htmlFor="custom-ref">Upload Your Own Reference (Optional)</label>
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSavedAddresses } from "@/lib/useSavedAddresses";
import { formatPrice, calculateCartTotals } from "@/lib/utils";
import nigeriaData from "@/lib/nigeria.json";
import pageStyles from "@/styles/pages/collection.module.css";
import cartStyles from "@/styles/components/cart.module.css";
import btnStyles from "@/styles/components/buttons.module.css";
import addrStyles from "@/styles/components/checkoutAddresses.module.css";
import { Home, Building2, Gift, Bookmark, Plus, Check, Trash2, MapPin, Sparkles } from "lucide-react";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const { subtotal, shipping, total } = calculateCartTotals(items);
  const [formData, setFormData] = useState({
    presetLabel: "Home",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
  });
  const [shippingMethod, setShippingMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [shippingLocations, setShippingLocations] = useState([]);
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  // Saved Addresses hook
  const {
    addresses,
    activeAddressId,
    activeAddress,
    isLoaded,
    selectAddress,
    saveAddress,
    deleteAddress,
  } = useSavedAddresses();

  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [savePresetTag, setSavePresetTag] = useState("home");
  const [customTagInput, setCustomTagInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Sync saved address details into formData when active address changes
  useEffect(() => {
    if (isLoaded && activeAddress && selectedPresetId) {
      setFormData({
        presetLabel: activeAddress.label || activeAddress.presetLabel || "Home",
        fullName: activeAddress.fullName || "",
        email: activeAddress.email || "",
        phone: activeAddress.phone || "",
        address: activeAddress.address || "",
        state: activeAddress.state || "",
        city: activeAddress.city || "",
      });
      setSavePresetTag(activeAddress.tag || activeAddress.id);
    }
  }, [isLoaded, activeAddressId, selectedPresetId]);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.delivery_locations && data.delivery_locations.length > 0) {
            setShippingLocations(data.delivery_locations);
          } else {
            // Fallback
            const fallback = [{ id: "standard", name: "Standard Delivery", fee: data.shipping_standard || 2500 }];
            setShippingLocations(fallback);
          }
        }
      } catch (error) {
        console.error("Failed to fetch shipping locations", error);
      } finally {
        setIsLoadingRates(false);
      }
    }
    fetchRates();
  }, []);

  const selectedLocation = shippingLocations.find(loc => loc.id === shippingMethod);
  const shippingFeeAmount = selectedLocation ? selectedLocation.fee : 0;
  const finalTotal = subtotal + shippingFeeAmount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      setFormData({ ...formData, state: value, city: "" }); // Reset city when state changes
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const selectedStateData = nigeriaData.find(s => s.state === formData.state);
  const availableLgas = selectedStateData ? selectedStateData.lgas : [];

  const renderPresetIcon = (tag) => {
    switch (tag) {
      case "home":
        return <Home size={16} strokeWidth={1.25} />;
      case "office":
        return <Building2 size={16} strokeWidth={1.25} />;
      case "gift":
        return <Gift size={16} strokeWidth={1.25} />;
      default:
        return <Bookmark size={16} strokeWidth={1.25} />;
    }
  };

  const handleSelectPreset = (preset) => {
    if (preset.id === "new") {
      setSelectedPresetId("new");
      setFormData({
        presetLabel: "My Custom Address",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        state: "",
        city: "",
      });
      setSavePresetTag("custom");
      setShowCustomInput(true);
      setCustomTagInput("My Custom Address");
      setIsAddressFormOpen(true);
    } else {
      if (selectedPresetId === preset.id) {
        // Toggle if clicking the currently active preset
        setIsAddressFormOpen(!isAddressFormOpen);
      } else {
        selectAddress(preset.id);
        setIsAddressFormOpen(true);
      }
    }
  };

  const handleManualSavePreset = () => {
    const customLabel = formData.presetLabel.trim() || customTagInput.trim() || "Saved Address";
    const targetTag = selectedPresetId === "new"
      ? `custom_${Date.now()}`
      : (selectedPresetId || "home");

    saveAddress(formData, targetTag, customLabel);
    setSaveSuccessMsg(`Saved as "${customLabel}"!`);
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Auto-update saved preset with these latest details on checkout
      if (selectedPresetId !== "new") {
        saveAddress(formData, selectedPresetId);
      }

      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const orderPayload = {
        formData: { ...formData, firstName, lastName },
        items,
        shippingMethod,
        paymentMethod,
        subtotal,
        shippingFee: shippingFeeAmount,
        total: finalTotal
      };
      
      const processOrderToBackend = async (reference = null) => {
        if (reference) orderPayload.transactionReference = reference;
        
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to place order');

        if (clearCart) clearCart();
        router.push(`/checkout/success?orderId=${data.orderId}`);
      };

      if (paymentMethod === "paystack") {
        const PaystackPop = (await import('@paystack/inline-js')).default;
        const paystack = new PaystackPop();
        
        paystack.newTransaction({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_dummy",
          email: formData.email,
          amount: finalTotal * 100, // Paystack expects kobo
          currency: 'NGN',
          firstname: firstName,
          lastname: lastName,
          phone: formData.phone,
          onSuccess: async (transaction) => {
            try {
              await processOrderToBackend(transaction.reference);
            } catch (err) {
              console.error("Order save error after payment:", err);
              alert("Payment was successful, but there was an error saving your order. Please contact support with your email.");
              setIsSubmitting(false);
            }
          },
          onCancel: () => {
            setIsSubmitting(false);
          }
        });
      } else {
        await processOrderToBackend();
      }
      
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className={pageStyles.checkoutPage}>
        <div className="container" style={{ textAlign: "center", padding: "var(--space-20) 0" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-3xl)", marginBottom: "var(--space-4)" }}>
            Nothing to checkout
          </h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
            Your cart is empty. Add some nails first!
          </p>
          <Link href="/" className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.lg}`}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={pageStyles.checkoutPage} id="checkout-page">
      <div className="container" style={{ maxWidth: "600px" }}>
        
        {/* Sticky Header + Step Progress Bar Container */}
        <div style={{
          position: "sticky",
          top: "calc(var(--header-height) + var(--space-4) + 8px)",
          zIndex: 90,
          background: "rgba(253, 246, 247, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          paddingTop: "var(--space-3)",
          paddingBottom: "var(--space-3)",
          paddingLeft: "var(--space-4)",
          paddingRight: "var(--space-4)",
          marginBottom: "var(--space-6)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-sm)",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
            <Link href="/cart" style={{ color: "var(--color-primary-light)", display: "flex", alignItems: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </Link>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-primary)", margin: 0, lineHeight: 1 }}>Checkout</h1>
            <div style={{ width: 24 }}></div>
          </div>

          {/* Dynamic Step Progress Bar */}
          {(() => {
            const isAddressComplete = Boolean(
              formData.fullName && formData.email && formData.phone && formData.address && formData.state && formData.city
            );
            const isDeliveryComplete = isAddressComplete && Boolean(shippingMethod);

            const scrollToStep = (stepId) => {
              const el = document.getElementById(stepId);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            };

            return (
              <div className={pageStyles.stepIndicator} style={{ marginBottom: 0 }}>
                {/* Step 1: Address */}
                <div 
                  className={`${pageStyles.step} ${pageStyles.active} ${isAddressComplete ? pageStyles.completed : ""}`}
                  onClick={() => scrollToStep("checkout-step-1")}
                  style={{ cursor: "pointer" }}
                >
                  <div className={pageStyles.stepNumber}>
                    {isAddressComplete ? <Check size={16} strokeWidth={2} /> : "1"}
                  </div>
                  <span className={pageStyles.stepLabel}>Address</span>
                </div>

                <div className={`${pageStyles.stepLine} ${isAddressComplete ? pageStyles.completed : ""}`} />

                {/* Step 2: Delivery */}
                <div 
                  className={`${pageStyles.step} ${isAddressComplete ? pageStyles.active : ""} ${isDeliveryComplete ? pageStyles.completed : ""}`}
                  onClick={() => scrollToStep("checkout-step-2")}
                  style={{ cursor: "pointer" }}
                >
                  <div className={pageStyles.stepNumber}>
                    {isDeliveryComplete ? <Check size={16} strokeWidth={2} /> : "2"}
                  </div>
                  <span className={pageStyles.stepLabel}>Delivery</span>
                </div>

                <div className={`${pageStyles.stepLine} ${isDeliveryComplete ? pageStyles.completed : ""}`} />

                {/* Step 3: Summary */}
                <div 
                  className={`${pageStyles.step} ${isDeliveryComplete ? pageStyles.active : ""}`}
                  onClick={() => scrollToStep("checkout-step-3")}
                  style={{ cursor: "pointer" }}
                >
                  <div className={pageStyles.stepNumber}>3</div>
                  <span className={pageStyles.stepLabel}>Summary</span>
                </div>
              </div>
            );
          })()}
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Step 1: Shipping Address */}
          <div id="checkout-step-1" style={{ marginBottom: "var(--space-8)", scrollMarginTop: "160px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "var(--space-3)" }}>Shipping Address</h3>
            
            {/* Saved Addresses Selector Chips */}
            <div className={addrStyles.container}>
              <div className={addrStyles.presetHeaderRow}>
                <span className={addrStyles.presetHeaderTitle}>
                  <Bookmark size={14} strokeWidth={1.25} /> Select Saved Details:
                </span>
              </div>

              <div className={addrStyles.presetGrid}>
                {addresses.map((preset) => {
                  const isActive = selectedPresetId === preset.id;
                  const hasLocation = preset.city && preset.state;
                  const locationPreview = hasLocation ? `${preset.city}, ${preset.state}` : "Not set";

                  return (
                    <div
                      key={preset.id}
                      className={`${addrStyles.presetCard} ${isActive ? addrStyles.active : ""}`}
                      onClick={() => handleSelectPreset(preset)}
                    >
                      {isActive && <div className={addrStyles.activeDot} />}
                      <div className={addrStyles.presetBadge}>
                        <span className={addrStyles.presetIcon}>
                          {renderPresetIcon(preset.tag || preset.id)}
                        </span>
                        <span>{preset.label}</span>
                      </div>
                      <span className={addrStyles.presetSubtext}>{locationPreview}</span>
                    </div>
                  );
                })}

                {/* Add New Option */}
                <div
                  className={`${addrStyles.presetCard} ${selectedPresetId === "new" ? addrStyles.active : ""}`}
                  onClick={() => handleSelectPreset({ id: "new" })}
                >
                  {selectedPresetId === "new" && <div className={addrStyles.activeDot} />}
                  <div className={addrStyles.presetBadge}>
                    <span className={addrStyles.presetIcon} style={{ color: "var(--color-text-secondary)" }}>
                      <Plus size={16} strokeWidth={1.25} />
                    </span>
                    <span>New</span>
                  </div>
                  <span className={addrStyles.presetSubtext}>Type new details</span>
                </div>
              </div>
            </div>

            {isAddressFormOpen && (
              <div style={{ background: "white", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", marginTop: "var(--space-3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)", paddingBottom: "var(--space-2)", borderBottom: "1px solid var(--color-border-light)" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-primary-800)" }}>
                    Editing: <span style={{ color: "var(--color-primary)" }}>{formData.presetLabel || "Address Details"}</span>
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setIsAddressFormOpen(false)}
                    style={{ background: "none", border: "none", color: "var(--color-text-tertiary)", fontSize: "0.75rem", cursor: "pointer", fontWeight: 500 }}
                  >
                    Collapse inputs ▲
                  </button>
                </div>

                {/* Name-able Preset Label */}
                <div style={{ marginBottom: "var(--space-4)" }}>
                  <label htmlFor="presetLabel" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem", marginBottom: "4px", color: "var(--color-primary-800)", fontWeight: 600 }}>
                    <Bookmark size={13} strokeWidth={1.5} /> Address Name / Label
                  </label>
                  <input
                    type="text"
                    id="presetLabel"
                    name="presetLabel"
                    value={formData.presetLabel || ""}
                    onChange={(e) => {
                      handleChange(e);
                      if (showCustomInput) setCustomTagInput(e.target.value);
                    }}
                    placeholder="e.g. Home, Mum's Place, Lekki Studio, Office"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-primary-200)",
                      background: "var(--color-primary-50)",
                      outline: "none",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "var(--color-text)"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "var(--space-4)" }}>
                  <label htmlFor="fullName" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>Full Name</label>
                  <input required type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Jane Doe" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--color-border)", outline: "none" }} />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                  <div>
                    <label htmlFor="email" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>Email Address</label>
                    <input required type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--color-border)", outline: "none" }} />
                  </div>
                  <div>
                    <label htmlFor="phone" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>Phone Number</label>
                    <input required type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="08012345678" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--color-border)", outline: "none" }} />
                  </div>
                </div>

                <div style={{ marginBottom: "var(--space-4)" }}>
                  <label htmlFor="address" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>Street Address</label>
                  <input required type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Fashion Street, Apt 4B" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--color-border)", outline: "none" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                  <div>
                    <label htmlFor="state" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>State</label>
                    <select required id="state" name="state" value={formData.state} onChange={handleChange} style={{ width: "100%", padding: "10px 32px 10px 10px", borderRadius: "8px", border: "1px solid var(--color-border)", outline: "none", fontSize: "0.875rem", appearance: "none", background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23666\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>') no-repeat right 12px center / 16px 16px white" }}>
                      <option value="">Select State</option>
                      {nigeriaData.map(s => (
                        <option key={s.state} value={s.state}>{s.state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="city" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>City / LGA</label>
                    <select required id="city" name="city" value={formData.city} onChange={handleChange} disabled={!formData.state} style={{ width: "100%", padding: "10px 32px 10px 10px", borderRadius: "8px", border: "1px solid var(--color-border)", outline: "none", fontSize: "0.875rem", appearance: "none", background: `url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23666\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>') no-repeat right 12px center / 16px 16px ${formData.state ? "white" : "var(--color-background-alt)"}` }}>
                      <option value="">Select City / LGA</option>
                      {availableLgas.map(lga => (
                        <option key={lga} value={lga}>{lga}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick Save / Update Action Bar */}
                <div className={addrStyles.saveActionBar}>
                  <div className={addrStyles.saveTagSelector}>
                    <span className={addrStyles.tagLabel}>Save as preset:</span>
                    <button
                      type="button"
                      className={`${addrStyles.tagBtn} ${savePresetTag === "home" && !showCustomInput ? addrStyles.selected : ""}`}
                      onClick={() => { setSavePresetTag("home"); setShowCustomInput(false); }}
                    >
                      <Home size={12} strokeWidth={1.25} /> Home
                    </button>
                    <button
                      type="button"
                      className={`${addrStyles.tagBtn} ${savePresetTag === "office" && !showCustomInput ? addrStyles.selected : ""}`}
                      onClick={() => { setSavePresetTag("office"); setShowCustomInput(false); }}
                    >
                      <Building2 size={12} strokeWidth={1.25} /> Office
                    </button>
                    <button
                      type="button"
                      className={`${addrStyles.tagBtn} ${savePresetTag === "gift" && !showCustomInput ? addrStyles.selected : ""}`}
                      onClick={() => { setSavePresetTag("gift"); setShowCustomInput(false); }}
                    >
                      <Gift size={12} strokeWidth={1.25} /> Gift
                    </button>
                    <button
                      type="button"
                      className={`${addrStyles.tagBtn} ${showCustomInput ? addrStyles.selected : ""}`}
                      onClick={() => setShowCustomInput(!showCustomInput)}
                    >
                      <Plus size={12} strokeWidth={1.25} /> Custom Tag
                    </button>

                    {showCustomInput && (
                      <input
                        type="text"
                        placeholder="e.g. Mom's House"
                        value={customTagInput}
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--color-primary)",
                          fontSize: "0.75rem",
                          outline: "none",
                          width: "120px"
                        }}
                      />
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    {saveSuccessMsg ? (
                      <span className={addrStyles.savedFeedback}>
                        <Check size={14} strokeWidth={1.5} /> {saveSuccessMsg}
                      </span>
                    ) : (
                      <button type="button" onClick={handleManualSavePreset} className={addrStyles.saveBtn}>
                        <Sparkles size={14} strokeWidth={1.25} /> Save Details
                      </button>
                    )}

                    {selectedPresetId && selectedPresetId !== "new" && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Clear saved details for ${activeAddress?.label || 'this preset'}?`)) {
                            deleteAddress(selectedPresetId);
                            setFormData({ presetLabel: "Home", fullName: "", email: "", phone: "", address: "", state: "", city: "" });
                          }
                        }}
                        className={addrStyles.deleteBtn}
                        title="Clear this saved address"
                      >
                        <Trash2 size={13} strokeWidth={1.25} /> Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          
          {/* Step 2: Delivery Location */}
          <div id="checkout-step-2" style={{ marginBottom: "var(--space-8)", scrollMarginTop: "160px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "var(--space-3)" }}>Delivery Location</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {isLoadingRates ? (
                <div style={{ padding: "var(--space-4)", textAlign: "center", color: "var(--color-text-secondary)" }}>Loading delivery locations...</div>
              ) : shippingLocations.map((loc) => (
                <div 
                  key={loc.id}
                  onClick={() => setShippingMethod(loc.id)}
                  style={{ 
                    background: shippingMethod === loc.id ? "var(--color-primary-50)" : "white", 
                    border: `1px solid ${shippingMethod === loc.id ? "var(--color-primary)" : "var(--color-border-light)"}`, 
                    borderRadius: "var(--radius-lg)", padding: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" 
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${shippingMethod === loc.id ? "var(--color-primary)" : "var(--color-border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {shippingMethod === loc.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-primary)" }}></div>}
                    </div>
                    <span style={{ fontWeight: 500 }}>{loc.name}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>{formatPrice(loc.fee)}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Step 3: Order Summary */}
          <div id="checkout-step-3" style={{ marginBottom: "var(--space-8)", scrollMarginTop: "160px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "var(--space-3)" }}>Order Summary</h3>
            
            <div style={{ background: "white", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Subtotal ({items.length} items)</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-4)", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Shipping</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(shippingFeeAmount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 700, paddingTop: "var(--space-3)", borderTop: "1px dashed var(--color-border)" }}>
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${btnStyles.btn} ${btnStyles.lg}`}
              style={{ 
                background: isSubmitting ? "var(--color-primary-400)" : "var(--color-primary)", 
                color: "white", 
                border: "none", 
                borderRadius: "12px", 
                margin: "0 auto var(--space-4) auto", 
                display: "flex", 
                width: "100%", 
                maxWidth: "280px",
                justifyContent: "center",
                cursor: isSubmitting ? "not-allowed" : "pointer"
              }}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              SSL Secured Checkout
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

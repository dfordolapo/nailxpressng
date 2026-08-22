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
import { Home, Building2, Gift, Bookmark, Plus, Check, Trash2, MapPin, Sparkles, Edit2, Clock } from "lucide-react";

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
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [shippingLocations, setShippingLocations] = useState([]);
  const [deliveryPresets, setDeliveryPresets] = useState(null);
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

  const [selectedPresetId, setSelectedPresetId] = useState("home");
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [savePresetTag, setSavePresetTag] = useState("home");
  const [customTagInput, setCustomTagInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Sync saved address details into formData when active address changes
  useEffect(() => {
    if (isLoaded && activeAddress && selectedPresetId && selectedPresetId !== "new") {
      let finalPresetLabel = activeAddress.presetLabel !== undefined ? activeAddress.presetLabel : activeAddress.label;
      
      if (finalPresetLabel === "Gift / Recipient" || activeAddress.id === "gift") {
        finalPresetLabel = "";
      } else if (!finalPresetLabel) {
        finalPresetLabel = "Home";
      }

      setFormData({
        presetLabel: finalPresetLabel,
        fullName: activeAddress.fullName || "",
        email: activeAddress.email || "",
        phone: activeAddress.phone || "",
        address: activeAddress.address || "",
        state: activeAddress.state || "",
        city: activeAddress.city || "",
      });
      setSavePresetTag(activeAddress.tag || activeAddress.id);
    }
  }, [isLoaded, activeAddress, selectedPresetId]);

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
          if (data.delivery_presets) {
            setDeliveryPresets(data.delivery_presets);
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
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (name === "state") {
      setFormData({ ...formData, state: value, city: "" }); // Reset city when state changes
      if (errors.city) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.city;
          return next;
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const errs = {};
    const name = formData.fullName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    if (!name) errs.fullName = "Please enter your full name";
    if (!email) {
      errs.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!phone) {
      errs.phone = "Please enter your phone number";
    } else if (!/^(?:\+?234|0)[0-9]{10}$/.test(phone.replace(/\s/g, ""))) {
      errs.phone = "Please enter a valid phone number (e.g. 08012345678)";
    }
    if (!formData.address.trim()) errs.address = "Please enter your street address";
    if (!formData.state) errs.state = "Please select your state";
    if (!formData.city) errs.city = "Please select your city / LGA";
    return errs;
  };

  const focusFirstError = () => {
    const el = document.getElementById("checkout-step-1");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setIsAddressFormOpen(true);
  };

  const selectedStateData = nigeriaData.find(s => s.state === formData.state);
  const availableLgas = selectedStateData ? selectedStateData.lgas : [];

  const renderPresetIcon = (tag) => {
    switch (tag) {
      case "home":
        return <Home size={15} strokeWidth={1.5} style={{ color: "var(--color-primary)", marginRight: '4px' }} />;
      case "office":
        return <Building2 size={15} strokeWidth={1.5} style={{ color: "var(--color-primary)", marginRight: '4px' }} />;
      case "gift":
        return <Gift size={15} strokeWidth={1.5} style={{ color: "var(--color-primary)", marginRight: '4px' }} />;
      default:
        if (tag && tag.toLowerCase().includes("gift")) return <Gift size={15} strokeWidth={1.5} style={{ color: "var(--color-primary)", marginRight: '4px' }} />;
        return <Bookmark size={15} strokeWidth={1.5} style={{ color: "var(--color-primary)", marginRight: '4px' }} />;
    }
  };

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    
    if (preset.id === "new") {
      setFormData({
        presetLabel: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        state: "",
        city: "",
      });
      setSavePresetTag("gift");
      setShowCustomInput(true);
      setCustomTagInput("");
      setIsAddressFormOpen(true); // Open immediately for new
    } else {
      selectAddress(preset.id);
      setShowCustomInput(false);
      setIsAddressFormOpen(false); // Do not expand immediately for existing preset cards
    }
  };

  const handleManualSavePreset = () => {
    const customLabel = formData.presetLabel.trim() || customTagInput.trim() || "Saved Address";
    const targetTag = selectedPresetId === "new"
      ? `custom_${Date.now()}`
      : (selectedPresetId || "home");

    const newId = saveAddress({ ...formData, tag: savePresetTag }, targetTag, customLabel);
    setSelectedPresetId(newId);
    setSaveSuccessMsg("✓ Saved for future orders");
    setTimeout(() => {
      setSaveSuccessMsg("");
      setIsAddressFormOpen(false); // Auto-collapse the form back into the card
    }, 1500);
  };

  const getComputedDeliveryTime = (locName) => {
    if (!deliveryPresets || items.length === 0) return "3-5 Business Days"; // fallback

    const nameLower = locName.toLowerCase();
    const isLagos = (nameLower.includes("lagos") || nameLower.includes("island") || nameLower.includes("mainland")) && !nameLower.includes("outside");
    const region = isLagos ? 'lagos' : 'outside';

    // Priority ranking: Custom > Handmade > Factory
    let highestPriority = 0;
    let selectedCategory = 'factory';
    
    items.forEach(item => {
      const cat = item.category?.toLowerCase() || 'factory';
      let priority = 1; // factory
      if (cat === 'handmade') priority = 2;
      if (cat === 'custom') priority = 3;
      
      if (priority > highestPriority) {
        highestPriority = priority;
        selectedCategory = cat;
      }
    });

    if (deliveryPresets[selectedCategory] && deliveryPresets[selectedCategory][region]) {
      return deliveryPresets[selectedCategory][region];
    }

    return "3-5 Business Days";
  };

  const getDeliveryDetails = (locName) => {
    const nameLower = locName.toLowerCase();
    let desc = "Tracked nationwide courier service direct to your doorstep.";
    
    if (nameLower.includes("island")) {
      desc = "Perfect for urgent beauty needs. Delivered via our dedicated Island riders.";
    } else if (nameLower.includes("mainland")) {
      desc = "Delivered safely via our mainland dispatch network.";
    }

    return {
      est: getComputedDeliveryTime(locName),
      desc
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setIsSubmitting(false);
      focusFirstError();
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Auto-update saved preset with these latest details on checkout
      if (selectedPresetId !== "new") {
        saveAddress({ ...formData, tag: savePresetTag }, selectedPresetId);
      }

      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const selectedLoc = shippingLocations.find(loc => loc.id === shippingMethod);
      const deliveryTimeVal = selectedLoc ? (selectedLoc.estimated_time || getComputedDeliveryTime(selectedLoc.name)) : "3-5 days";
      const shippingMethodNameVal = selectedLoc ? selectedLoc.name : "";

      const orderPayload = {
        formData: { ...formData, firstName, lastName },
        items,
        shippingMethod,
        shippingMethodName: shippingMethodNameVal,
        deliveryTime: deliveryTimeVal,
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
        router.push(`/checkout/success?orderId=${data.orderId}&delivery=${encodeURIComponent(deliveryTimeVal)}`);
      };

      const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      const isPaystackKeyValid = paystackKey && paystackKey !== "pk_test_dummy" && paystackKey.trim() !== "";

      if (paymentMethod === "paystack" && isPaystackKeyValid) {
        const PaystackPop = (await import('@paystack/inline-js')).default;
        const paystack = new PaystackPop();
        
        paystack.newTransaction({
          key: paystackKey,
          email: formData.email,
          amount: finalTotal * 100, // Paystack expects kobo
          currency: 'NGN',
          firstname: firstName,
          lastname: lastName,
          phone: formData.phone,
          onSuccess: async (transaction) => {
            setIsConfirmingOrder(true);
            try {
              await processOrderToBackend(transaction.reference);
            } catch (err) {
              console.error("Order save error after payment:", err);
              alert("Payment was successful, but there was an error saving your order. Please contact support with your email.");
              setIsSubmitting(false);
              setIsConfirmingOrder(false);
            }
          },
          onCancel: () => {
            setIsSubmitting(false);
          }
        });
      } else {
        // Direct order processing for testing mode or non-Paystack methods
        await processOrderToBackend(paymentMethod === "paystack" ? "test_mode_bypass" : null);
      }
      
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  const isAddressComplete = Boolean(
    formData.fullName && formData.email && formData.phone && formData.address && formData.state && formData.city
  );
  const isDeliveryComplete = isAddressComplete && Boolean(shippingMethod);

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

  const isGift = activeAddress?.tag === "gift" || activeAddress?.id === "gift" || savePresetTag === "gift";

  return (
    <>
      {isConfirmingOrder && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(255, 255, 255, 0.9)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)"
        }}>
          <div style={{ width: 48, height: 48, border: "4px solid var(--color-primary-200)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "checkout-spin 1s linear infinite" }} />
          <h2 style={{ color: "var(--color-primary)", fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>Verifying your payment...</h2>
          <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>Please don't close this page</p>
          <style>{`@keyframes checkout-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      
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

        <form onSubmit={handleSubmit} noValidate>
          
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
                  const locationPreview = hasLocation 
                    ? `${preset.city}, ${preset.state}` 
                    : (preset.id === "gift" ? "Send to someone else" : "Not set");

                  return (
                    <div
                      key={preset.id}
                      className={`${addrStyles.presetCard} ${isActive ? addrStyles.active : ""}`}
                      onClick={() => handleSelectPreset(preset)}
                      style={{ paddingRight: isActive ? "50px" : "12px", position: "relative" }}
                    >
                      {isActive && <div className={addrStyles.activeDot} />}
                      <div className={addrStyles.presetBadge}>
                        <span className={addrStyles.presetIcon}>
                          {renderPresetIcon(preset.tag || preset.id)}
                        </span>
                        <span>{preset.label}</span>
                      </div>
                      <span className={addrStyles.presetSubtext}>{locationPreview}</span>

                      {isActive && preset.id !== "new" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsAddressFormOpen(!isAddressFormOpen);
                          }}
                          style={{
                            position: "absolute",
                            right: "8px",
                            bottom: "8px",
                            background: "var(--color-primary-100)",
                            color: "var(--color-primary)",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "2px"
                          }}
                        >
                          <Edit2 size={10} /> {isAddressFormOpen ? "Close" : "Edit"}
                        </button>
                      )}
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
                    <span>New Address</span>
                  </div>
                  <span className={addrStyles.presetSubtext}>Type new details</span>
                </div>
              </div>
            </div>

            {isAddressFormOpen && (
              <div style={{ background: "white", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", marginTop: "var(--space-3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)", paddingBottom: "var(--space-2)", borderBottom: "1px solid var(--color-border-light)" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-primary-800)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    {isGift ? (
                      <>
                        <Gift size={14} strokeWidth={1.5} /> Who are you sending this to?
                      </>
                    ) : `Editing: ${formData.presetLabel || "Address Details"}`}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setIsAddressFormOpen(false)}
                    style={{ background: "none", border: "none", color: "var(--color-text-tertiary)", fontSize: "0.75rem", cursor: "pointer", fontWeight: 500 }}
                  >
                    Collapse ▲
                  </button>
                </div>

                {/* Name-able Preset Label */}
                <div style={{ marginBottom: "var(--space-4)" }}>
                  <label htmlFor="presetLabel" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem", marginBottom: "4px", color: "var(--color-primary-800)", fontWeight: 600 }}>
                    {isGift ? <Gift size={13} strokeWidth={1.5} /> : <Bookmark size={13} strokeWidth={1.5} />} 
                    {isGift ? "Gift Title / Occasion" : "Address Name / Label"}
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
                    placeholder={isGift ? "What's the occasion?" : "e.g. Home, Office, or Mom's house"}
                    className={addrStyles.formInput}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-primary-200)",
                      background: "var(--color-primary-50)",
                      outline: "none",
                      fontWeight: 500,
                      color: "var(--color-text)"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "var(--space-4)" }}>
                  <label htmlFor="fullName" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>{isGift ? "Recipient's Name" : "Full Name"}</label>
                  <input required type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g., Chioma Adeleke" aria-invalid={!!errors.fullName} className={addrStyles.formInput} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: `1px solid ${errors.fullName ? "var(--color-error)" : "var(--color-border)"}`, outline: "none" }} />
                  {errors.fullName && <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "4px" }}>{errors.fullName}</p>}
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                  <div>
                    <label htmlFor="email" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>Email Address</label>
                    <input required type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g., jane@example.com" aria-invalid={!!errors.email} className={addrStyles.formInput} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: `1px solid ${errors.email ? "var(--color-error)" : "var(--color-border)"}`, outline: "none" }} />
                    {errors.email && <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "4px" }}>{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>Phone Number</label>
                    <input required type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g., 0801 234 5678" aria-invalid={!!errors.phone} className={addrStyles.formInput} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: `1px solid ${errors.phone ? "var(--color-error)" : "var(--color-border)"}`, outline: "none" }} />
                    {errors.phone && <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "4px" }}>{errors.phone}</p>}
                  </div>
                </div>

                <div style={{ marginBottom: "var(--space-4)" }}>
                  <label htmlFor="address" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>Street Address</label>
                  <input required type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="e.g., 12 Admiralty Way, Lekki Phase 1" aria-invalid={!!errors.address} className={addrStyles.formInput} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: `1px solid ${errors.address ? "var(--color-error)" : "var(--color-border)"}`, outline: "none" }} />
                  {errors.address && <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "4px" }}>{errors.address}</p>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                  <div>
                    <label htmlFor="state" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>State</label>
                    <select required id="state" name="state" value={formData.state} onChange={handleChange} aria-invalid={!!errors.state} className={addrStyles.formInput} style={{ width: "100%", padding: "10px 32px 10px 10px", borderRadius: "8px", border: `1px solid ${errors.state ? "var(--color-error)" : "var(--color-border)"}`, outline: "none", appearance: "none", background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23666\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>') no-repeat right 12px center / 16px 16px white" }}>
                      <option value="">Select State</option>
                      {nigeriaData.map(s => (
                        <option key={s.state} value={s.state}>{s.state}</option>
                      ))}
                    </select>
                    {errors.state && <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "4px" }}>{errors.state}</p>}
                  </div>
                  <div>
                    <label htmlFor="city" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>City / LGA</label>
                    <select required id="city" name="city" value={formData.city} onChange={handleChange} disabled={!formData.state} aria-invalid={!!errors.city} className={addrStyles.formInput} style={{ width: "100%", padding: "10px 32px 10px 10px", borderRadius: "8px", border: `1px solid ${errors.city ? "var(--color-error)" : "var(--color-border)"}`, outline: "none", appearance: "none", background: `url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23666\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>') no-repeat right 12px center / 16px 16px ${formData.state ? "white" : "var(--color-background-alt)"}` }}>
                      <option value="">Select City / LGA</option>
                      {availableLgas.map(lga => (
                        <option key={lga} value={lga}>{lga}</option>
                      ))}
                    </select>
                    {errors.city && <p style={{ color: "var(--color-error)", fontSize: "0.75rem", marginTop: "4px" }}>{errors.city}</p>}
                  </div>
                </div>

                {/* Quick Save / Update Action Bar */}
                <div className={addrStyles.saveActionBar}>
                  <div className={addrStyles.saveTagSelector}>
                    <span className={addrStyles.tagLabel}>Save preset as:</span>
                    <button
                      type="button"
                      className={`${addrStyles.tagBtn} ${savePresetTag === "home" && !showCustomInput ? addrStyles.selected : ""}`}
                      onClick={() => { setSavePresetTag("home"); setShowCustomInput(false); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Home size={13} strokeWidth={1.5} /> Home
                    </button>
                    <button
                      type="button"
                      className={`${addrStyles.tagBtn} ${savePresetTag === "office" && !showCustomInput ? addrStyles.selected : ""}`}
                      onClick={() => { setSavePresetTag("office"); setShowCustomInput(false); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Building2 size={13} strokeWidth={1.5} /> Office
                    </button>
                    <button
                      type="button"
                      className={`${addrStyles.tagBtn} ${savePresetTag === "gift" && !showCustomInput ? addrStyles.selected : ""}`}
                      onClick={() => { setSavePresetTag("gift"); setShowCustomInput(false); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Gift size={13} strokeWidth={1.5} /> Gift / Recipient
                    </button>
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
              ) : shippingLocations.map((loc) => {
                const details = getDeliveryDetails(loc.name);
                return (
                  <div 
                    key={loc.id}
                    onClick={() => setShippingMethod(loc.id)}
                    style={{ 
                      background: shippingMethod === loc.id ? "var(--color-primary-50)" : "white", 
                      border: `1px solid ${shippingMethod === loc.id ? "var(--color-primary)" : "var(--color-border-light)"}`, 
                      borderRadius: "var(--radius-xl)", 
                      padding: "var(--space-4)", 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: "var(--space-2)", 
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: shippingMethod === loc.id ? "var(--shadow-sm)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${shippingMethod === loc.id ? "var(--color-primary)" : "var(--color-border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {shippingMethod === loc.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-primary)" }}></div>}
                        </div>
                        <span style={{ fontWeight: 600, color: "var(--color-text)", fontSize: "0.95rem" }}>{loc.name}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: "var(--color-primary)", fontSize: "0.95rem" }}>{formatPrice(loc.fee)}</span>
                    </div>
                    <div style={{ paddingLeft: "30px" }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-success)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={12} strokeWidth={1.5} /> Est. Delivery: {details.est}
                      </div>
                    </div>
                  </div>
                );
              })}
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
        </form>
      </div>

      {/* Sticky Bottom Sheet / Bar */}
      <div className={pageStyles.stickySummaryBar}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block" }}>
              Total Summary
            </span>
            <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-primary)" }}>
              {formatPrice(finalTotal)}
            </span>
          </div>
          
          <button
            type="button"
            onClick={() => {
              const errs = validate();
              setErrors(errs);
              if (Object.keys(errs).length > 0) {
                focusFirstError();
                return;
              }
              if (!shippingMethod) {
                const el = document.getElementById("checkout-step-2");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                return;
              }
              // Submit the form
              const formEl = document.querySelector("form");
              if (formEl) {
                formEl.requestSubmit();
              }
            }}
            disabled={isSubmitting}
            className={`${btnStyles.btn}`}
            style={{
              padding: "10px 24px",
              borderRadius: "12px",
              fontSize: "0.9rem",
              fontWeight: 600,
              background: "var(--color-primary)",
              color: "white",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(122, 64, 61, 0.2)",
            }}
          >
            {isSubmitting ? "Processing..." : (!isAddressComplete ? "Add Address" : (!shippingMethod ? "Choose Delivery" : "Place Order"))}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}


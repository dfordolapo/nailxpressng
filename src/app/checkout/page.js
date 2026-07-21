"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice, calculateCartTotals } from "@/lib/utils";
import nigeriaData from "@/lib/nigeria.json";
import pageStyles from "@/styles/pages/collection.module.css";
import cartStyles from "@/styles/components/cart.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const { subtotal, shipping, total } = calculateCartTotals(items);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "",
    address: "", city: "", state: "",
  });
  const [shippingMethod, setShippingMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [shippingLocations, setShippingLocations] = useState([]);
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.delivery_locations && data.delivery_locations.length > 0) {
            setShippingLocations(data.delivery_locations);
            setShippingMethod(data.delivery_locations[0].id); // Auto-select first location
          } else {
            // Fallback
            const fallback = [{ id: "standard", name: "Standard Delivery", fee: data.shipping_standard || 2500 }];
            setShippingLocations(fallback);
            setShippingMethod("standard");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
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
        
        {/* Header matching mockup */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-8)" }}>
          <Link href="/cart" style={{ color: "var(--color-primary-light)", display: "flex", alignItems: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </Link>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-primary)", margin: 0, lineHeight: 1 }}>Checkout</h1>
          <div style={{ width: 24 }}></div>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Step 1: Shipping Address */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: "bold" }}>1</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Shipping Address</h3>
            </div>
            
            <div style={{ background: "white", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
              <div style={{ marginBottom: "var(--space-4)" }}>
                <label htmlFor="fullName" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>Full Name</label>
                <input required type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--color-border)", outline: "none" }} />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                <div>
                  <label htmlFor="email" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>Email Address</label>
                  <input required type="email" id="email" name="email" value={formData.email} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--color-border)", outline: "none" }} />
                </div>
                <div>
                  <label htmlFor="phone" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>Phone Number</label>
                  <input required type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--color-border)", outline: "none" }} />
                </div>
              </div>

              <div style={{ marginBottom: "var(--space-4)" }}>
                <label htmlFor="address" style={{ display: "block", fontSize: "0.875rem", marginBottom: "4px", color: "var(--color-text-secondary)" }}>Street Address</label>
                <input required type="text" id="address" name="address" value={formData.address} onChange={handleChange} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--color-border)", outline: "none" }} />
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
            </div>
          </div>
          
          {/* Step 2: Shipping Method */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: "bold" }}>2</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Delivery Location</h3>
            </div>
            
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
          
          {/* Step 3: Payment Method */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: "bold" }}>3</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Payment Method</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div 
                onClick={() => setPaymentMethod("paystack")}
                style={{ 
                  background: paymentMethod === "paystack" ? "var(--color-primary-50)" : "white", 
                  border: `1px solid ${paymentMethod === "paystack" ? "var(--color-primary)" : "var(--color-border-light)"}`, 
                  borderRadius: "var(--radius-lg)", padding: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" 
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${paymentMethod === "paystack" ? "var(--color-primary)" : "var(--color-border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {paymentMethod === "paystack" && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-primary)" }}></div>}
                  </div>
                  <span style={{ fontWeight: 500 }}>Paystack</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 4: Order Summary */}
          <div style={{ marginBottom: "var(--space-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: "bold" }}>4</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Order Summary</h3>
            </div>
            
            <div style={{ background: "transparent", border: "none", padding: "0 var(--space-4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Subtotal ({items.length} items)</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-4)", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Shipping</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(shippingFeeAmount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 700 }}>
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

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
              width: "250px", 
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
        </form>
      </div>
    </div>
  );
}

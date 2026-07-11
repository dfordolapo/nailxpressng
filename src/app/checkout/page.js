"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, calculateCartTotals } from "@/lib/utils";
import pageStyles from "@/styles/pages/collection.module.css";
import cartStyles from "@/styles/components/cart.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

export default function CheckoutPage() {
  const { items } = useCart();
  const { subtotal, shipping, total } = calculateCartTotals(items);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zipCode: "",
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  const finalTotal = total + (shippingMethod === "express" ? 9.99 : 4.99);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Paystack integration will go here
    alert("Paystack payment integration coming soon! Order details have been captured.");
  };

  if (items.length === 0) {
    return (
      <div className={pageStyles.checkoutPage}>
        <div className="container" style={{ textAlign: "center", padding: "var(--space-20) 0" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-3xl)", marginBottom: "var(--space-4)" }}>
            Nothing to checkout
          </h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
            Your bag is empty. Add some nails first!
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
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-pink)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: "bold" }}>1</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Shipping Address</h3>
            </div>
            
            <div style={{ background: "white", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontWeight: 500, marginBottom: "4px" }}>Dolapo Oyekanmi</p>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>Surulere, Lagos State<br/>Nigeria, 101283</p>
              </div>
              <button type="button" style={{ color: "var(--color-pink)", fontSize: "0.75rem", fontWeight: 500 }}>Change</button>
            </div>
          </div>
          
          {/* Step 2: Shipping Method */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-pink)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: "bold" }}>2</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Shipping Method</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div 
                onClick={() => setShippingMethod("standard")}
                style={{ 
                  background: shippingMethod === "standard" ? "var(--color-pink-50)" : "white", 
                  border: `1px solid ${shippingMethod === "standard" ? "var(--color-pink)" : "var(--color-border-light)"}`, 
                  borderRadius: "var(--radius-lg)", padding: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" 
                }}
              >
                <div>
                  <p style={{ fontWeight: 500, marginBottom: "2px" }}>Standard Shipping</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>3-5 business days</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <span style={{ fontWeight: 500 }}>{formatPrice(2500)}</span>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${shippingMethod === "standard" ? "var(--color-pink)" : "var(--color-border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {shippingMethod === "standard" && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-pink)" }}></div>}
                  </div>
                </div>
              </div>
              
              <div 
                onClick={() => setShippingMethod("express")}
                style={{ 
                  background: shippingMethod === "express" ? "var(--color-pink-50)" : "white", 
                  border: `1px solid ${shippingMethod === "express" ? "var(--color-pink)" : "var(--color-border-light)"}`, 
                  borderRadius: "var(--radius-lg)", padding: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" 
                }}
              >
                <div>
                  <p style={{ fontWeight: 500, marginBottom: "2px" }}>Express Shipping</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>1-2 business days</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <span style={{ fontWeight: 500 }}>{formatPrice(5000)}</span>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${shippingMethod === "express" ? "var(--color-pink)" : "var(--color-border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {shippingMethod === "express" && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-pink)" }}></div>}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ color: "var(--color-pink)" }}>✓</span> Free shipping on orders over {formatPrice(20000)}!
              </p>
            </div>
          </div>
          
          {/* Step 3: Payment Method */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-pink)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: "bold" }}>3</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Payment Method</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div 
                onClick={() => setPaymentMethod("card")}
                style={{ 
                  background: paymentMethod === "card" ? "var(--color-pink-50)" : "white", 
                  border: `1px solid ${paymentMethod === "card" ? "var(--color-pink)" : "var(--color-border-light)"}`, 
                  borderRadius: "var(--radius-lg)", padding: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" 
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${paymentMethod === "card" ? "var(--color-pink)" : "var(--color-border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {paymentMethod === "card" && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-pink)" }}></div>}
                  </div>
                  <span style={{ fontWeight: 500 }}>Card</span>
                </div>
                <div style={{ display: "flex", gap: "4px", fontSize: "1.25rem" }}>
                  💳
                </div>
              </div>
              
              <div 
                onClick={() => setPaymentMethod("paystack")}
                style={{ 
                  background: paymentMethod === "paystack" ? "var(--color-pink-50)" : "white", 
                  border: `1px solid ${paymentMethod === "paystack" ? "var(--color-pink)" : "var(--color-border-light)"}`, 
                  borderRadius: "var(--radius-lg)", padding: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" 
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${paymentMethod === "paystack" ? "var(--color-pink)" : "var(--color-border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {paymentMethod === "paystack" && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-pink)" }}></div>}
                  </div>
                  <span style={{ fontWeight: 500 }}>Paystack</span>
                </div>
              </div>
              
              <div 
                onClick={() => setPaymentMethod("bank")}
                style={{ 
                  background: paymentMethod === "bank" ? "var(--color-pink-50)" : "white", 
                  border: `1px solid ${paymentMethod === "bank" ? "var(--color-pink)" : "var(--color-border-light)"}`, 
                  borderRadius: "var(--radius-lg)", padding: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" 
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${paymentMethod === "bank" ? "var(--color-pink)" : "var(--color-border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {paymentMethod === "bank" && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-pink)" }}></div>}
                  </div>
                  <span style={{ fontWeight: 500 }}>Bank Transfer</span>
                </div>
                <span>🏦</span>
              </div>
            </div>
          </div>
          
          {/* Step 4: Order Summary */}
          <div style={{ marginBottom: "var(--space-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-pink)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: "bold" }}>4</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Order Summary</h3>
            </div>
            
            <div style={{ background: "transparent", border: "none", padding: "0 var(--space-4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Subtotal ({items.length} items)</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-4)", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Shipping</span>
                <span style={{ fontWeight: 600 }}>${shippingMethod === "express" ? "9.99" : "4.99"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 700 }}>
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`${btnStyles.btn} ${btnStyles.lg}`}
            style={{ background: "var(--color-primary)", color: "white", border: "none", borderRadius: "12px", margin: "0 auto var(--space-4) auto", display: "flex", width: "250px", justifyContent: "center" }}
          >
            Place Order
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

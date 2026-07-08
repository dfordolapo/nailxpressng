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
      <div className="container">
        <h1 className={pageStyles.collectionTitle} style={{ marginBottom: "var(--space-10)" }}>Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className={pageStyles.checkoutGrid}>
            {/* Shipping Form */}
            <div>
              <div className={pageStyles.formSection}>
                <h3 className={pageStyles.formSectionTitle}>Contact Information</h3>
                <div className={pageStyles.formRow}>
                  <div className={pageStyles.formGroup}>
                    <label className={pageStyles.formLabel} htmlFor="firstName">First Name</label>
                    <input className={pageStyles.formInput} type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className={pageStyles.formGroup}>
                    <label className={pageStyles.formLabel} htmlFor="lastName">Last Name</label>
                    <input className={pageStyles.formInput} type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>
                <div className={pageStyles.formRow}>
                  <div className={pageStyles.formGroup}>
                    <label className={pageStyles.formLabel} htmlFor="email">Email</label>
                    <input className={pageStyles.formInput} type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className={pageStyles.formGroup}>
                    <label className={pageStyles.formLabel} htmlFor="phone">Phone</label>
                    <input className={pageStyles.formInput} type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+234" />
                  </div>
                </div>
              </div>

              <div className={pageStyles.formSection}>
                <h3 className={pageStyles.formSectionTitle}>Shipping Address</h3>
                <div className={pageStyles.formGroup}>
                  <label className={pageStyles.formLabel} htmlFor="address">Street Address</label>
                  <input className={pageStyles.formInput} type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className={pageStyles.formRow}>
                  <div className={pageStyles.formGroup}>
                    <label className={pageStyles.formLabel} htmlFor="city">City</label>
                    <input className={pageStyles.formInput} type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className={pageStyles.formGroup}>
                    <label className={pageStyles.formLabel} htmlFor="state">State</label>
                    <select className={pageStyles.formInput} id="state" name="state" value={formData.state} onChange={handleChange} required>
                      <option value="">Select state</option>
                      <option value="lagos">Lagos</option>
                      <option value="abuja">Abuja (FCT)</option>
                      <option value="rivers">Rivers</option>
                      <option value="oyo">Oyo</option>
                      <option value="kano">Kano</option>
                      <option value="enugu">Enugu</option>
                      <option value="anambra">Anambra</option>
                      <option value="delta">Delta</option>
                      <option value="edo">Edo</option>
                      <option value="kaduna">Kaduna</option>
                      <option value="ogun">Ogun</option>
                      <option value="ondo">Ondo</option>
                      <option value="kwara">Kwara</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={pageStyles.formSection}>
                <h3 className={pageStyles.formSectionTitle}>Payment</h3>
                <div style={{
                  padding: "var(--space-6)",
                  border: "2px dashed var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  textAlign: "center",
                  color: "var(--color-text-secondary)",
                }}>
                  <p style={{ fontSize: "2rem", marginBottom: "var(--space-3)" }}>💳</p>
                  <p style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>Paystack Secure Payment</p>
                  <p style={{ fontSize: "var(--text-sm)" }}>You&apos;ll be redirected to Paystack to complete your payment securely.</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className={cartStyles.summaryCard}>
              <h3 className={cartStyles.summaryTitle}>Order Summary</h3>

              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "var(--space-3) 0", borderBottom: "1px solid var(--color-border-light)",
                  fontSize: "var(--text-sm)",
                }}>
                  <div>
                    <p style={{ fontWeight: 500 }}>{item.name}</p>
                    <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)" }}>
                      {item.selectedSize} / {item.selectedLength} × {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}

              <div style={{ marginTop: "var(--space-4)" }}>
                <div className={cartStyles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className={cartStyles.summaryRow}>
                  <span>Shipping</span>
                  <span className={shipping === 0 ? cartStyles.freeShipping : ""}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className={cartStyles.summaryTotal}>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.lg} ${btnStyles.full} ${cartStyles.checkoutBtn}`}
                id="pay-now-btn"
              >
                Pay {formatPrice(total)} with Paystack
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

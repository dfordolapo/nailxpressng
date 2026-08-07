"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ShieldAlert, Truck, CheckCheck, Sparkles, Image as ImageIcon, Layout } from "lucide-react";

export default function EmailPreviewsPage() {
  const [activeTab, setActiveTab] = useState("buyer_order");
  const [layoutStyle, setLayoutStyle] = useState("rich"); // "minimal" | "rich"

  const sampleProductImg = "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&auto=format&fit=crop&q=80";

  const getHtml = (type) => {
    const isRich = layoutStyle === "rich";

    const wrap = (content) => `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin: 0; padding: 0; background-color: #f7f3f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #eae1e0;">
          <!-- BRAND HEADER -->
          <tr>
            <td align="center" style="background-color: #7a403d; padding: 36px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-family: Georgia, serif; font-size: 28px; letter-spacing: 3px; text-transform: uppercase; font-weight: 600;">NAILEXPRESS</h1>
              <p style="color: #eac5c1; margin: 6px 0 0 0; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; font-weight: 500;">Luxury Press-On Nails</p>
            </td>
          </tr>

          <!-- CONTENT BODY -->
          <tr>
            <td style="padding: 36px 28px; color: #2d2d2d; font-size: 15px; line-height: 1.6;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #fcf6f6; padding: 28px 20px; text-align: center; border-top: 1px solid #f0e6e5;">
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #7a403d; font-weight: 700;">Follow Us @nailexpress.ng</p>
              <p style="margin: 0 0 14px 0; font-size: 12px; color: #777;">Have questions? Reply directly to this email or chat with us on WhatsApp.</p>
              <p style="margin: 0; font-size: 11px; color: #aaa; letter-spacing: 0.5px;">© 2026 Nailexpress. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    if (type === "buyer_order") {
      return wrap(`
        <h2 style="color: #7a403d; font-family: Georgia, serif; font-size: 22px; margin-top: 0; margin-bottom: 8px;">Thanks for your order, Dolapo!</h2>
        <p style="color: #555; margin-top: 0; margin-bottom: 24px;">We've received your order and are crafting it with care.</p>
        
        <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: #7a403d; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 12px;">ORDER #596e0942</div>
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</p>
          <p style="margin: 0; font-weight: 600; color: #2d2d2d;">
            16, Yinka Ogunfile Street, Ikorodu<br/>
            Ikorodu, Lagos
          </p>
        </div>

        <h3 style="color: #7a403d; font-size: 16px; margin-bottom: 12px; border-bottom: 2px solid #f2e9e8; padding-bottom: 8px;">Items Ordered</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
          <tr style="border-bottom: 1px solid #f2e9e8;">
            ${isRich ? `
              <td width="70" style="padding: 12px 12px 12px 0; vertical-align: top;">
                <img src="${sampleProductImg}" width="60" height="60" style="border-radius: 8px; object-fit: cover; border: 1px solid #eae1e0;" alt="Product Thumbnail" />
              </td>
            ` : ''}
            <td style="padding: 12px 0; vertical-align: top;">
              <div style="font-weight: 700; color: #2d2d2d; font-size: 15px;">1x French Tip Glam Set</div>
              <div style="font-size: 12px; color: #7a403d; margin-top: 4px; font-weight: 500;">
                Size: <span style="background: #f7e8e8; padding: 2px 8px; border-radius: 4px; color: #7a403d;">M</span>
                &nbsp;•&nbsp;
                Length: <span style="background: #f7e8e8; padding: 2px 8px; border-radius: 4px; color: #7a403d;">Long Almond</span>
              </div>
            </td>
            <td align="right" style="padding: 12px 0; vertical-align: top; font-weight: 700; color: #7a403d; font-size: 15px;">₦16,500</td>
          </tr>
        </table>

        <div style="border-top: 2px solid #7a403d; padding-top: 16px; margin-top: 16px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="color: #666; padding: 4px 0;">Shipping Fee:</td>
              <td align="right" style="color: #2d2d2d; font-weight: 600;">₦3,000</td>
            </tr>
            <tr>
              <td style="color: #7a403d; font-weight: 700; font-size: 18px; padding-top: 8px;">Total Paid:</td>
              <td align="right" style="color: #7a403d; font-weight: 800; font-size: 20px; padding-top: 8px;">₦19,500</td>
            </tr>
          </table>
        </div>
      `);
    }

    if (type === "admin_order") {
      return wrap(`
        <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin-bottom: 24px;">
          <h2 style="color: #7a403d; font-family: Georgia, serif; font-size: 20px; margin: 0 0 12px 0;">New Order Notification</h2>
          <p style="margin: 4px 0;"><strong>Order Number:</strong> #596e0942</p>
          <p style="margin: 4px 0;"><strong>Customer Name:</strong> Dolapo Oyekanmi</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> dfordolapo@gmail.com</p>
          <p style="margin: 4px 0;"><strong>Phone:</strong> 08187902241</p>
          <p style="margin: 4px 0;"><strong>Delivery Address:</strong> 16, Yinka Ogunfile street, Ikorodu, Lagos</p>
        </div>

        <h3 style="color: #7a403d; font-size: 16px; margin-bottom: 12px; border-bottom: 2px solid #f2e9e8; padding-bottom: 8px;">Order Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #f2e9e8;">
            ${isRich ? `
              <td width="60" style="padding: 10px 10px 10px 0; vertical-align: top;">
                <img src="${sampleProductImg}" width="50" height="50" style="border-radius: 6px; object-fit: cover;" alt="Product" />
              </td>
            ` : ''}
            <td style="padding: 10px 0;">
              <strong>1x French Tip Glam Set</strong>
              <div style="font-size: 12px; color: #7a403d;">Size: M | Length: Long Almond</div>
            </td>
            <td align="right" style="font-weight: 700; color: #7a403d;">₦16,500</td>
          </tr>
        </table>

        <div style="background: #7a403d; color: #ffffff; padding: 16px 20px; border-radius: 10px; text-align: center; font-size: 18px; font-weight: 700; margin-bottom: 28px;">
          Total Order Amount: ₦19,500
        </div>

        <div align="center">
          <a href="/admin/orders" 
             style="display: inline-block; padding: 14px 28px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
            View Order in Admin Dashboard
          </a>
        </div>
      `);
    }

    if (type === "buyer_custom") {
      return wrap(`
        <h2 style="color: #7a403d; font-family: Georgia, serif; font-size: 22px; margin-top: 0;">Hi Dolapo,</h2>
        <p style="color: #555;">We received your request for a custom press-on nail set! Our team is reviewing your design specifications and will contact you shortly.</p>
        
        <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin: 24px 0;">
          <h3 style="color: #7a403d; margin-top: 0; font-size: 16px; border-bottom: 1px solid #eac5c1; padding-bottom: 8px;">Request Details</h3>
          <p style="margin: 6px 0;"><strong>Shape:</strong> Oval</p>
          <p style="margin: 6px 0;"><strong>Length:</strong> Extra Long</p>
          <p style="margin: 6px 0;"><strong>Design Description:</strong> Marble Pink</p>
          <p style="margin: 6px 0;"><strong>Color Preference:</strong> Baby Pink</p>
          
          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #eac5c1;">
            <p style="margin: 0 0 6px 0; color: #7a403d; font-weight: 600;">Reference Image Uploaded:</p>
            ${isRich ? `
              <div style="margin-top: 8px;">
                <img src="${sampleProductImg}" width="160" style="border-radius: 10px; border: 2px solid #7a403d; display: block;" alt="Uploaded Reference" />
              </div>
            ` : `
              <a href="${sampleProductImg}" target="_blank" style="color: #7a403d; font-size: 13px;">
                View Uploaded Reference Image ↗
              </a>
            `}
          </div>
        </div>
        
        <p style="color: #666; font-size: 14px;">We'll reach out via WhatsApp or email to finalize your custom set design and price quote.</p>
      `);
    }

    if (type === "admin_custom") {
      return wrap(`
        <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin-bottom: 24px;">
          <h2 style="color: #7a403d; font-family: Georgia, serif; font-size: 20px; margin-top: 0;">New Custom Set Request</h2>
          <p style="margin: 4px 0;"><strong>Customer:</strong> Dolapo (dfordolapo@gmail.com)</p>
          <p style="margin: 4px 0;"><strong>Phone:</strong> 08187902241</p>
          <p style="margin: 4px 0;"><strong>Shape:</strong> Oval</p>
          <p style="margin: 4px 0;"><strong>Length:</strong> Extra Long</p>
          <p style="margin: 4px 0;"><strong>Design:</strong> Marble Pink</p>
          <p style="margin: 4px 0;"><strong>Color Preference:</strong> Baby Pink</p>
          <p style="margin: 4px 0;"><strong>Notes:</strong> High gloss finish</p>
          
          <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #eac5c1;">
            <p style="margin: 0 0 6px 0; color: #7a403d; font-weight: 700;">Uploaded Reference Photo:</p>
            <a href="${sampleProductImg}" target="_blank" style="display: inline-block;">
              <img src="${sampleProductImg}" alt="Reference Image" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid #eae1e0;" />
            </a>
            <br/>
            <a href="${sampleProductImg}" target="_blank" style="color: #7a403d; font-size: 12px; text-decoration: underline; margin-top: 4px; display: inline-block;">Open Full Resolution Image ↗</a>
          </div>
        </div>

        <div align="center">
          <a href="/admin/custom-orders" 
             style="display: inline-block; padding: 14px 28px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
            View Custom Orders Dashboard
          </a>
        </div>
      `);
    }

    if (type === "buyer_shipped") {
      return wrap(`
        <h2 style="color: #7a403d; font-family: Georgia, serif; font-size: 22px; margin-top: 0;">Your Order Has Shipped!</h2>
        <p style="color: #555;">Hi Dolapo, guess what? Your fresh set just left our studio and is headed straight to you! We've packed everything with care, so get those nails ready to slay.</p>

        ${isRich ? `
          <!-- OUTLINED STEPPER GRAPHIC -->
          <div style="margin: 28px 0; background: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; text-align: center;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" width="33%">
                  <div style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #7a403d; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a403d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div style="font-size: 12px; font-weight: 700; color: #7a403d;">Crafted</div>
                </td>
                <td align="center" width="33%">
                  <div style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #7a403d; background-color: #f7e8e8; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a403d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  </div>
                  <div style="font-size: 12px; font-weight: 700; color: #7a403d;">Dispatched</div>
                </td>
                <td align="center" width="33%">
                  <div style="width: 40px; height: 40px; border-radius: 50%; border: 2px dashed #ccc; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  </div>
                  <div style="font-size: 12px; font-weight: 500; color: #aaa;">Delivered</div>
                </td>
              </tr>
            </table>
          </div>
        ` : ''}

        <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin: 24px 0;">
          <div style="display: inline-block; background-color: #7a403d; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 12px;">ORDER #596e0942</div>
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Delivery Address</p>
          <p style="margin: 0; font-weight: 600; color: #2d2d2d;">
            16, Yinka Ogunfile Street, Ikorodu<br/>
            Ikorodu, Lagos
          </p>
        </div>

        <p style="color: #666; font-size: 14px;">If you need any assistance, reply directly to this email or chat with us on WhatsApp.</p>
      `);
    }

    if (type === "buyer_delivered") {
      return wrap(`
        <h2 style="color: #7a403d; font-family: Georgia, serif; font-size: 22px; margin-top: 0;">Your Order Has Been Delivered</h2>
        <p style="color: #555;">Hi Dolapo, your order <strong>#596e0942</strong> has been successfully delivered. We hope you love your new press-on set!</p>

        ${isRich ? `
          <!-- OUTLINED 3-STEP APPLICATION GUIDE -->
          <div style="margin: 24px 0; background: #fff5f7; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5;">
            <h4 style="margin: 0 0 16px 0; color: #7a403d; font-size: 15px; font-family: Georgia, serif; text-align: center;">How To Apply Your Press-On Set</h4>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" width="33%" style="padding: 0 6px;">
                  <div style="background: #ffffff; padding: 14px 8px; border-radius: 10px; border: 1px solid #f0e6e5;">
                    <div style="margin-bottom: 8px;">
                      <!-- Polish Bottle / Prep Icon -->
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a403d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 2h4v4h-4z"/>
                        <path d="M7 9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V9z"/>
                        <path d="M10 13h4"/>
                      </svg>
                    </div>
                    <div style="font-size: 12px; font-weight: 700; color: #7a403d;">1. Clean & Prep</div>
                    <div style="font-size: 10px; color: #777; margin-top: 2px;">Alcohol wipe nails</div>
                  </div>
                </td>
                <td align="center" width="33%" style="padding: 0 6px;">
                  <div style="background: #ffffff; padding: 14px 8px; border-radius: 10px; border: 1px solid #f0e6e5;">
                    <div style="margin-bottom: 8px;">
                      <!-- Outlined Finger Sizing & Fitting Icon -->
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a403d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 22V9a3 3 0 0 1 6 0v13"/>
                        <path d="M13 22V7a3 3 0 0 1 6 0v15"/>
                        <path d="M7 4.5a1.5 1.5 0 0 1 3 0"/>
                        <path d="M15 2.5a1.5 1.5 0 0 1 3 0"/>
                      </svg>
                    </div>
                    <div style="font-size: 12px; font-weight: 700; color: #7a403d;">2. Match Sizes</div>
                    <div style="font-size: 10px; color: #777; margin-top: 2px;">Fit each nail tip</div>
                  </div>
                </td>
                <td align="center" width="33%" style="padding: 0 6px;">
                  <div style="background: #ffffff; padding: 14px 8px; border-radius: 10px; border: 1px solid #f0e6e5;">
                    <div style="margin-bottom: 8px;">
                      <!-- Outlined Hand Pressing / Sparkle Icon -->
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a403d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                        <path d="M12 9v4"/>
                      </svg>
                    </div>
                    <div style="font-size: 12px; font-weight: 700; color: #7a403d;">3. Glue & Press</div>
                    <div style="font-size: 10px; color: #777; margin-top: 2px;">Hold firm 30 secs</div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        ` : `
          <div style="background-color: #fcf6f6; border-left: 4px solid #7a403d; padding: 18px; margin: 24px 0; border-radius: 8px;">
            <h4 style="margin: 0 0 6px 0; color: #7a403d; font-size: 15px;">Application Tip:</h4>
            <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.5;">
              Clean and prep your natural nails with an alcohol pad before applying your adhesive tabs or nail glue for the longest lasting wear.
            </p>
          </div>
        `}

        <div style="text-align: center; margin: 28px 0; padding: 20px; background-color: #f7e8e8; border-radius: 12px;">
          <p style="margin: 0 0 6px 0; font-weight: 700; color: #7a403d; font-size: 16px;">Show Off Your Set</p>
          <p style="margin: 0; font-size: 13px; color: #555;">Tag us on Instagram <strong>@nailexpress.ng</strong> wearing your set — we'd love to feature you!</p>
        </div>
      `);
    }
  };

  const tabsInfo = {
    buyer_order: { title: "Buyer Order Confirmation", badge: "Customer Email", icon: <Mail size={18} />, subject: "Order Confirmation - #596e0942", to: "buyer@example.com", from: "Nailexpress <orders@nailexpress.ng>", replyTo: "nailxpressng@gmail.com" },
    admin_order: { title: "Admin New Order Alert", badge: "Admin Email", icon: <ShieldAlert size={18} />, subject: "New Order Received - #596e0942", to: "nailxpressng@gmail.com", from: "Nailexpress System <orders@nailexpress.ng>", replyTo: "dfordolapo@gmail.com" },
    buyer_custom: { title: "Buyer Custom Confirmation", badge: "Customer Email", icon: <Sparkles size={18} />, subject: "Custom Nail Set Request Received", to: "buyer@example.com", from: "Nailexpress <orders@nailexpress.ng>", replyTo: "nailxpressng@gmail.com" },
    admin_custom: { title: "Admin Custom Alert", badge: "Admin Email", icon: <ShieldAlert size={18} />, subject: "New Custom Nail Request from Dolapo", to: "nailxpressng@gmail.com", from: "Nailexpress System <orders@nailexpress.ng>", replyTo: "dfordolapo@gmail.com" },
    buyer_shipped: { title: "Buyer Order Shipped", badge: "Customer Email", icon: <Truck size={18} />, subject: "Your Nailexpress Order #596e0942 Has Shipped", to: "buyer@example.com", from: "Nailexpress <orders@nailexpress.ng>", replyTo: "nailxpressng@gmail.com" },
    buyer_delivered: { title: "Buyer Order Delivered", badge: "Customer Email", icon: <CheckCheck size={18} />, subject: "Your Nailexpress Order #596e0942 Has Been Delivered", to: "buyer@example.com", from: "Nailexpress <orders@nailexpress.ng>", replyTo: "nailxpressng@gmail.com" },
  };

  const currentTab = tabsInfo[activeTab];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4efee", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* TOP BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", background: "#ffffff", padding: "16px 24px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/" style={{ color: "#7a403d", display: "flex", alignItems: "center", textDecoration: "none", fontWeight: "600" }}>
              <ArrowLeft size={18} style={{ marginRight: "6px" }} /> Home
            </Link>
            <span style={{ color: "#ccc" }}>|</span>
            <span style={{ fontWeight: "700", color: "#7a403d", fontSize: "1.1rem" }}>Nailexpress Visual Email Designer</span>
          </div>
          <span style={{ background: "#7a403d", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
            LOCAL PLAYGROUND
          </span>
        </div>

        {/* GRAPHICAL LAYOUT STYLE CONTROLLER */}
        <div style={{ background: "#ffffff", padding: "16px 24px", borderRadius: "12px", marginBottom: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#7a403d", fontWeight: "700", fontSize: "14px" }}>
            <Layout size={18} /> GRAPHICAL ELEMENTS & LAYOUT STYLE:
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => setLayoutStyle("rich")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "8px",
                border: layoutStyle === "rich" ? "2px solid #7a403d" : "1px solid #ddd",
                backgroundColor: layoutStyle === "rich" ? "#7a403d" : "#fafafa",
                color: layoutStyle === "rich" ? "#ffffff" : "#333",
                fontWeight: layoutStyle === "rich" ? "700" : "500",
                cursor: "pointer"
              }}
            >
              <ImageIcon size={16} /> Rich Visual Layout (Product Photos & Clean Outlined SVG Icons)
            </button>
            <button
              onClick={() => setLayoutStyle("minimal")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "8px",
                border: layoutStyle === "minimal" ? "2px solid #7a403d" : "1px solid #ddd",
                backgroundColor: layoutStyle === "minimal" ? "#7a403d" : "#fafafa",
                color: layoutStyle === "minimal" ? "#ffffff" : "#333",
                fontWeight: layoutStyle === "minimal" ? "700" : "500",
                cursor: "pointer"
              }}
            >
              Minimalist Clean Layout (Text & Card Containers Only)
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
          {Object.keys(tabsInfo).map((key) => {
            const item = tabsInfo[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: isActive ? "2px solid #7a403d" : "1px solid #ddd",
                  backgroundColor: isActive ? "#7a403d" : "#ffffff",
                  color: isActive ? "#ffffff" : "#444",
                  fontWeight: isActive ? "700" : "500",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {item.icon}
                {item.title}
              </button>
            );
          })}
        </div>

        {/* METADATA BAR */}
        <div style={{ backgroundColor: "#ffffff", borderTopLeftRadius: "12px", borderTopRightRadius: "12px", padding: "20px 24px", borderBottom: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h2 style={{ margin: 0, color: "#7a403d", fontSize: "1.2rem", fontFamily: "Georgia, serif" }}>{currentTab.subject}</h2>
            <span style={{ background: "#f7e8e8", color: "#7a403d", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>
              {currentTab.badge}
            </span>
          </div>
          <div style={{ fontSize: "13px", color: "#666", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
            <div><strong>From:</strong> {currentTab.from}</div>
            <div><strong>To:</strong> {currentTab.to}</div>
            <div><strong>Reply-To:</strong> {currentTab.replyTo}</div>
          </div>
        </div>

        {/* LIVE RENDER FRAME */}
        <div style={{ backgroundColor: "#ffffff", borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px", padding: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <iframe
            srcDoc={getHtml(activeTab)}
            title="Email Visual Preview"
            style={{ width: "100%", height: "700px", border: "none", borderRadius: "8px" }}
          />
        </div>

      </div>
    </div>
  );
}

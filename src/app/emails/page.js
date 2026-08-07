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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap');
          @media only screen and (max-width: 520px) {
            .email-card { margin: 10px auto !important; border-radius: 12px !important; }
            .content-body { padding: 22px 16px !important; font-size: 14px !important; }
            .header-pad { padding: 28px 16px !important; }
            .step-cell { display: block !important; width: 100% !important; padding: 0 0 10px 0 !important; }
            .step-cell:last-child { padding-bottom: 0 !important; }
            .mobile-stack { display: block !important; width: 100% !important; text-align: left !important; }
            .mobile-full { width: 100% !important; max-width: 100% !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f7f3f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-card" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #eae1e0;">
          <!-- BRAND HEADER -->
          <tr>
            <td align="center" class="header-pad" style="background-color: #7a403d; padding: 36px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 30px; letter-spacing: 4px; text-transform: uppercase; font-weight: 600;">NAILEXPRESS</h1>
              <p style="color: #eac5c1; margin: 6px 0 0 0; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; font-weight: 500;">Luxury Press-On Nails</p>
            </td>
          </tr>

          <!-- CONTENT BODY -->
          <tr>
            <td class="content-body" style="padding: 32px 24px; color: #2d2d2d; font-size: 15px; line-height: 1.6;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #fcf6f6; padding: 24px 16px; text-align: center; border-top: 1px solid #f0e6e5;">
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #7a403d; font-weight: 700;">Follow Us @nailexpress.ng</p>
              <p style="margin: 0 0 12px 0; font-size: 12px; color: #777;">Have questions? Reply directly to this email or chat with us on WhatsApp.</p>
              <p style="margin: 0; font-size: 11px; color: #aaa; letter-spacing: 0.5px;">© 2026 Nailexpress. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    if (type === "buyer_order") {
      return wrap(`
        <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0; margin-bottom: 8px;">Thanks for your order, Dolapo!</h2>
        <p style="color: #555; margin-top: 0; margin-bottom: 20px;">We've received your order and are crafting it with care.</p>
        
        <div style="background-color: #fcf6f6; border-radius: 12px; padding: 16px 20px; border: 1px solid #f5e6e5; margin-bottom: 20px;">
          <div style="display: inline-block; background-color: #7a403d; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 10px;">ORDER #596e0942</div>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</p>
          <p style="margin: 0; font-weight: 600; color: #2d2d2d; font-size: 14px;">
            16, Yinka Ogunfile Street, Ikorodu<br/>
            Ikorodu, Lagos
          </p>
        </div>

        <h3 style="color: #7a403d; font-size: 16px; margin-bottom: 12px; border-bottom: 2px solid #f2e9e8; padding-bottom: 8px;">Items Ordered</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #f2e9e8;">
            ${isRich ? `
              <td width="60" style="padding: 10px 10px 10px 0; vertical-align: top;">
                <img src="${sampleProductImg}" width="54" height="54" style="border-radius: 8px; object-fit: cover; border: 1px solid #eae1e0;" alt="Product" />
              </td>
            ` : ''}
            <td style="padding: 10px 0; vertical-align: top;">
              <div style="font-weight: 700; color: #2d2d2d; font-size: 14px;">1x French Tip Glam Set</div>
              <div style="font-size: 12px; color: #7a403d; margin-top: 4px; font-weight: 500;">
                Size: <span style="background: #f7e8e8; padding: 2px 6px; border-radius: 4px; color: #7a403d; white-space: nowrap;">M</span>
                &nbsp;•&nbsp;
                Length: <span style="background: #f7e8e8; padding: 2px 6px; border-radius: 4px; color: #7a403d; white-space: nowrap;">Long Almond</span>
              </div>
            </td>
            <td align="right" style="padding: 10px 0; vertical-align: top; font-weight: 700; color: #7a403d; font-size: 14px;">₦16,500</td>
          </tr>
        </table>

        <div style="border-top: 2px solid #7a403d; padding-top: 14px; margin-top: 14px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="color: #666; padding: 4px 0; font-size: 14px;">Shipping Fee:</td>
              <td align="right" style="color: #2d2d2d; font-weight: 600; font-size: 14px;">₦3,000</td>
            </tr>
            <tr>
              <td style="color: #7a403d; font-weight: 600; font-size: 15px; padding-top: 6px;">Total Paid:</td>
              <td align="right" style="color: #7a403d; font-weight: 600; font-size: 16px; padding-top: 6px;">₦19,500</td>
            </tr>
          </table>
        </div>
      `);
    }

    if (type === "admin_order") {
      return wrap(`
        <div style="background-color: #fcf6f6; border-radius: 12px; padding: 18px; border: 1px solid #f5e6e5; margin-bottom: 20px;">
          <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; margin: 0 0 10px 0;">New Order Notification</h2>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Order Number:</strong> #596e0942</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Customer:</strong> Dolapo Oyekanmi</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> dfordolapo@gmail.com</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Phone:</strong> 08187902241</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Address:</strong> 16, Yinka Ogunfile street, Ikorodu, Lagos</p>
        </div>

        <h3 style="color: #7a403d; font-size: 15px; margin-bottom: 10px; border-bottom: 2px solid #f2e9e8; padding-bottom: 6px;">Order Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
          <tr style="border-bottom: 1px solid #f2e9e8;">
            ${isRich ? `
              <td width="55" style="padding: 8px 8px 8px 0; vertical-align: top;">
                <img src="${sampleProductImg}" width="48" height="48" style="border-radius: 6px; object-fit: cover;" alt="Product" />
              </td>
            ` : ''}
            <td style="padding: 8px 0; font-size: 14px;">
              <strong>1x French Tip Glam Set</strong>
              <div style="font-size: 12px; color: #7a403d;">Size: M | Length: Long Almond</div>
            </td>
            <td align="right" style="font-weight: 700; color: #7a403d; font-size: 14px;">₦16,500</td>
          </tr>
        </table>

        <div style="background: #fcf6f6; color: #7a403d; border: 1px solid #f5e6e5; padding: 12px 16px; border-radius: 8px; text-align: center; font-size: 15px; font-weight: 600; margin-bottom: 24px;">
          Total Order Amount: ₦19,500
        </div>

        <div align="center">
          <a href="/admin/orders" 
             style="display: inline-block; padding: 13px 26px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">
            View Order in Admin Dashboard
          </a>
        </div>
      `);
    }

    if (type === "buyer_custom") {
      return wrap(`
        <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0;">Hi Dolapo,</h2>
        <p style="color: #555; font-size: 14px;">We received your request for a custom press-on nail set! Our team is reviewing your design specifications and will contact you shortly.</p>
        
        <div style="background-color: #fcf6f6; border-radius: 12px; padding: 18px; border: 1px solid #f5e6e5; margin: 20px 0;">
          <h3 style="color: #7a403d; margin-top: 0; font-size: 15px; border-bottom: 1px solid #eac5c1; padding-bottom: 6px;">Request Details</h3>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Shape:</strong> Oval</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Length:</strong> Extra Long</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Design Description:</strong> Marble Pink</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Color Preference:</strong> Baby Pink</p>
          
          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #eac5c1;">
            <p style="margin: 0 0 6px 0; color: #7a403d; font-weight: 600; font-size: 13px;">Reference Image Uploaded:</p>
            ${isRich ? `
              <div style="margin-top: 6px;">
                <img src="${sampleProductImg}" width="140" style="border-radius: 8px; border: 2px solid #7a403d; display: block;" alt="Uploaded Reference" />
              </div>
            ` : `
              <a href="${sampleProductImg}" target="_blank" style="color: #7a403d; font-size: 13px;">
                View Uploaded Reference Image ↗
              </a>
            `}
          </div>
        </div>
        
        <p style="color: #666; font-size: 13px;">We'll reach out via WhatsApp or email to finalize your custom set design and price quote.</p>
      `);
    }

    if (type === "admin_custom") {
      return wrap(`
        <div style="background-color: #fcf6f6; border-radius: 12px; padding: 18px; border: 1px solid #f5e6e5; margin-bottom: 20px;">
          <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; margin-top: 0;">New Custom Set Request</h2>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Customer:</strong> Dolapo (dfordolapo@gmail.com)</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Phone:</strong> 08187902241</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Shape:</strong> Oval</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Length:</strong> Extra Long</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Design:</strong> Marble Pink</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Color Preference:</strong> Baby Pink</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Notes:</strong> High gloss finish</p>
          
          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #eac5c1;">
            <p style="margin: 0 0 6px 0; color: #7a403d; font-weight: 700; font-size: 13px;">Uploaded Reference Photo:</p>
            <a href="${sampleProductImg}" target="_blank" style="display: inline-block;">
              <img src="${sampleProductImg}" alt="Reference Image" style="max-width: 180px; max-height: 180px; border-radius: 8px; border: 1px solid #eae1e0;" />
            </a>
            <br/>
            <a href="${sampleProductImg}" target="_blank" style="color: #7a403d; font-size: 12px; text-decoration: underline; margin-top: 4px; display: inline-block;">Open Full Resolution Image ↗</a>
          </div>
        </div>

        <div align="center">
          <a href="/admin/custom-orders" 
             style="display: inline-block; padding: 13px 26px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">
            View Custom Orders Dashboard
          </a>
        </div>
      `);
    }

    if (type === "buyer_shipped") {
      return wrap(`
        <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0;">Your Order Has Shipped!</h2>
        <p style="color: #555; font-size: 14px;">Hi Dolapo, guess what? Your fresh set just left our studio and is headed straight to you! We've packed everything with care, so get those nails ready to slay.</p>

        ${isRich ? `
          <!-- OUTLINED STEPPER GRAPHIC -->
          <div style="margin: 20px 0; background: #fcf6f6; border-radius: 12px; padding: 16px 12px; border: 1px solid #f5e6e5; text-align: center;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" width="33%">
                  <div style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid #7a403d; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 4px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a403d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div style="font-size: 11px; font-weight: 700; color: #7a403d;">Crafted</div>
                </td>
                <td align="center" width="33%">
                  <div style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid #7a403d; background-color: #f7e8e8; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 4px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a403d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  </div>
                  <div style="font-size: 11px; font-weight: 700; color: #7a403d;">Dispatched</div>
                </td>
                <td align="center" width="33%">
                  <div style="width: 36px; height: 36px; border-radius: 50%; border: 2px dashed #ccc; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 4px;">
                    <!-- Gift Box / Delivered Icon -->
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 12 20 22 4 22 4 12"/>
                      <rect x="2" y="7" width="20" height="5"/>
                      <line x1="12" y1="22" x2="12" y2="7"/>
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                      <path d="M12 7h4.5a2.5 2.5 0 0 1 0-5C13 2 12 7 12 7z"/>
                    </svg>
                  </div>
                  <div style="font-size: 11px; font-weight: 500; color: #aaa;">Delivered</div>
                </td>
              </tr>
            </table>
          </div>
        ` : ''}

        <div style="background-color: #fcf6f6; border-radius: 12px; padding: 16px 20px; border: 1px solid #f5e6e5; margin: 20px 0;">
          <div style="display: inline-block; background-color: #7a403d; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 10px;">ORDER #596e0942</div>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Delivery Address</p>
          <p style="margin: 0; font-weight: 600; color: #2d2d2d; font-size: 14px;">
            16, Yinka Ogunfile Street, Ikorodu<br/>
            Ikorodu, Lagos
          </p>
        </div>

        <p style="color: #666; font-size: 13px;">If you need any assistance, reply directly to this email or chat with us on WhatsApp.</p>
      `);
    }

    if (type === "buyer_delivered") {
      return wrap(`
        <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0;">Your Order Has Been Delivered</h2>
        <p style="color: #555; font-size: 14px;">Hi Dolapo, your order <strong>#596e0942</strong> has been successfully delivered. We hope you love your new press-on set!</p>

        ${isRich ? `
          <!-- OUTLINED 3-STEP APPLICATION GUIDE (RESPONSIVE FOR MOBILE) -->
          <div style="margin: 20px 0; background: #fff5f7; border-radius: 12px; padding: 16px 12px; border: 1px solid #f5e6e5;">
            <h4 style="margin: 0 0 14px 0; color: #7a403d; font-size: 14px; font-family: Georgia, serif; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">How To Apply Your Press-On Set</h4>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="step-cell" align="center" width="33%" style="padding: 0 4px; vertical-align: top;">
                  <div style="background: #ffffff; padding: 12px 6px; border-radius: 10px; border: 1px solid #f0e6e5;">
                    <div style="margin-bottom: 6px;">
                      <!-- Polish Bottle / Prep Icon -->
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a403d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 2h4v4h-4z"/>
                        <path d="M7 9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V9z"/>
                        <path d="M10 13h4"/>
                      </svg>
                    </div>
                    <div style="font-size: 11px; font-weight: 700; color: #7a403d;">1. Clean & Prep</div>
                    <div style="font-size: 10px; color: #777; margin-top: 2px;">Alcohol wipe nails</div>
                  </div>
                </td>
                <td class="step-cell" align="center" width="33%" style="padding: 0 4px; vertical-align: top;">
                  <div style="background: #ffffff; padding: 12px 6px; border-radius: 10px; border: 1px solid #f0e6e5;">
                    <div style="margin-bottom: 6px;">
                      <!-- Finger Sizing Guide Icon -->
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a403d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 22V9a3 3 0 0 1 6 0v13"/>
                        <path d="M9 9c0-3 3-5 3-5s3 2 3 5"/>
                        <path d="M4 11l-2 2 2 2"/>
                        <path d="M20 11l2 2-2 2"/>
                        <line x1="2" y1="13" x2="6" y2="13"/>
                        <line x1="18" y1="13" x2="22" y2="13"/>
                      </svg>
                    </div>
                    <div style="font-size: 11px; font-weight: 700; color: #7a403d;">2. Match Sizes</div>
                    <div style="font-size: 10px; color: #777; margin-top: 2px;">Fit each nail tip</div>
                  </div>
                </td>
                <td class="step-cell" align="center" width="33%" style="padding: 0 4px; vertical-align: top;">
                  <div style="background: #ffffff; padding: 12px 6px; border-radius: 10px; border: 1px solid #f0e6e5;">
                    <div style="margin-bottom: 6px;">
                      <!-- Hand Pressing Gesture Icon -->
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a403d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5"/>
                        <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6"/>
                        <path d="M10 9.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7c0 4.42 3.58 8 8 8h1a7 7 0 0 0 7-7v-3.5a2.5 2.5 0 0 0-5 0V11"/>
                      </svg>
                    </div>
                    <div style="font-size: 11px; font-weight: 700; color: #7a403d;">3. Glue & Press</div>
                    <div style="font-size: 10px; color: #777; margin-top: 2px;">Hold firm 30 secs</div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        ` : `
          <div style="background-color: #fcf6f6; border-left: 4px solid #7a403d; padding: 16px; margin: 20px 0; border-radius: 8px;">
            <h4 style="margin: 0 0 4px 0; color: #7a403d; font-size: 14px;">Application Tip:</h4>
            <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.5;">
              Clean and prep your natural nails with an alcohol pad before applying your adhesive tabs or nail glue for the longest lasting wear.
            </p>
          </div>
        `}

        <div style="text-align: center; margin: 22px 0; padding: 16px; background-color: #f7e8e8; border-radius: 12px;">
          <p style="margin: 0 0 4px 0; font-weight: 700; color: #7a403d; font-size: 15px;">Show Off Your Set</p>
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
    <div style={{ minHeight: "100vh", backgroundColor: "#f4efee", padding: "20px 12px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* TOP BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", background: "#ffffff", padding: "14px 18px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/" style={{ color: "#7a403d", display: "flex", alignItems: "center", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
              <ArrowLeft size={16} style={{ marginRight: "4px" }} /> Home
            </Link>
            <span style={{ color: "#ccc" }}>|</span>
            <span style={{ fontWeight: "700", color: "#7a403d", fontSize: "1rem" }}>Nailexpress Visual Email Designer</span>
          </div>
          <span style={{ background: "#7a403d", color: "#fff", padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" }}>
            LOCAL PLAYGROUND
          </span>
        </div>

        {/* LAYOUT STYLE CONTROLLER */}
        <div style={{ background: "#ffffff", padding: "14px 18px", borderRadius: "12px", marginBottom: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "#7a403d", fontWeight: "700", fontSize: "13px" }}>
            <Layout size={16} /> GRAPHICAL ELEMENTS & LAYOUT STYLE:
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => setLayoutStyle("rich")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: layoutStyle === "rich" ? "2px solid #7a403d" : "1px solid #ddd",
                backgroundColor: layoutStyle === "rich" ? "#7a403d" : "#fafafa",
                color: layoutStyle === "rich" ? "#ffffff" : "#333",
                fontWeight: layoutStyle === "rich" ? "700" : "500",
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              <ImageIcon size={15} /> Rich Visual Layout (Product Photos & Clean Outlined SVG Icons)
            </button>
            <button
              onClick={() => setLayoutStyle("minimal")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: layoutStyle === "minimal" ? "2px solid #7a403d" : "1px solid #ddd",
                backgroundColor: layoutStyle === "minimal" ? "#7a403d" : "#fafafa",
                color: layoutStyle === "minimal" ? "#ffffff" : "#333",
                fontWeight: layoutStyle === "minimal" ? "700" : "500",
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              Minimalist Clean Layout (Text & Cards Only)
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
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
                  gap: "6px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: isActive ? "2px solid #7a403d" : "1px solid #ddd",
                  backgroundColor: isActive ? "#7a403d" : "#ffffff",
                  color: isActive ? "#ffffff" : "#444",
                  fontWeight: isActive ? "700" : "500",
                  fontSize: "12px",
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
        <div style={{ backgroundColor: "#ffffff", borderTopLeftRadius: "12px", borderTopRightRadius: "12px", padding: "16px 20px", borderBottom: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <h2 style={{ margin: 0, color: "#7a403d", fontSize: "1.1rem", fontFamily: "Georgia, serif" }}>{currentTab.subject}</h2>
            <span style={{ background: "#f7e8e8", color: "#7a403d", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>
              {currentTab.badge}
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "#666", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "8px" }}>
            <div><strong>From:</strong> {currentTab.from}</div>
            <div><strong>To:</strong> {currentTab.to}</div>
            <div><strong>Reply-To:</strong> {currentTab.replyTo}</div>
          </div>
        </div>

        {/* LIVE RENDER FRAME */}
        <div style={{ backgroundColor: "#ffffff", borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px", padding: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <iframe
            srcDoc={getHtml(activeTab)}
            title="Email Visual Preview"
            style={{ width: "100%", height: "650px", border: "none", borderRadius: "8px" }}
          />
        </div>

      </div>
    </div>
  );
}

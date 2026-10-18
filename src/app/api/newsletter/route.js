import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { sendRestockRequestConfirmationEmail, sendAdminRestockLeadAlert } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key"
);

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_fallback_for_build');

export async function POST(request) {
  try {
    const {
      email,
      type = 'newsletter',
      productId = null,
      productName = null,
      collectionId = null,
      collectionName = null,
    } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL || 'nailxpressng@gmail.com';
    const sender = process.env.SENDER_EMAIL || 'orders@nailexpress.ng';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng';

    // 1. Save subscriber to Supabase
    try {
      await supabaseAdmin.from('subscribers').insert([
        {
          email: cleanEmail,
          subscription_type: type,
          product_id: productId,
          product_name: productName,
          collection_id: collectionId,
          collection_name: collectionName,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (dbErr) {
      console.warn("Subscribers table insert warning:", dbErr.message);
    }

    // 2. Send acknowledgement email based on type
    if (type === 'restock') {
      await sendRestockRequestConfirmationEmail(cleanEmail, productName || 'Your Requested Set', null);
      await sendAdminRestockLeadAlert(cleanEmail, productName || 'Sold-out set', null, adminEmail);

    } else if (type === 'drop_notification') {
      // Waitlist acknowledgement email
      const dropName = collectionName || 'our next collection';
      const ackHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
        </head>
        <body style="margin:0; padding:0; background-color:#f7f3f2; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:30px auto; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.06); border:1px solid #eae1e0;">
            <tr>
              <td align="center" style="background-color:#1a1a1a; padding:36px 20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-family:'Cormorant Garamond', Georgia, serif; font-size:28px; letter-spacing:4px; text-transform:uppercase;">NAILEXPRESS</h1>
                <p style="color:#999; margin:6px 0 0 0; font-size:11px; letter-spacing:3px; text-transform:uppercase;">Premium Press-On Nails</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 32px;">
                <p style="font-size:12px; color:#999; letter-spacing:2px; text-transform:uppercase; margin:0 0 12px 0;">DROP ALERT</p>
                <h2 style="color:#1a1a1a; font-family:'Cormorant Garamond', Georgia, serif; font-size:28px; margin:0 0 16px 0; font-weight:600;">You're on the list.</h2>
                <p style="font-size:15px; color:#555; line-height:1.7; margin:0 0 24px 0;">
                  We'll send you a personal email the moment <strong style="color:#1a1a1a;">${dropName}</strong> goes live — so you're first in line before anyone else.
                </p>
                <div style="background-color:#f7f3f2; border-left:3px solid #7a403d; padding:16px 20px; border-radius:4px; margin-bottom:28px;">
                  <p style="margin:0; font-size:13px; color:#555; line-height:1.8;">
                    ✦ Early access for waitlist members<br>
                    ✦ First look at new pieces<br>
                    ✦ No spam — just your moment to shop
                  </p>
                </div>
                <div style="text-align:center; margin:20px 0 0 0;">
                  <a href="${siteUrl}/shop" style="display:inline-block; padding:14px 32px; background-color:#1a1a1a; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:12px; text-transform:uppercase; letter-spacing:1.5px;">
                    Browse Current Collections →
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color:#fcf6f6; padding:20px; text-align:center; border-top:1px solid #f0e6e5; font-size:12px; color:#777;">
                © ${new Date().getFullYear()} Nailexpress • Lagos, Nigeria
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      await resend.emails.send({
        from: `Nailexpress <${sender}>`,
        to: [cleanEmail],
        replyTo: adminEmail,
        subject: `You're on the waitlist — ${dropName} ✦`,
        html: ackHtml,
      }).catch(e => console.error("Drop notification ack email error:", e));

    } else {
      // General newsletter welcome
      const welcomeHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
        </head>
        <body style="margin:0; padding:0; background-color:#f7f3f2; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:30px auto; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.06); border:1px solid #eae1e0;">
            <tr>
              <td align="center" style="background-color:#7a403d; padding:32px 20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-family:'Cormorant Garamond', Georgia, serif; font-size:28px; letter-spacing:4px; text-transform:uppercase;">NAILEXPRESS</h1>
                <p style="color:#eac5c1; margin:4px 0 0 0; font-size:11px; letter-spacing:3px; text-transform:uppercase;">Premium Press-On Nails</p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 28px;">
                <h2 style="color:#7a403d; font-family:'Cormorant Garamond', Georgia, serif; font-size:24px; margin-top:0;">You're on the list!</h2>
                <p style="font-size:15px; color:#444; line-height:1.6;">
                  Thank you for joining Nailexpress! You'll be the first to know about new drop releases, exclusive VIP secret sales, and fresh handmade nail art inspirations.
                </p>
                <div style="text-align:center; margin:28px 0;">
                  <a href="${siteUrl}/shop" style="display:inline-block; padding:13px 28px; background-color:#7a403d; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:13px; text-transform:uppercase; letter-spacing:1px;">
                    Explore New Drops ↗
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color:#fcf6f6; padding:20px; text-align:center; border-top:1px solid #f0e6e5; font-size:12px; color:#777;">
                © ${new Date().getFullYear()} Nailexpress • Lagos, Nigeria
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      await resend.emails.send({
        from: `Nailexpress <${sender}>`,
        to: [cleanEmail],
        replyTo: adminEmail,
        subject: "Welcome to the Nailexpress Inner Circle ✨",
        html: welcomeHtml
      }).catch(e => console.error("Subscriber email send error:", e));
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { sendRestockRequestConfirmationEmail, sendAdminRestockLeadAlert } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_fallback_for_build');

export async function POST(request) {
  try {
    const { email, type = 'newsletter', productId = null, productName = null } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check/Insert into subscribers table in Supabase
    try {
      await supabaseAdmin.from('subscribers').insert([
        {
          email: cleanEmail,
          subscription_type: type,
          product_id: productId,
          product_name: productName,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (dbErr) {
      console.warn("Subscribers table insert warning:", dbErr.message);
    }

    // 2. Send instant welcome / restock acknowledgement
    const adminEmail = process.env.ADMIN_EMAIL || 'nailxpressng@gmail.com';

    if (type === 'restock') {
      await sendRestockRequestConfirmationEmail(cleanEmail, productName || 'Your Requested Set', null);
      await sendAdminRestockLeadAlert(cleanEmail, productName || 'Sold-out set', null, adminEmail);
    } else {
      // General newsletter welcome
      const sender = process.env.SENDER_EMAIL || 'orders@nailexpress.ng';
      const welcomeHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
        </head>
        <body style="margin:0; padding:0; background-color:#f7f3f2; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #eae1e0;">
            <tr>
              <td align="center" style="background-color: #7a403d; padding: 32px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; letter-spacing: 4px; text-transform: uppercase;">NAILEXPRESS</h1>
                <p style="color: #eac5c1; margin: 4px 0 0 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Premium Press-On Nails</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 36px 28px;">
                <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0;">You're on the list!</h2>
                <p style="font-size: 15px; color: #444; line-height: 1.6;">
                  Thank you for joining Nailexpress! You'll be the first to know about new drop releases, exclusive VIP secret sales, and fresh handmade nail art inspirations.
                </p>
                <div style="text-align: center; margin: 28px 0;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng'}/shop"
                     style="display: inline-block; padding: 13px 28px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                    Explore New Drops ↗
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color: #fcf6f6; padding: 20px; text-align: center; border-top: 1px solid #f0e6e5; font-size: 12px; color: #777;">
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

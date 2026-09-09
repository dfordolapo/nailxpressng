import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_fallback_for_build');

// GET: Fetch all subscribers for Admin dashboard
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ subscribers: data || [] });
  } catch (error) {
    console.error('Fetch Subscribers Error:', error);
    return NextResponse.json({ subscribers: [] }, { status: 500 });
  }
}

// POST: Trigger Broadcast or Restock Alert Email to specific subscribers
export async function POST(request) {
  try {
    const { subscriberIds, productName, productSlug, message } = await request.json();

    if (!subscriberIds || subscriberIds.length === 0) {
      return NextResponse.json({ error: 'No subscribers selected' }, { status: 400 });
    }

    const { data: subs, error } = await supabaseAdmin
      .from('subscribers')
      .select('id, email, product_name')
      .in('id', subscriberIds);

    if (error || !subs) throw error;

    const sender = process.env.SENDER_EMAIL || 'orders@nailexpress.ng';
    const adminEmail = process.env.ADMIN_EMAIL || 'nailxpressng@gmail.com';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng';
    const targetUrl = productSlug ? `${siteUrl}/product/${productSlug}` : `${siteUrl}/shop`;

    const html = `
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
              <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0;">Good news! ${productName ? productName + ' is Back in Stock' : 'Fresh Drops Just Landed'} ✨</h2>
              <p style="font-size: 15px; color: #444; line-height: 1.6;">
                ${message || `You asked to be notified when ${productName || 'this set'} was restocked. Fresh batches have just been handcrafted and are available now in limited quantities.`}
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${targetUrl}"
                   style="display: inline-block; padding: 14px 28px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                  Shop ${productName || 'The Collection'} ↗
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

    // Send restock alert to all selected emails
    for (const sub of subs) {
      await resend.emails.send({
        from: `Nailexpress <${sender}>`,
        to: [sub.email],
        replyTo: adminEmail,
        subject: `Back in Stock: ${productName || sub.product_name || 'Your Requested Set'} ✨`,
        html
      }).catch(e => console.error(`Error notifying ${sub.email}:`, e));
    }

    return NextResponse.json({ success: true, count: subs.length });
  } catch (error) {
    console.error('Notify Subscribers Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import {
  sendOrderConfirmationEmail,
  sendAdminNewOrderAlert,
  sendCustomOrderConfirmationEmail,
  sendAdminCustomOrderAlert,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderCancellationEmail,
  sendAbandonedCheckoutEmail,
} from '../src/lib/email.js';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_fallback_for_build');
const sender = process.env.SENDER_EMAIL || 'orders@nailexpress.ng';
const targetEmail = 'dfordolapo@gmail.com';

const placeholderItems = [
  {
    product_name: 'Velvet Noir Stiletto Set',
    name: 'Velvet Noir Stiletto Set',
    quantity: 1,
    price: 18500,
    selected_size: 'M (15mm, 11mm, 12mm, 11mm, 8mm)',
    selectedSize: 'M (15mm, 11mm, 12mm, 11mm, 8mm)',
    selected_length: 'Medium Stiletto',
    selectedLength: 'Medium Stiletto',
    slug: 'velvet-noir-stiletto-set'
  },
  {
    product_name: 'Glazed Donut Almond Set',
    name: 'Glazed Donut Almond Set',
    quantity: 1,
    price: 16000,
    selected_size: 'S (14mm, 10mm, 11mm, 10mm, 7mm)',
    selectedSize: 'S (14mm, 10mm, 11mm, 10mm, 7mm)',
    selected_length: 'Short Almond',
    selectedLength: 'Short Almond',
    slug: 'glazed-donut-almond-set'
  }
];

const placeholderOrder = {
  id: 'NX-89241-PORTFOLIO',
  customer_first_name: 'Dolapo',
  customer_last_name: 'Adewale',
  customer_email: targetEmail,
  customer_phone: '+234 812 345 6789',
  shipping_address: '14 Admiralty Way, Lekki Phase 1',
  shipping_city: 'Lekki / Victoria Island',
  shipping_state: 'Lagos',
  shipping_fee: 3500,
  total_amount: 38000,
  items: placeholderItems
};

const placeholderCustomOrder = {
  id: 'CUST-7741',
  name: 'Dolapo Adewale',
  email: targetEmail,
  phone: '+234 812 345 6789',
  shape: 'Coffin / Ballerina',
  length: 'Long (28mm)',
  design: 'French tip ombre with 3D chrome swirls, micro pearls on accent nails, and glossy gel finish',
  color: 'Soft Blush Pink, Chrome Rose Gold & Pearl White',
  notes: 'Need this for an upcoming luxury editorial shoot and portfolio showcase. Please include sizing kit tabs.',
  image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop'
};

// Helper for sending Customer Restock Waitlist Confirmation Email
async function sendCustomerRestockConfirmation(email, productName) {
  try {
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
              <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0;">We'll let you know when it's back! ✨</h2>
              <p style="font-size: 15px; color: #444; line-height: 1.6;">
                Hi Dolapo, we've added you to the priority restock list for <strong>${productName}</strong>.
              </p>
              <p style="font-size: 15px; color: #444; line-height: 1.6;">
                Our nail artists are currently handcrafting the next studio batch. The moment this set is back in stock and ready for dispatch, you will receive an instant priority notification with an early-access checkout link.
              </p>
              <div style="background-color: #fdf8f8; padding: 16px 20px; border-radius: 10px; border: 1px solid #f2e2e1; margin: 24px 0;">
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #7a403d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Requested Set</p>
                <p style="margin: 0; font-size: 15px; font-weight: 700; color: #2d2d2d;">${productName}</p>
              </div>
              <div style="text-align: center; margin: 28px 0 10px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng'}/shop"
                   style="display: inline-block; padding: 13px 28px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                  Explore Available Sets ↗
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

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${sender}>`,
      to: [email],
      subject: `Restock Alert Requested: ${productName}`,
      html
    });

    return { success: !error, error };
  } catch (error) {
    return { success: false, error };
  }
}

// Helper for sending Admin Restock Request Alert Email
async function sendAdminRestockAlert(adminEmail, customerEmail, productName) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f3f2; margin:0; padding: 20px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #eae1e0;">
          <tr>
            <td>
              <h2 style="color: #7a403d; margin-top: 0; font-size: 20px;">🔔 New Product Restock Request</h2>
              <p style="font-size: 14px; color: #444; line-height: 1.5;">
                A shopper requested an alert when <strong>${productName}</strong> is restocked.
              </p>
              <div style="background-color: #fdf8f8; padding: 14px 18px; border-radius: 8px; border: 1px solid #f2e2e1; margin: 16px 0;">
                <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Customer Email:</strong> ${customerEmail}</p>
                <p style="margin: 0; font-size: 13px;"><strong>Requested Set:</strong> ${productName}</p>
              </div>
              <p style="font-size: 13px; color: #666;">
                You can review demand numbers and trigger a one-click restock notification from the <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng'}/admin/subscribers" style="color: #7a403d; font-weight: 600;">Admin Subscribers Hub</a> once new inventory is added.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress System <${sender}>`,
      to: [adminEmail],
      subject: `🔔 Restock Request: ${productName} (${customerEmail})`,
      html
    });

    return { success: !error, error };
  } catch (error) {
    return { success: false, error };
  }
}

// Helper for sending Restock Broadcast Available Email ("Back in Stock!")
async function sendRestockAvailableBroadcast(email, productName, productSlug) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng';
    const targetUrl = `${siteUrl}/product/${productSlug}`;

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
              <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0;">Good news! ${productName} is Back in Stock ✨</h2>
              <p style="font-size: 15px; color: #444; line-height: 1.6;">
                Hi Dolapo, you asked us to notify you when <strong>${productName}</strong> became available again. Fresh handcrafted batches have just landed in the studio in limited quantities!
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${targetUrl}"
                   style="display: inline-block; padding: 14px 32px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 14px rgba(122, 64, 61, 0.25);">
                  Shop ${productName} Now ↗
                </a>
              </div>
              <p style="font-size: 13px; color: #777; text-align: center; margin: 0;">
                Because sets are 100% handcrafted in small batches, stock is claimed quickly on a first-come basis.
              </p>
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

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${sender}>`,
      to: [email],
      subject: `Back in Stock: ${productName} ✨`,
      html
    });

    return { success: !error, error };
  } catch (error) {
    return { success: false, error };
  }
}

async function sendAllPortfolioEmails() {
  console.log(`\n🚀 Starting delivery of all email templates & notify me emails to: ${targetEmail}\n`);

  const results = [];

  // 1. Order Confirmation (Buyer)
  console.log('1. Sending Order Confirmation (Buyer)...');
  const res1 = await sendOrderConfirmationEmail(placeholderOrder, placeholderItems);
  results.push({ email: '1. Buyer Order Confirmation', res: res1 });

  // 2. Admin New Order Alert
  console.log('2. Sending Admin New Order Alert...');
  const res2 = await sendAdminNewOrderAlert(placeholderOrder, placeholderItems, targetEmail);
  results.push({ email: '2. Admin New Order Alert', res: res2 });

  // 3. Custom Order Confirmation (Buyer)
  console.log('3. Sending Custom Order Request Confirmation (Buyer)...');
  const res3 = await sendCustomOrderConfirmationEmail(placeholderCustomOrder);
  results.push({ email: '3. Buyer Custom Order Confirmation', res: res3 });

  // 4. Admin Custom Order Alert
  console.log('4. Sending Admin Custom Order Alert...');
  const res4 = await sendAdminCustomOrderAlert(placeholderCustomOrder, targetEmail);
  results.push({ email: '4. Admin Custom Order Alert', res: res4 });

  // 5. Order Shipped (Buyer)
  console.log('5. Sending Order Shipped Email...');
  const res5 = await sendOrderShippedEmail(placeholderOrder);
  results.push({ email: '5. Buyer Order Shipped', res: res5 });

  // 6. Order Delivered (Buyer)
  console.log('6. Sending Order Delivered Email...');
  const res6 = await sendOrderDeliveredEmail(placeholderOrder, placeholderItems);
  results.push({ email: '6. Buyer Order Delivered', res: res6 });

  // 7. Order Cancelled (Buyer)
  console.log('7. Sending Order Cancelled Email...');
  const res7 = await sendOrderCancellationEmail(
    placeholderOrder,
    'The selected custom artisan gems for this limited seasonal edition are temporarily out of stock.',
    'A full refund of ₦38,000 has been initiated to your original payment method. You will also receive a 15% VIP discount code for your next order.'
  );
  results.push({ email: '7. Buyer Order Cancelled', res: res7 });

  // 8. Abandoned Checkout Recovery (Buyer)
  console.log('8. Sending Abandoned Checkout Recovery Email...');
  const res8 = await sendAbandonedCheckoutEmail(placeholderOrder, placeholderItems);
  results.push({ email: '8. Abandoned Checkout Recovery', res: res8 });

  // 9. Buyer Restock Waitlist Confirmation (Notify Me)
  console.log('9. Sending Buyer Restock Alert Confirmation (Notify Me)...');
  const res9 = await sendCustomerRestockConfirmation(targetEmail, 'Rose Gold Chrome French Stiletto Set');
  results.push({ email: '9. Buyer Notify Me Waitlist Confirmation', res: res9 });

  // 10. Admin Restock Request Alert (Notify Me)
  console.log('10. Sending Admin Restock Request Alert...');
  const res10 = await sendAdminRestockAlert(targetEmail, targetEmail, 'Rose Gold Chrome French Stiletto Set');
  results.push({ email: '10. Admin Restock Alert Notification', res: res10 });

  // 11. Restock "Back in Stock" Alert Broadcast
  console.log('11. Sending "Back in Stock" Broadcast Alert...');
  const res11 = await sendRestockAvailableBroadcast(targetEmail, 'Rose Gold Chrome French Stiletto Set', 'rose-gold-chrome-french-stiletto-set');
  results.push({ email: '11. Buyer "Back in Stock" Broadcast Alert', res: res11 });

  console.log('\n--- EMAIL DISPATCH RESULTS ---');
  results.forEach(r => {
    console.log(`${r.email}: ${r.res.success ? '✅ SENT SUCCESSFULLY' : '❌ FAILED - ' + JSON.stringify(r.res.error)}`);
  });
}

sendAllPortfolioEmails();

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_AXGp4Ti4_DwL6PCzXkdsaT7G2DzXwWwKy');

// Default sender address
const fromEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
const adminDefaultEmail = process.env.ADMIN_EMAIL || 'nailxpressng@gmail.com';

// Common Email Layout Wrapper
function wrapEmailTemplate(contentTitle, contentHtml) {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${contentTitle}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f3f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #eae1e0;">
        <!-- BRAND HEADER -->
        <tr>
          <td align="center" style="background-color: #7a403d; padding: 36px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; letter-spacing: 3px; text-transform: uppercase; font-weight: 600;">NAILEXPRESS</h1>
            <p style="color: #eac5c1; margin: 6px 0 0 0; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; font-weight: 500;">Luxury Press-On Nails</p>
          </td>
        </tr>

        <!-- CONTENT BODY -->
        <tr>
          <td style="padding: 36px 28px; color: #2d2d2d; font-size: 15px; line-height: 1.6;">
            ${contentHtml}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color: #fcf6f6; padding: 28px 20px; text-align: center; border-top: 1px solid #f0e6e5;">
            <p style="margin: 0 0 6px 0; font-size: 14px; color: #7a403d; font-weight: 700;">Follow Us @nailexpress.ng</p>
            <p style="margin: 0 0 14px 0; font-size: 12px; color: #777;">Have questions? Reply directly to this email or chat with us on WhatsApp.</p>
            <p style="margin: 0; font-size: 11px; color: #aaa; letter-spacing: 0.5px;">© ${currentYear} Nailexpress. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// 1. Buyer Order Confirmation Email
export async function sendOrderConfirmationEmail(order, items) {
  try {
    const orderNum = order.id ? order.id.split('-')[0] : '';
    const itemsHtml = items.map(item => `
      <tr style="border-bottom: 1px solid #f2e9e8;">
        <td style="padding: 12px 0; vertical-align: top;">
          <div style="font-weight: 700; color: #2d2d2d; font-size: 15px;">${item.quantity}x ${item.name || item.product_name}</div>
          <div style="font-size: 12px; color: #7a403d; margin-top: 4px; font-weight: 500;">
            Size: <span style="background: #f7e8e8; padding: 2px 8px; border-radius: 4px; color: #7a403d;">${item.selectedSize || item.selected_size}</span>
            &nbsp;•&nbsp;
            Length: <span style="background: #f7e8e8; padding: 2px 8px; border-radius: 4px; color: #7a403d;">${item.selectedLength || item.selected_length}</span>
          </div>
        </td>
        <td align="right" style="padding: 12px 0; vertical-align: top; font-weight: 700; color: #7a403d; font-size: 15px;">
          ₦${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join('');

    const bodyHtml = `
      <h2 style="color: #7a403d; font-family: Georgia, serif; font-size: 22px; margin-top: 0; margin-bottom: 8px;">Thanks for your order, ${order.customer_first_name}! ✨</h2>
      <p style="color: #555; margin-top: 0; margin-bottom: 24px;">We've received your order and are crafting it with love and care.</p>
      
      <!-- ORDER INFO BOX -->
      <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: #7a403d; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 12px;">ORDER #${orderNum}</div>
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</p>
        <p style="margin: 0; font-weight: 600; color: #2d2d2d;">
          ${order.shipping_address}<br/>
          ${order.shipping_city}, ${order.shipping_state}
        </p>
      </div>

      <!-- ITEMS TABLE -->
      <h3 style="color: #7a403d; font-size: 16px; margin-bottom: 12px; border-bottom: 2px solid #f2e9e8; padding-bottom: 8px;">Items Ordered</h3>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
        ${itemsHtml}
      </table>

      <!-- SUMMARY BOX -->
      <div style="border-top: 2px solid #7a403d; padding-top: 16px; margin-top: 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="color: #666; padding: 4px 0;">Shipping Fee:</td>
            <td align="right" style="color: #2d2d2d; font-weight: 600;">₦${(order.shipping_fee || 0).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="color: #7a403d; font-weight: 700; font-size: 18px; padding-top: 8px;">Total Paid:</td>
            <td align="right" style="color: #7a403d; font-weight: 800; font-size: 20px; padding-top: 8px;">₦${(order.total_amount || 0).toLocaleString()}</td>
          </tr>
        </table>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${fromEmail}>`,
      to: [order.customer_email],
      replyTo: adminDefaultEmail,
      subject: `Order Confirmation - #${orderNum}`,
      html: wrapEmailTemplate(`Order Confirmation - #${orderNum}`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Order Confirmation Email Error:", error);
    return { success: false, error };
  }
}

// 2. Admin New Order Alert Email
export async function sendAdminNewOrderAlert(order, items = [], adminEmail) {
  try {
    const orderNum = order.id ? order.id.split('-')[0] : '';
    const adminTarget = adminEmail || adminDefaultEmail;
    
    const itemsHtml = items.map(item => `
      <tr style="border-bottom: 1px solid #f2e9e8;">
        <td style="padding: 10px 0;">
          <strong>${item.quantity}x ${item.name || item.product_name}</strong>
          <div style="font-size: 12px; color: #7a403d;">Size: ${item.selectedSize || item.selected_size} | Length: ${item.selectedLength || item.selected_length}</div>
        </td>
        <td align="right" style="font-weight: 700; color: #7a403d;">₦${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const bodyHtml = `
      <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin-bottom: 24px;">
        <h2 style="color: #7a403d; font-family: Georgia, serif; font-size: 20px; margin: 0 0 12px 0;">🎉 You Have a New Order!</h2>
        <p style="margin: 4px 0;"><strong>Order Number:</strong> #${orderNum}</p>
        <p style="margin: 4px 0;"><strong>Customer Name:</strong> ${order.customer_first_name} ${order.customer_last_name}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> ${order.customer_email}</p>
        <p style="margin: 4px 0;"><strong>Phone:</strong> ${order.customer_phone || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Delivery Address:</strong> ${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state}</p>
      </div>

      <h3 style="color: #7a403d; font-size: 16px; margin-bottom: 12px; border-bottom: 2px solid #f2e9e8; padding-bottom: 8px;">Order Details</h3>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
        ${itemsHtml}
      </table>

      <div style="background: #7a403d; color: #ffffff; padding: 16px 20px; border-radius: 10px; text-align: center; font-size: 18px; font-weight: 700; margin-bottom: 28px;">
        Total Order Amount: ₦${(order.total_amount || 0).toLocaleString()}
      </div>

      <div align="center">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://nailxpressng.vercel.app'}/admin/orders" 
           style="display: inline-block; padding: 14px 28px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
          View Order in Admin Dashboard
        </a>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress System <${fromEmail}>`,
      to: [adminTarget],
      subject: `New Order #${orderNum} Received - ₦${(order.total_amount || 0).toLocaleString()}`,
      html: wrapEmailTemplate(`New Order Alert - #${orderNum}`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Admin Order Alert Error:", error);
    return { success: false, error };
  }
}

// 3. Buyer Custom Set Confirmation
export async function sendCustomOrderConfirmationEmail(customOrder) {
  try {
    const bodyHtml = `
      <h2 style="color: #7a403d; font-family: Georgia, serif; font-size: 22px; margin-top: 0;">Hi ${customOrder.name}, 💅</h2>
      <p style="color: #555;">We received your request for a custom press-on nail set! Our team is reviewing your design specifications and will contact you shortly.</p>
      
      <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin: 24px 0;">
        <h3 style="color: #7a403d; margin-top: 0; font-size: 16px; border-bottom: 1px solid #eac5c1; padding-bottom: 8px;">Request Details</h3>
        <p style="margin: 6px 0;"><strong>Shape:</strong> ${customOrder.shape}</p>
        <p style="margin: 6px 0;"><strong>Length:</strong> ${customOrder.length}</p>
        <p style="margin: 6px 0;"><strong>Design Description:</strong> ${customOrder.design}</p>
        ${customOrder.color ? `<p style="margin: 6px 0;"><strong>Color Preference:</strong> ${customOrder.color}</p>` : ''}
        ${customOrder.notes ? `<p style="margin: 6px 0;"><strong>Special Notes:</strong> ${customOrder.notes}</p>` : ''}
      </div>
      
      <p style="color: #666; font-size: 14px;">We'll reach out via WhatsApp or email to finalize your custom set design and price quote!</p>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${fromEmail}>`,
      to: [customOrder.email],
      replyTo: adminDefaultEmail,
      subject: `Custom Nail Set Request Received! 💅`,
      html: wrapEmailTemplate(`Custom Nail Request`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Custom Order Confirmation Email Error:", error);
    return { success: false, error };
  }
}

// 4. Admin Custom Order Alert
export async function sendAdminCustomOrderAlert(customOrder, adminEmail) {
  try {
    const adminTarget = adminEmail || adminDefaultEmail;

    const bodyHtml = `
      <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin-bottom: 24px;">
        <h2 style="color: #7a403d; font-family: Georgia, serif; font-size: 20px; margin-top: 0;">✨ New Custom Set Request!</h2>
        <p style="margin: 4px 0;"><strong>Customer:</strong> ${customOrder.name} (${customOrder.email})</p>
        <p style="margin: 4px 0;"><strong>Phone:</strong> ${customOrder.phone || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Shape:</strong> ${customOrder.shape}</p>
        <p style="margin: 4px 0;"><strong>Length:</strong> ${customOrder.length}</p>
        <p style="margin: 4px 0;"><strong>Design:</strong> ${customOrder.design}</p>
        <p style="margin: 4px 0;"><strong>Color Preference:</strong> ${customOrder.color || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Notes:</strong> ${customOrder.notes || 'None'}</p>
      </div>

      <div align="center">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://nailxpressng.vercel.app'}/admin/custom-orders" 
           style="display: inline-block; padding: 14px 28px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
          View Custom Orders Dashboard
        </a>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress System <${fromEmail}>`,
      to: [adminTarget],
      subject: `New Custom Nail Request from ${customOrder.name}`,
      html: wrapEmailTemplate(`New Custom Nail Request`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Admin Custom Order Alert Error:", error);
    return { success: false, error };
  }
}

// 5. Buyer Order Shipped Email
export async function sendOrderShippedEmail(order) {
  try {
    const orderNum = order.id ? order.id.split('-')[0] : '';

    const bodyHtml = `
      <h2 style="color: #7a403d; font-family: Georgia, serif; font-size: 22px; margin-top: 0;">Great news, ${order.customer_first_name || 'Gorgeous'}! 🚚✨</h2>
      <p style="color: #555;">Your press-on nail set is on its way! We've packaged your items with care and dispatched your order for delivery.</p>
      
      <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin: 24px 0;">
        <div style="display: inline-block; background-color: #7a403d; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 12px;">ORDER #${orderNum}</div>
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Delivery Address</p>
        <p style="margin: 0; font-weight: 600; color: #2d2d2d;">
          ${order.shipping_address || ''}<br/>
          ${order.shipping_city || ''}, ${order.shipping_state || ''}
        </p>
      </div>

      <p style="color: #666; font-size: 14px;">Your package will arrive shortly. If you need any assistance, reply directly to this email or chat with us on WhatsApp!</p>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${fromEmail}>`,
      to: [order.customer_email],
      replyTo: adminDefaultEmail,
      subject: `Your Nailexpress Order #${orderNum} Has Shipped! 🚚✨`,
      html: wrapEmailTemplate(`Order Shipped - #${orderNum}`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Order Shipped Email Error:", error);
    return { success: false, error };
  }
}

// 6. Buyer Order Delivered Email
export async function sendOrderDeliveredEmail(order) {
  try {
    const orderNum = order.id ? order.id.split('-')[0] : '';

    const bodyHtml = `
      <h2 style="color: #7a403d; font-family: Georgia, serif; font-size: 22px; margin-top: 0;">Your nails have arrived, ${order.customer_first_name || 'Gorgeous'}! 💅✨</h2>
      <p style="color: #555;">Your order <strong>#${orderNum}</strong> has been successfully delivered. We hope you absolutely love your new press-on set!</p>
      
      <div style="background-color: #fcf6f6; border-left: 4px solid #7a403d; padding: 18px; margin: 24px 0; border-radius: 8px;">
        <h4 style="margin: 0 0 6px 0; color: #7a403d; font-size: 15px;">✨ Quick Prep Tip:</h4>
        <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.5;">
          Clean and prep your natural nails with an alcohol pad before applying your adhesive tabs or nail glue for the longest lasting wear!
        </p>
      </div>

      <div style="text-align: center; margin: 28px 0; padding: 20px; background-color: #f7e8e8; border-radius: 12px;">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: #7a403d; font-size: 16px;">Show Off Your Set! 📸</p>
        <p style="margin: 0; font-size: 13px; color: #555;">Tag us on Instagram <strong>@nailexpress.ng</strong> — we'd love to feature you!</p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${fromEmail}>`,
      to: [order.customer_email],
      replyTo: adminDefaultEmail,
      subject: `Your Order #${orderNum} Has Been Delivered! 💅✨`,
      html: wrapEmailTemplate(`Order Delivered - #${orderNum}`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Order Delivered Email Error:", error);
    return { success: false, error };
  }
}

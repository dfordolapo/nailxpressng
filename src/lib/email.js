import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_fallback_for_build');

// Default sender address
const fromEmail = process.env.SENDER_EMAIL || 'orders@nailexpress.ng';
const adminDefaultEmail = process.env.ADMIN_EMAIL || 'nailxpressng@gmail.com';

function getAbsoluteImageUrl(img) {
  if (!img) return null;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng';
  const cleanPath = img.startsWith('/') ? img : `/${img}`;
  return `${siteUrl}${cleanPath}`;
}

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
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f3f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #eae1e0;">
        <!-- BRAND HEADER -->
        <tr>
          <td align="center" style="background-color: #7a403d; padding: 36px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; font-size: 30px; letter-spacing: 4px; text-transform: uppercase; font-weight: 600;">NAILEXPRESS</h1>
            <p style="color: #eac5c1; margin: 6px 0 0 0; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; font-weight: 500;">Premium Press-On Nails</p>
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
            <p style="margin: 0 0 6px 0; font-size: 14px; color: #7a403d; font-weight: 600;">Follow Us @nailexpress.ng</p>
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
    const itemsHtml = items.map(item => {
      const rawImg = item.image || (Array.isArray(item.images) ? item.images[0] : null) || item.image_url;
      const imgUrl = getAbsoluteImageUrl(rawImg);
      return `
      <tr style="border-bottom: 1px solid #f2e9e8;">
        ${imgUrl ? `
          <td width="60" style="padding: 10px 12px 10px 0; vertical-align: top;">
            <img src="${imgUrl}" width="52" height="52" style="border-radius: 8px; object-fit: cover; border: 1px solid #eae1e0; display: block;" alt="${item.name || item.product_name || 'Nails'}" />
          </td>
        ` : ''}
        <td style="padding: 10px 0; vertical-align: top;">
          <div style="font-weight: 700; color: #2d2d2d; font-size: 14px;">${item.quantity}x ${item.name || item.product_name}</div>
          <div style="font-size: 11px; color: #7a403d; margin-top: 3px; font-weight: 500; white-space: nowrap;">
            Size: <span style="background: #f7e8e8; padding: 1px 5px; border-radius: 4px; color: #7a403d;">${item.selectedSize || item.selected_size || 'M'}</span>
            &nbsp;•&nbsp;
            Length: <span style="background: #f7e8e8; padding: 1px 5px; border-radius: 4px; color: #7a403d;">${item.selectedLength || item.selected_length || 'Medium'}</span>
          </div>
        </td>
        <td align="right" style="padding: 10px 0; vertical-align: top; font-weight: 700; color: #7a403d; font-size: 14px; white-space: nowrap;">
          ₦${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
      `;
    }).join('');

    const deliveryTimeDisplay = order.delivery_time || '3-5 business days';

    const bodyHtml = `
      <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0; margin-bottom: 8px;">Thanks for your order, ${order.customer_first_name}!</h2>
      <p style="color: #555; margin-top: 0; margin-bottom: 24px;">We've received your order and are crafting it with care.</p>
      
      <!-- ORDER INFO BOX -->
      <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: #7a403d; color: #ffffff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 14px;">ORDER #${orderNum}</div>
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="vertical-align: top; padding-bottom: 12px;">
              <p style="margin: 0 0 4px 0; font-size: 11px; color: #7a403d; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Estimated Delivery</p>
              <p style="margin: 0; font-weight: 500; color: #3d3d3d; font-size: 14px; line-height: 1.4;">
                ${deliveryTimeDisplay}
              </p>
            </td>
          </tr>
          <tr>
            <td style="vertical-align: top; border-top: 1px dashed #eac5c1; padding-top: 12px;">
              <p style="margin: 0 0 4px 0; font-size: 11px; color: #7a403d; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</p>
              <p style="margin: 0; font-weight: 500; color: #2d2d2d; font-size: 14px; line-height: 1.5;">
                ${order.shipping_address}<br/>
                ${order.shipping_city}, ${order.shipping_state}
              </p>
              ${order.shipping_method ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #888;">Method: ${order.shipping_method}</p>` : ''}
            </td>
          </tr>
        </table>
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
            <td style="color: #7a403d; font-weight: 600; font-size: 15px; padding-top: 8px;">Total Paid:</td>
            <td align="right" style="color: #7a403d; font-weight: 600; font-size: 16px; padding-top: 8px;">₦${(order.total_amount || 0).toLocaleString()}</td>
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
    
    const itemsHtml = items.map(item => {
      const rawImg = item.image || (Array.isArray(item.images) ? item.images[0] : null) || item.image_url;
      const imgUrl = getAbsoluteImageUrl(rawImg);
      return `
      <tr style="border-bottom: 1px solid #f2e9e8;">
        ${imgUrl ? `
          <td width="55" style="padding: 8px 10px 8px 0; vertical-align: top;">
            <img src="${imgUrl}" width="46" height="46" style="border-radius: 6px; object-fit: cover; border: 1px solid #eae1e0; display: block;" alt="Product" />
          </td>
        ` : ''}
        <td style="padding: 10px 0; vertical-align: top;">
          <strong>${item.quantity}x ${item.name || item.product_name}</strong>
          <div style="font-size: 12px; color: #7a403d;">Size: ${item.selectedSize || item.selected_size} | Length: ${item.selectedLength || item.selected_length}</div>
        </td>
        <td align="right" style="padding: 10px 0; vertical-align: top; font-weight: 700; color: #7a403d;">₦${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
      `;
    }).join('');

    const bodyHtml = `
      <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin-bottom: 24px;">
        <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; margin: 0 0 12px 0;">New Order Notification</h2>
        <p style="margin: 4px 0;"><strong>Order Number:</strong> #${orderNum}</p>
        <p style="margin: 4px 0;"><strong>Customer Name:</strong> ${order.customer_first_name} ${order.customer_last_name}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> ${order.customer_email}</p>
        <p style="margin: 4px 0;"><strong>Phone:</strong> ${order.customer_phone || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Estimated Delivery:</strong> ${order.delivery_time || '3-5 business days'}</p>
        <p style="margin: 4px 0;"><strong>Delivery Address:</strong> ${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state}</p>
        ${order.shipping_method ? `<p style="margin: 4px 0;"><strong>Shipping Method:</strong> ${order.shipping_method}</p>` : ''}
      </div>

      <h3 style="color: #7a403d; font-size: 16px; margin-bottom: 12px; border-bottom: 2px solid #f2e9e8; padding-bottom: 8px;">Order Details</h3>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
        ${itemsHtml}
      </table>

      <div style="background: #fcf6f6; color: #7a403d; border: 1px solid #f5e6e5; padding: 12px 16px; border-radius: 8px; text-align: center; font-size: 15px; font-weight: 600; margin-bottom: 24px;">
        Total Order Amount: ₦${(order.total_amount || 0).toLocaleString()}
      </div>

      <div align="center">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng'}/admin/orders" 
           style="display: inline-block; padding: 13px 26px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">
          View Order in Admin Dashboard
        </a>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress System <${fromEmail}>`,
      to: [adminTarget],
      subject: `New Order Received - #${orderNum}`,
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
      <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0;">Hi ${customOrder.name},</h2>
      <p style="color: #555;">We received your request for a custom press-on nail set! Our team is reviewing your design specifications and will contact you shortly.</p>
      
      <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin: 24px 0;">
        <h3 style="color: #7a403d; margin-top: 0; font-size: 16px; border-bottom: 1px solid #eac5c1; padding-bottom: 8px;">Request Details</h3>
        <p style="margin: 6px 0;"><strong>Shape:</strong> ${customOrder.shape}</p>
        <p style="margin: 6px 0;"><strong>Length:</strong> ${customOrder.length}</p>
        <p style="margin: 6px 0;"><strong>Design Description:</strong> ${customOrder.design}</p>
        ${customOrder.color ? `<p style="margin: 6px 0;"><strong>Color Preference:</strong> ${customOrder.color}</p>` : ''}
        ${customOrder.notes ? `<p style="margin: 6px 0;"><strong>Special Notes:</strong> ${customOrder.notes}</p>` : ''}
        ${(customOrder.image || customOrder.reference_image || customOrder.image_url) ? `
          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #eac5c1;">
            <p style="margin: 0 0 8px 0; color: #7a403d; font-weight: 600; font-size: 13px;">Reference Image Uploaded:</p>
            <a href="${customOrder.image || customOrder.reference_image || customOrder.image_url}" target="_blank" style="display: inline-block;">
              <img src="${customOrder.image || customOrder.reference_image || customOrder.image_url}" alt="Custom Reference" style="max-width: 160px; max-height: 160px; border-radius: 8px; border: 1px solid #eae1e0; display: block;" />
            </a>
            <br/>
            <a href="${customOrder.image || customOrder.reference_image || customOrder.image_url}" target="_blank" style="color: #7a403d; font-size: 12px; text-decoration: underline; margin-top: 4px; display: inline-block;">
              Open Full Resolution Image ↗
            </a>
          </div>
        ` : ''}
      </div>
      
      <p style="color: #666; font-size: 14px;">We'll reach out via WhatsApp or email to finalize your custom set design and price quote.</p>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${fromEmail}>`,
      to: [customOrder.email],
      replyTo: adminDefaultEmail,
      subject: `Custom Nail Set Request Received`,
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
    const refImage = customOrder.image || customOrder.reference_image || customOrder.image_url;

    const bodyHtml = `
      <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin-bottom: 24px;">
        <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; margin-top: 0;">New Custom Set Request</h2>
        <p style="margin: 4px 0;"><strong>Customer:</strong> ${customOrder.name} (${customOrder.email})</p>
        <p style="margin: 4px 0;"><strong>Phone:</strong> ${customOrder.phone || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Shape:</strong> ${customOrder.shape}</p>
        <p style="margin: 4px 0;"><strong>Length:</strong> ${customOrder.length}</p>
        <p style="margin: 4px 0;"><strong>Design:</strong> ${customOrder.design}</p>
        <p style="margin: 4px 0;"><strong>Color Preference:</strong> ${customOrder.color || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Notes:</strong> ${customOrder.notes || 'None'}</p>
        ${refImage ? `
          <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #eac5c1;">
            <p style="margin: 0 0 6px 0; color: #7a403d; font-weight: 600;">Uploaded Reference Photo:</p>
            <a href="${refImage}" target="_blank" style="display: inline-block;">
              <img src="${refImage}" alt="Reference Image" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid #eae1e0;" />
            </a>
            <br/>
            <a href="${refImage}" target="_blank" style="color: #7a403d; font-size: 12px; text-decoration: underline; margin-top: 4px; display: inline-block;">Open Full Resolution Image ↗</a>
          </div>
        ` : ''}
      </div>

      <div align="center">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://nailxpressng.vercel.app'}/admin/custom-orders" 
           style="display: inline-block; padding: 13px 26px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">
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
      <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0;">Your Order Has Shipped!</h2>
      <p style="color: #555;">Hi ${order.customer_first_name || 'there'}, guess what? Your fresh set just left our studio and is headed straight to you! We've packed everything with care, so get those nails ready to slay.</p>
      
      <!-- 3-STEP TRACKING STEPPER GRAPHIC -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0; background-color: #fcf6f6; border-radius: 12px; border: 1px solid #f5e6e5;">
        <tr>
          <td style="padding: 18px 10px; text-align: center;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" width="33%" style="vertical-align: top;">
                  <div style="width: 36px; height: 36px; line-height: 34px; margin: 0 auto 6px auto; border-radius: 50%; border: 2px solid #7a403d; background-color: #7a403d; color: #ffffff; text-align: center; font-size: 15px; font-weight: bold; font-family: -apple-system, sans-serif;">
                    ✓
                  </div>
                  <div style="font-size: 11px; font-weight: 700; color: #7a403d; text-transform: uppercase; letter-spacing: 0.5px;">Crafted</div>
                </td>
                <td align="center" width="33%" style="vertical-align: top;">
                  <div style="width: 36px; height: 36px; line-height: 34px; margin: 0 auto 6px auto; border-radius: 50%; border: 2px solid #7a403d; background-color: #7a403d; color: #ffffff; text-align: center; font-size: 15px; font-weight: bold; font-family: -apple-system, sans-serif;">
                    ✓
                  </div>
                  <div style="font-size: 11px; font-weight: 700; color: #7a403d; text-transform: uppercase; letter-spacing: 0.5px;">Dispatched</div>
                </td>
                <td align="center" width="33%" style="vertical-align: top;">
                  <div style="width: 36px; height: 36px; line-height: 28px; margin: 0 auto 6px auto; border-radius: 50%; border: 2px dashed #cccccc; background-color: transparent; color: #aaaaaa; text-align: center; font-size: 15px; font-weight: 700; font-family: -apple-system, sans-serif; letter-spacing: 1px;">
                    •••
                  </div>
                  <div style="font-size: 11px; font-weight: 500; color: #aaaaaa; text-transform: uppercase; letter-spacing: 0.5px;">Delivered</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin: 24px 0;">
        <div style="display: inline-block; background-color: #7a403d; color: #ffffff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 12px;">ORDER #${orderNum}</div>
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Delivery Address</p>
        <p style="margin: 0; font-weight: 600; color: #2d2d2d;">
          ${order.shipping_address || ''}<br/>
          ${order.shipping_city || ''}, ${order.shipping_state || ''}
        </p>
      </div>

      <p style="color: #666; font-size: 14px;">If you need any assistance, reply directly to this email or chat with us on WhatsApp.</p>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${fromEmail}>`,
      to: [order.customer_email],
      replyTo: adminDefaultEmail,
      subject: `Your Nailexpress Order #${orderNum} Has Shipped`,
      html: wrapEmailTemplate(`Order Shipped - #${orderNum}`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Order Shipped Email Error:", error);
    return { success: false, error };
  }
}

// 6. Buyer Order Delivered Email
export async function sendOrderDeliveredEmail(order, items = []) {
  try {
    const orderNum = order.id ? order.id.split('-')[0] : '';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng';

    // Determine target link for reviewing product
    let targetLink = `${siteUrl}/shop`;
    let buttonLabel = "Flaunt Your Set in The Journal ↗";

    const firstItem = items && items.length > 0 ? items[0] : null;
    if (firstItem) {
      const slug = firstItem.slug || (firstItem.product_name || firstItem.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (slug) {
        targetLink = `${siteUrl}/product/${slug}?review=open#write-review`;
        buttonLabel = `Review ${firstItem.product_name || firstItem.name || "Your Set"} ↗`;
      }
    }

    const bodyHtml = `
      <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0; margin-bottom: 8px;">Your Order Has Arrived</h2>
      <p style="color: #555; margin-top: 0; margin-bottom: 24px; line-height: 1.6;">Hi ${order.customer_first_name || 'there'}, your order <strong>#${orderNum}</strong> has been delivered. We hope you love your fresh handcrafted set!</p>
      
      <!-- EDITORIAL APPLICATION TIP -->
      <div style="margin: 24px 0; padding: 20px 22px; background-color: #faf5f4; border-radius: 12px;">
        <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #7a403d; letter-spacing: 1.5px; text-transform: uppercase;">Long-Wear Application Tip</p>
        <p style="margin: 0; font-size: 13.5px; color: #4a4a4a; line-height: 1.6;">
          For the longest hold, wipe your natural nails clean with an alcohol prep pad and gently buff the nail surface before applying your adhesive tabs or glue.
        </p>
      </div>

      <!-- JOURNAL & REVIEW CTA -->
      <div style="text-align: center; margin: 32px 0 16px 0; padding: 26px 20px; background-color: #ffffff; border-radius: 12px; border: 1px solid #efe4e3;">
        <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #7a403d; font-size: 19px; font-family: 'Cormorant Garamond', Georgia, serif;">Time to Flaunt Your Set</h3>
        <p style="margin: 0 0 18px 0; font-size: 13px; color: #666; line-height: 1.5;">Drop an entry in The Press-On Journal with a quick photo of your set in real life. No login needed!</p>
        <a href="${targetLink}" 
           style="display: inline-block; padding: 12px 28px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 24px; font-weight: 600; font-size: 13px; letter-spacing: 0.5px;">
          ${buttonLabel}
        </a>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${fromEmail}>`,
      to: [order.customer_email],
      replyTo: adminDefaultEmail,
      subject: `Your Nailexpress Order #${orderNum} Has Been Delivered`,
      html: wrapEmailTemplate(`Order Delivered - #${orderNum}`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Order Delivered Email Error:", error);
    return { success: false, error };
  }
}

// 7. Buyer Order Cancelled Email
export async function sendOrderCancellationEmail(order, reason, nextSteps) {
  try {
    const orderNum = order.id ? order.id.split('-')[0] : '';

    const bodyHtml = `
      <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0;">Update on Your Order #${orderNum}</h2>
      <p style="color: #555; line-height: 1.6;">Hi ${order.customer_first_name || 'there'},</p>
      <p style="color: #555; line-height: 1.6;">We are so sorry, but we have had to cancel your recent order <strong>#${orderNum}</strong>. We know how much you were looking forward to receiving your nail set, and we truly apologize for any inconvenience this may cause you.</p>
      
      <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin: 24px 0;">
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Reason for Cancellation</p>
        <p style="margin: 0 0 16px 0; font-weight: 500; color: #2d2d2d; line-height: 1.5;">
          ${reason || 'Unfortunately, we are unable to fulfill your order at this time.'}
        </p>
        
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Next Steps</p>
        <p style="margin: 0; font-weight: 500; color: #2d2d2d; line-height: 1.5;">
          ${nextSteps || 'Any payments made will be fully refunded to your original payment method. Please allow a few business days for the refund to reflect in your account.'}
        </p>
      </div>

      <p style="color: #555; font-size: 14px; line-height: 1.6;">If you have any questions or concerns, please don't hesitate to reach out. We are here to help and would love the opportunity to make this up to you in the future.</p>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${fromEmail}>`,
      to: [order.customer_email],
      replyTo: adminDefaultEmail,
      subject: `Important Update Regarding Your Nailexpress Order #${orderNum}`,
      html: wrapEmailTemplate(`Order Cancelled - #${orderNum}`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Order Cancelled Email Error:", error);
    return { success: false, error };
  }
}

// 8. Abandoned Checkout Recovery Email
export async function sendAbandonedCheckoutEmail(order, items = []) {
  try {
    const firstName = order.customer_first_name || 'there';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng';
    const checkoutRecoveryUrl = `${siteUrl}/checkout?abandonedId=${order.id || ''}`;
    const whatsappUrl = `${process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/2348123456789'}?text=${encodeURIComponent(`Hi Nailexpress, I started an order for ${items.map(i => i.product_name || i.name).join(', ') || 'my nails'} and had a question before finishing.`)}`;

    const itemsHtml = items.length > 0 ? `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0; background-color: #fdf8f8; border-radius: 10px; border: 1px solid #f2e2e1; padding: 14px;">
        ${items.map(item => {
          const rawImg = item.image || (Array.isArray(item.images) ? item.images[0] : null) || item.image_url;
          const imgUrl = getAbsoluteImageUrl(rawImg);
          return `
          <tr>
            ${imgUrl ? `
              <td width="55" style="padding: 6px 10px 6px 0; vertical-align: middle;">
                <img src="${imgUrl}" width="46" height="46" style="border-radius: 6px; object-fit: cover; border: 1px solid #eae1e0; display: block;" alt="Product" />
              </td>
            ` : ''}
            <td style="padding: 6px 0; font-size: 14px; color: #2d2d2d; font-weight: 600; vertical-align: middle;">
              ${item.quantity || 1}x ${item.product_name || item.name || 'Press-On Nail Set'}
            </td>
            <td align="right" style="padding: 6px 0; font-size: 14px; color: #7a403d; font-weight: 700; vertical-align: middle;">
              ₦${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
            </td>
          </tr>
          `;
        }).join('')}
      </table>
    ` : '';

    const bodyHtml = `
      <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0;">Did something go wrong with your order?</h2>
      <p style="color: #555; font-size: 15px; line-height: 1.6;">
        Hi ${firstName}, we noticed you started checkout for your handcrafted nail set but didn't get to finish.
      </p>
      
      ${itemsHtml}

      <p style="color: #555; font-size: 15px; line-height: 1.6;">
        Was there an issue with payment, sizing, or delivery? We'd love to help make it right for you.
      </p>

      <!-- CALL TO ACTIONS -->
      <div style="text-align: center; margin: 32px 0 24px 0;">
        <a href="${checkoutRecoveryUrl}"
           style="display: inline-block; padding: 14px 32px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 14px rgba(122, 64, 61, 0.25);">
          Complete My Order ↗
        </a>
      </div>

      <div style="text-align: center; margin-bottom: 16px;">
        <a href="${whatsappUrl}" target="_blank" style="color: #7a403d; font-size: 13px; font-weight: 600; text-decoration: underline;">
          💬 Reply directly or Chat with us on WhatsApp
        </a>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${fromEmail}>`,
      to: [order.customer_email],
      replyTo: adminDefaultEmail,
      subject: `Did something go wrong with your order?`,
      html: wrapEmailTemplate(`Complete Your Nailexpress Order`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Abandoned Checkout Email Error:", error);
    return { success: false, error };
  }
}

// 9. Buyer Restock Alert Requested Confirmation
export async function sendRestockRequestConfirmationEmail(email, productName = 'Your Favorite Set', productSlug = null) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng';
    const targetUrl = productSlug ? `${siteUrl}/product/${productSlug}` : `${siteUrl}/shop`;

    const bodyHtml = `
      <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0; margin-bottom: 12px;">We'll let you know when it's back!</h2>
      <p style="color: #555; font-size: 15px; line-height: 1.6;">
        We noted your interest in <strong>${productName}</strong>. Our nail artists are actively crafting new batches, and we'll send you an instant email alert the moment new sets are ready.
      </p>

      <div style="background-color: #faf5f4; border-radius: 12px; padding: 18px 20px; margin: 24px 0;">
        <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #7a403d; letter-spacing: 1.5px; text-transform: uppercase;">Requested Set</p>
        <p style="margin: 0; font-weight: 600; color: #2d2d2d; font-size: 15px;">${productName}</p>
      </div>

      <p style="color: #666; font-size: 14px; line-height: 1.5;">
        In the meantime, feel free to browse our available ready-to-ship handmade and factory collections.
      </p>

      <div style="text-align: center; margin: 28px 0 10px 0;">
        <a href="${targetUrl}"
           style="display: inline-block; padding: 12px 28px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
          Explore Available Sets ↗
        </a>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${fromEmail}>`,
      to: [email],
      replyTo: adminDefaultEmail,
      subject: `Restock Alert Requested: ${productName}`,
      html: wrapEmailTemplate(`Restock Alert Requested`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Restock Request Email Error:", error);
    return { success: false, error };
  }
}

// 10. Buyer Product Drop / Back in Stock Broadcast Alert
export async function sendProductDropAlertEmail(email, productName = 'Popular Set', productSlug = null, customMessage = null) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng';
    const targetUrl = productSlug ? `${siteUrl}/product/${productSlug}` : `${siteUrl}/shop`;

    const bodyHtml = `
      <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin-top: 0; margin-bottom: 12px;">Good news! ${productName} is Back in Stock</h2>
      <p style="color: #555; font-size: 15px; line-height: 1.6;">
        ${customMessage || `You asked to be notified when <strong>${productName}</strong> was restocked. Fresh batches have just been handcrafted in our studio and are available now in limited quantities.`}
      </p>

      <div style="background-color: #faf5f4; border-radius: 12px; padding: 18px 20px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #7a403d; letter-spacing: 1.5px; text-transform: uppercase;">Now Available</p>
        <p style="margin: 0 0 16px 0; font-weight: 700; color: #2d2d2d; font-size: 17px; font-family: 'Cormorant Garamond', Georgia, serif;">${productName}</p>
        <a href="${targetUrl}"
           style="display: inline-block; padding: 13px 30px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(122, 64, 61, 0.2);">
          Shop ${productName} ↗
        </a>
      </div>

      <p style="color: #888; font-size: 12px; text-align: center; margin-top: 16px;">
        Hurry — popular handmade sets sell out quickly due to high demand!
      </p>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress <${fromEmail}>`,
      to: [email],
      replyTo: adminDefaultEmail,
      subject: `Back in Stock: ${productName}`,
      html: wrapEmailTemplate(`Back in Stock - ${productName}`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Product Drop Alert Email Error:", error);
    return { success: false, error };
  }
}

// 11. Admin Restock Demand Lead Alert
export async function sendAdminRestockLeadAlert(subscriberEmail, productName = 'Sold-out set', productSlug = null, adminEmail = null) {
  try {
    const adminTarget = adminEmail || adminDefaultEmail;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nailexpress.ng';

    const bodyHtml = `
      <div style="background-color: #fcf6f6; border-radius: 12px; padding: 20px; border: 1px solid #f5e6e5; margin-bottom: 24px;">
        <h2 style="color: #7a403d; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; margin: 0 0 12px 0;">New Restock Request Lead</h2>
        <p style="margin: 4px 0; font-size: 14px;">A customer has requested to be notified when <strong>${productName}</strong> is restocked.</p>
        
        <div style="background-color: #ffffff; padding: 14px 18px; border-radius: 8px; border: 1px solid #eae1e0; margin: 16px 0;">
          <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Customer Email:</strong> ${subscriberEmail}</p>
          <p style="margin: 0; font-size: 13px;"><strong>Requested Set:</strong> ${productName}</p>
        </div>

        <p style="font-size: 13px; color: #666; margin: 0;">
          You can view all customer demand leads and broadcast instant stock alerts directly in your Admin Dashboard.
        </p>
      </div>

      <div align="center">
        <a href="${siteUrl}/admin/subscribers" 
           style="display: inline-block; padding: 13px 26px; background-color: #7a403d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">
          View Restock Leads in Admin
        </a>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `Nailexpress System <${fromEmail}>`,
      to: [adminTarget],
      subject: `Restock Demand Lead: ${productName} (${subscriberEmail})`,
      html: wrapEmailTemplate(`Restock Lead - ${productName}`, bodyHtml),
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Admin Restock Lead Alert Error:", error);
    return { success: false, error };
  }
}


import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

// Use this for development unless a custom domain is verified
const fromEmail = 'onboarding@resend.dev';

export async function sendOrderConfirmationEmail(order, items) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Nailxpress <${fromEmail}>`,
      to: [order.customer_email],
      replyTo: process.env.ADMIN_EMAIL || 'nailxpressng@gmail.com',
      subject: `Order Confirmation - #${order.id.split('-')[0]}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #d1758f;">Thanks for your order, ${order.customer_first_name}!</h1>
          <p>We've received your order and are getting it ready to ship.</p>
          
          <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px;">Order Details</h3>
          <p><strong>Order Number:</strong> #${order.id.split('-')[0]}</p>
          <p><strong>Shipping Address:</strong><br/>
            ${order.shipping_address}<br/>
            ${order.shipping_city}, ${order.shipping_state}
          </p>
          
          <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Items</h3>
          <ul style="list-style: none; padding: 0;">
            ${items.map(item => `
              <li style="margin-bottom: 8px;">
                ${item.quantity}x <strong>${item.name || item.product_name}</strong> - ₦${(item.price * item.quantity).toLocaleString()}
                <div style="font-size: 12px; color: #666;">Size: ${item.selectedSize || item.selected_size} | Length: ${item.selectedLength || item.selected_length}</div>
              </li>
            `).join('')}
          </ul>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee;">
            <p style="margin: 4px 0;"><strong>Shipping:</strong> ₦${order.shipping_fee.toLocaleString()}</p>
            <p style="margin: 4px 0; font-size: 1.1em;"><strong>Total Paid:</strong> ₦${order.total_amount.toLocaleString()}</p>
          </div>
          
          <p style="margin-top: 32px; font-size: 0.9em; color: #666; text-align: center;">
            If you have any questions about your order, reply to this email or contact us on WhatsApp.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error };
  }
}

export async function sendAdminNewOrderAlert(order, items = [], adminEmail) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Nailxpress System <${fromEmail}>`,
      to: [adminEmail],
      subject: `New Order #${order.id.split('-')[0]} Received - ₦${order.total_amount.toLocaleString()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #d1758f;">You have a new order! 🎉</h2>
          <p><strong>Customer:</strong> ${order.customer_first_name} ${order.customer_last_name} (${order.customer_email})</p>
          <p><strong>Phone:</strong> ${order.customer_phone || 'N/A'}</p>
          <p><strong>Delivery Address:</strong> ${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state}</p>
          
          <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 20px;">Ordered Items</h3>
          <ul style="list-style: none; padding: 0;">
            ${items.map(item => `
              <li style="margin-bottom: 8px;">
                ${item.quantity}x <strong>${item.name || item.product_name}</strong> - ₦${(item.price * item.quantity).toLocaleString()}
                <div style="font-size: 12px; color: #666;">Size: ${item.selectedSize || item.selected_size} | Length: ${item.selectedLength || item.selected_length}</div>
              </li>
            `).join('')}
          </ul>
          
          <p style="font-size: 1.1em; font-weight: bold; margin-top: 16px;">Total Amount: ₦${order.total_amount.toLocaleString()}</p>
          
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders" 
             style="display: inline-block; padding: 12px 24px; background: #d1758f; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px; font-weight: bold;">
            View Order in Dashboard
          </a>
        </div>
      `,
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Admin Email Error:", error);
    return { success: false, error };
  }
}

export async function sendCustomOrderConfirmationEmail(customOrder) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Nailxpress <${fromEmail}>`,
      to: [customOrder.email],
      replyTo: process.env.ADMIN_EMAIL || 'nailxpressng@gmail.com',
      subject: `Custom Nail Set Request Received! 💅`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #d1758f;">Hi ${customOrder.name},</h2>
          <p>We received your request for a custom press-on nail set! Our team is reviewing your specifications and will contact you shortly.</p>
          
          <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px;">Request Summary</h3>
          <p><strong>Shape:</strong> ${customOrder.shape}</p>
          <p><strong>Length:</strong> ${customOrder.length}</p>
          <p><strong>Design:</strong> ${customOrder.design}</p>
          ${customOrder.color ? `<p><strong>Color Preference:</strong> ${customOrder.color}</p>` : ''}
          ${customOrder.notes ? `<p><strong>Notes:</strong> ${customOrder.notes}</p>` : ''}
          
          <p style="margin-top: 24px; font-size: 0.9em; color: #666;">
            We'll reach out via email or WhatsApp to finalize your design and quote!
          </p>
        </div>
      `,
    });
    return { success: !error, error };
  } catch (error) {
    console.error("Custom Order Buyer Email Error:", error);
    return { success: false, error };
  }
}

export async function sendAdminCustomOrderAlert(customOrder, adminEmail) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Nailxpress System <${fromEmail}>`,
      to: [adminEmail],
      subject: `New Custom Nail Request from ${customOrder.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Custom Set Request! 💅</h2>
          <p><strong>Customer:</strong> ${customOrder.name} (${customOrder.email})</p>
          <p><strong>Phone:</strong> ${customOrder.phone || 'N/A'}</p>
          <p><strong>Shape:</strong> ${customOrder.shape}</p>
          <p><strong>Length:</strong> ${customOrder.length}</p>
          <p><strong>Design:</strong> ${customOrder.design}</p>
          <p><strong>Color:</strong> ${customOrder.color || 'N/A'}</p>
          <p><strong>Notes:</strong> ${customOrder.notes || 'None'}</p>
          
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders" 
             style="display: inline-block; padding: 10px 20px; background: #d1758f; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
            Check Admin Dashboard
          </a>
        </div>
      `,
    });
    return { success: !error, error };
  } catch (error) {
    console.error("Admin Custom Order Alert Error:", error);
    return { success: false, error };
  }
}


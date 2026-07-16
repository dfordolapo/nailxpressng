import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Use this for development unless a custom domain is verified
const fromEmail = 'onboarding@resend.dev';

export async function sendOrderConfirmationEmail(order, items) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Nailxpress <${fromEmail}>`,
      to: [order.customer_email],
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

export async function sendAdminNewOrderAlert(order, adminEmail) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Nailxpress System <${fromEmail}>`,
      to: [adminEmail],
      subject: `New Order Received - ₦${order.total_amount.toLocaleString()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You have a new order! 🎉</h2>
          <p><strong>Customer:</strong> ${order.customer_first_name} ${order.customer_last_name}</p>
          <p><strong>Total:</strong> ₦${order.total_amount.toLocaleString()}</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders" 
             style="display: inline-block; padding: 10px 20px; background: #d1758f; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
            View in Dashboard
          </a>
        </div>
      `,
    });

    return { success: !error, error };
  } catch (error) {
    return { success: false, error };
  }
}

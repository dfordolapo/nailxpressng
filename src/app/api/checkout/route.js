import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmationEmail, sendAdminNewOrderAlert } from '@/lib/email';

// Initialize a Supabase client with the SERVICE ROLE KEY
// This bypasses RLS and allows us to insert orders securely from the server
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // fallback to anon if service role isn't set yet (for dev)
);

export async function POST(request) {
  try {
    const { formData, items, shippingMethod, shippingMethodName, deliveryTime, paymentMethod, subtotal, shippingFee, total } = body;

    // 1. Insert the main Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          customer_email: formData.email,
          customer_first_name: formData.firstName,
          customer_last_name: formData.lastName,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_state: formData.state,
          total_amount: total,
          shipping_fee: shippingFee,
          shipping_method: shippingMethodName || shippingMethod,
          delivery_time: deliveryTime || '3-5 days',
          status: 'pending' // Default status
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Helper to check if a string is a valid UUID
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str));
    
    // Get valid product IDs to prevent foreign key constraint errors
    const itemIds = items.map(item => item.id).filter(isUUID);
    let validProductIds = new Set();
    
    if (itemIds.length > 0) {
      const { data: validProducts } = await supabaseAdmin
        .from('products')
        .select('id')
        .in('id', itemIds);
        
      if (validProducts) {
        validProductIds = new Set(validProducts.map(p => p.id));
      }
    }

    // 2. Format Order Items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: validProductIds.has(item.id) ? item.id : null, // Mock products will be null to prevent FK errors
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      selected_size: item.selectedSize || 'M',
      selected_length: item.selectedLength || 'medium'
    }));

    // 3. Insert Order Items
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order Items Insert Error:', itemsError);
      throw itemsError;
    }

    // 4. Send Confirmation Emails (Non-blocking)
    // Send to customer (buyer)
    if (order.customer_email) {
      sendOrderConfirmationEmail(order, items).catch(e => console.error("Customer email failed:", e));
    }
    
    // Send to admin (nailxpressng@gmail.com)
    const adminEmail = process.env.ADMIN_EMAIL || 'nailxpressng@gmail.com';
    sendAdminNewOrderAlert(order, items, adminEmail).catch(e => console.error("Admin email failed:", e));

    return NextResponse.json({ success: true, orderId: order.id });
    
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

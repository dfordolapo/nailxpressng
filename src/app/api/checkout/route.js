import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize a Supabase client with the SERVICE ROLE KEY
// This bypasses RLS and allows us to insert orders securely from the server
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // fallback to anon if service role isn't set yet (for dev)
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { formData, items, shippingMethod, paymentMethod, subtotal, shippingFee, total } = body;

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
          status: 'pending' // Default status
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Helper to check if a string is a valid UUID
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str));

    // 2. Format Order Items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: isUUID(item.id) ? item.id : null, // Mock products will be null to prevent UUID cast errors
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

    return NextResponse.json({ success: true, orderId: order.id });
    
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

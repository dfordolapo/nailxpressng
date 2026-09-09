import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendCustomOrderConfirmationEmail, sendAdminCustomOrderAlert } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const order = await request.json();

    const { error } = await supabaseAdmin
      .from('custom_orders')
      .insert([
        {
          customer_name: order.name,
          customer_email: order.email,
          customer_phone: order.phone || null,
          shape: order.shape,
          length: order.length,
          design: order.design,
          color_preference: order.color || null,
          notes: order.notes || null,
          status: 'pending'
        }
      ]);

    if (error) throw error;

    // Send emails (Non-blocking)
    if (order.email) {
      sendCustomOrderConfirmationEmail(order).catch(e => console.error("Custom Order buyer email failed:", e));
    }
    
    const adminEmail = process.env.ADMIN_EMAIL || 'dfordolapo@gmail.com';
    sendAdminCustomOrderAlert(order, adminEmail).catch(e => console.error("Custom Order admin alert failed:", e));

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Custom Order API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

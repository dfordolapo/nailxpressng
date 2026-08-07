import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOrderShippedEmail, sendOrderDeliveredEmail } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;

    const updatedOrder = data && data[0] ? data[0] : null;

    if (updatedOrder && updatedOrder.customer_email) {
      if (status === 'shipped') {
        sendOrderShippedEmail(updatedOrder).catch(e => console.error("Shipped email error:", e));
      } else if (status === 'delivered') {
        sendOrderDeliveredEmail(updatedOrder).catch(e => console.error("Delivered email error:", e));
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Update Order API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOrderShippedEmail, sendOrderDeliveredEmail, sendOrderCancellationEmail } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, reason, nextSteps } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    const updatePayload = { status };
    if (status === 'cancelled') {
      if (reason) updatePayload.cancellation_reason = reason;
      if (nextSteps) updatePayload.cancellation_next_steps = nextSteps;
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select();

    if (error) throw error;

    const updatedOrder = data && data[0] ? data[0] : null;

    if (updatedOrder && updatedOrder.customer_email) {
      try {
        if (status === 'shipped') {
          await sendOrderShippedEmail(updatedOrder);
        } else if (status === 'delivered') {
          const { data: orderItems } = await supabaseAdmin
            .from('order_items')
            .select('*, products(slug)')
            .eq('order_id', id);
          
          const formattedItems = (orderItems || []).map(item => ({
            ...item,
            slug: item.products?.slug || null
          }));
          await sendOrderDeliveredEmail(updatedOrder, formattedItems);
        } else if (status === 'cancelled') {
          await sendOrderCancellationEmail(updatedOrder, reason, nextSteps);
        }
      } catch (emailErr) {
        console.error("Order status update email sending error:", emailErr);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Update Order API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


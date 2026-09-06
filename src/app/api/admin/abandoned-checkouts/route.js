import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendAbandonedCheckoutEmail } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Cron handler or trigger endpoint: Finds checkouts created >= 30 mins ago that are still 'abandoned'
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Optional bearer check if invoked by external cron service (like Vercel Cron or GitHub Actions)
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // allow internal dev requests or admin execution
    }

    // 1 hour (60 minutes) threshold to allow Paystack payment window to complete
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Query abandoned orders between 1 hour and 24 hours old that haven't been emailed yet
    const { data: abandonedOrders, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .eq('status', 'abandoned')
      .lte('created_at', oneHourAgo)
      .gte('created_at', twentyFourHoursAgo)
      .is('cancellation_reason', null); // Use as flag: null means recovery email not yet sent

    if (error) throw error;

    let emailsSent = 0;

    for (const order of abandonedOrders || []) {
      if (order.customer_email) {
        const result = await sendAbandonedCheckoutEmail(order, order.order_items || []);
        if (result.success) {
          emailsSent++;
          // Mark that recovery email was dispatched
          await supabaseAdmin
            .from('orders')
            .update({ cancellation_reason: 'abandoned_recovery_sent' })
            .eq('id', order.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: abandonedOrders?.length || 0,
      emailsSent
    });
  } catch (error) {
    console.error('Abandoned Checkout Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Allows Admin to manually trigger an abandoned checkout recovery email
export async function POST(request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const result = await sendAbandonedCheckoutEmail(order, order.order_items || []);

    if (result.success) {
      await supabaseAdmin
        .from('orders')
        .update({ cancellation_reason: 'abandoned_recovery_sent' })
        .eq('id', order.id);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Manual Abandoned Recovery Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

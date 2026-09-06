import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmationEmail, sendAdminNewOrderAlert } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const secret = process.env.PAYSTACK_SECRET_KEY;

    // 1. Verify Paystack HMAC SHA512 Signature
    if (secret) {
      const hash = crypto
        .createHmac('sha512', secret)
        .update(rawBody)
        .digest('hex');

      const signature = request.headers.get('x-paystack-signature');

      if (hash !== signature) {
        console.warn('Invalid Paystack webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);

    // 2. Handle 'charge.success'
    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const amountPaid = data.amount / 100; // in NGN
      const customerEmail = data.customer?.email;

      console.log(`[Paystack Webhook] Processing successful charge for ref: ${reference}`);

      // Check if order exists with this payment reference
      const { data: existingOrder, error: fetchErr } = await supabaseAdmin
        .from('orders')
        .select('*, order_items(*)')
        .eq('payment_reference', reference)
        .maybeSingle();

      if (existingOrder) {
        // If order was already recorded as pending, mark as processing/paid
        if (existingOrder.status === 'pending') {
          await supabaseAdmin
            .from('orders')
            .update({ status: 'processing' })
            .eq('id', existingOrder.id);
        }
        console.log(`[Paystack Webhook] Order ${existingOrder.id} verified.`);
      } else {
        console.log(`[Paystack Webhook] No matching order found yet for reference ${reference}.`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

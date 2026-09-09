import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendProductDropAlertEmail } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET: Fetch all subscribers for Admin dashboard
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ subscribers: data || [] });
  } catch (error) {
    console.error('Fetch Subscribers Error:', error);
    return NextResponse.json({ subscribers: [] }, { status: 500 });
  }
}

// POST: Trigger Broadcast or Restock Alert Email to specific subscribers
export async function POST(request) {
  try {
    const { subscriberIds, productName, productSlug, message } = await request.json();

    if (!subscriberIds || subscriberIds.length === 0) {
      return NextResponse.json({ error: 'No subscribers selected' }, { status: 400 });
    }

    const { data: subs, error } = await supabaseAdmin
      .from('subscribers')
      .select('id, email, product_name')
      .in('id', subscriberIds);

    if (error || !subs) throw error;

    // Send restock alert to all selected emails
    for (const sub of subs) {
      const targetName = productName || sub.product_name || 'Your Requested Set';
      await sendProductDropAlertEmail(sub.email, targetName, productSlug, message);
    }

    return NextResponse.json({ success: true, count: subs.length });
  } catch (error) {
    console.error('Notify Subscribers Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

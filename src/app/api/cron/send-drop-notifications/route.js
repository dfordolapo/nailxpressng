import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendDropGoLiveEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key"
);

async function handleDropNotifications(request) {
  try {
    // Optional CRON_SECRET auth for production protection
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Also allow if called with internal secret or from admin
      const url = new URL(request.url);
      const keyParam = url.searchParams.get('key');
      if (keyParam !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const now = new Date().toISOString();

    // 1. Find all collections where:
    // - Drop timer is enabled
    // - Drop date has arrived or passed (drop_date <= now)
    // - Notification has not already been sent
    const { data: activeDrops, error: dropErr } = await supabaseAdmin
      .from('categories')
      .select('id, name, slug, image, tagline, description, drop_date, drop_headline, drop_notification_sent')
      .eq('drop_timer_enabled', true)
      .lte('drop_date', now);

    if (dropErr) {
      console.error("Error querying drops for notification:", dropErr);
      return NextResponse.json({ error: dropErr.message }, { status: 500 });
    }

    const dueDrops = (activeDrops || []).filter(d => !d.drop_notification_sent);

    if (dueDrops.length === 0) {
      return NextResponse.json({
        message: 'No pending drop go-live notifications to send.',
        checkedAt: now,
        count: 0
      });
    }

    let totalEmailsSent = 0;
    const results = [];

    for (const drop of dueDrops) {
      // 2. Fetch subscribers waiting for this collection
      // Check both collection_id match and collection_name match for flexibility
      let query = supabaseAdmin
        .from('subscribers')
        .select('id, email, collection_id, collection_name')
        .eq('subscription_type', 'drop_notification');

      if (drop.id) {
        query = query.or(`collection_id.eq.${drop.id},collection_name.eq.${drop.name}`);
      } else {
        query = query.eq('collection_name', drop.name);
      }

      const { data: subscribers, error: subErr } = await query;

      if (subErr) {
        console.warn(`Could not fetch subscribers for ${drop.name}:`, subErr.message);
        continue;
      }

      const uniqueEmails = Array.from(new Set(
        (subscribers || []).map(s => s.email?.trim().toLowerCase()).filter(Boolean)
      ));

      let sentForThisDrop = 0;

      // 3. Dispatch the luxury go-live email to each waitlist subscriber
      for (const toEmail of uniqueEmails) {
        try {
          const res = await sendDropGoLiveEmail({
            toEmail,
            collectionName: drop.name,
            collectionSlug: drop.slug,
            collectionImage: drop.image,
            dropHeadline: drop.drop_headline || drop.name,
            dropDescription: drop.tagline || drop.description,
          });
          if (res?.success) sentForThisDrop++;
        } catch (emailErr) {
          console.error(`Failed to email ${toEmail} for drop ${drop.name}:`, emailErr);
        }
      }

      totalEmailsSent += sentForThisDrop;

      // 4. Mark collection as notified so we never double-send
      try {
        await supabaseAdmin
          .from('categories')
          .update({
            drop_notification_sent: true,
            drop_notification_sent_at: new Date().toISOString()
          })
          .eq('id', drop.id);
      } catch (updateErr) {
        console.error(`Failed to update drop_notification_sent for ${drop.id}:`, updateErr);
      }

      results.push({
        collection: drop.name,
        subscribersFound: uniqueEmails.length,
        emailsSent: sentForThisDrop,
      });
    }

    return NextResponse.json({
      success: true,
      processedDrops: dueDrops.length,
      totalEmailsSent,
      details: results,
    });
  } catch (err) {
    console.error("send-drop-notifications handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  return handleDropNotifications(request);
}

export async function POST(request) {
  return handleDropNotifications(request);
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function PUT(request) {
  try {
    const { shipping_standard, shipping_express, delivery_locations, delivery_presets, sitewide_discount } = await request.json();

    const { data, error } = await supabaseAdmin
      .from('store_settings')
      .update({
        shipping_standard: parseFloat(shipping_standard || 0),
        shipping_express: parseFloat(shipping_express || 0),
        delivery_locations: delivery_locations || [],
        delivery_presets: delivery_presets || null,
        sitewide_discount: parseFloat(sitewide_discount ?? 0),
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      console.error('Error updating settings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

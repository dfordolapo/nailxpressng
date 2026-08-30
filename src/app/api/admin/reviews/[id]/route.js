import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// PATCH: Update review (approve, verify, edit text, rating, name, etc.)
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      status, 
      verified_buyer, 
      customer_name, 
      customer_location, 
      rating, 
      review_text,
      product_id 
    } = body;

    const updatePayload = {};
    if (status !== undefined) updatePayload.status = status;
    if (verified_buyer !== undefined) updatePayload.verified_buyer = Boolean(verified_buyer);
    if (customer_name !== undefined) updatePayload.customer_name = customer_name;
    if (customer_location !== undefined) updatePayload.customer_location = customer_location;
    if (rating !== undefined) updatePayload.rating = Math.min(Math.max(Number(rating) || 5, 1), 5);
    if (review_text !== undefined) updatePayload.review_text = review_text;
    if (product_id !== undefined) updatePayload.product_id = product_id || null;

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update(updatePayload)
      .eq('id', id)
      .select('*, products(name, slug, images)')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, review: data });
  } catch (error) {
    console.error('Admin Review PATCH Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Permanently delete a review
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Review DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

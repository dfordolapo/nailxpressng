import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// PATCH: Update review status (approve, hide, etc.)
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, verified_buyer } = body;

    const updatePayload = {};
    if (status !== undefined) updatePayload.status = status;
    if (verified_buyer !== undefined) updatePayload.verified_buyer = verified_buyer;

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update(updatePayload)
      .eq('id', id)
      .select()
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

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// GET: Fetch all reviews for admin dashboard
export async function GET() {
  try {
    const { data: reviews, error } = await supabaseAdmin
      .from('reviews')
      .select('*, products(name, slug, images)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ reviews: reviews || [] });
  } catch (error) {
    console.error('Admin Reviews GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

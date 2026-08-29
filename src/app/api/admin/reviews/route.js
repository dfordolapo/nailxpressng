import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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

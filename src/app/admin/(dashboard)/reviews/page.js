import { createClient } from '@supabase/supabase-js';
import ReviewsClient from './ReviewsClient';
import { FALLBACK_REVIEWS } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Customer Reviews | Admin Dashboard',
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key"
);

export default async function ReviewsPage() {
  const { data: reviews, error } = await supabaseAdmin
    .from('reviews')
    .select('*, products(name, slug, images)')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase reviews fetch failed, using fallback for local dev');
  }

  const list = reviews && reviews.length > 0 ? reviews : FALLBACK_REVIEWS;

  return <ReviewsClient initialReviews={list} />;
}

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import ReviewsClient from './ReviewsClient';
import { FALLBACK_REVIEWS } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Customer Reviews | Admin Dashboard',
};

export default async function ReviewsPage() {
  const { data: reviews, error } = await supabaseAdmin
    .from('reviews')
    .select('*, products(name, slug, images)')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.warn('Supabase reviews fetch failed, using fallback for local dev');
  }

  const list = reviews && reviews.length > 0 ? reviews : FALLBACK_REVIEWS;

  return <ReviewsClient initialReviews={list} />;
}

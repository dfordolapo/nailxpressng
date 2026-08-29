import { createClient } from '@supabase/supabase-js';
import ReviewsClient from './ReviewsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Customer Reviews | Admin Dashboard',
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function ReviewsPage() {
  const { data: reviews, error } = await supabaseAdmin
    .from('reviews')
    .select('*, products(name, slug, images)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin reviews:', error);
  }

  return <ReviewsClient initialReviews={reviews || []} />;
}

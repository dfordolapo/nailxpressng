import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET: Fetch reviews for a specific product
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const slug = searchParams.get('slug');

    let query = supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    } else if (slug) {
      // Find product by slug first
      const { data: product } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (product) {
        query = query.eq('product_id', product.id);
      } else {
        return NextResponse.json({ reviews: [], stats: { total: 0, average: 5, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }, photos: [] });
      }
    }

    const { data: reviews, error } = await query;
    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('schema cache')) {
        return NextResponse.json({
          reviews: [],
          stats: { total: 0, average: 5.0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
          photos: [],
        });
      }
      throw error;
    }

    const list = reviews || [];
    const total = list.length;
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let ratingSum = 0;
    const allPhotos = [];

    list.forEach((rev) => {
      const r = Math.min(Math.max(rev.rating || 5, 1), 5);
      breakdown[r] = (breakdown[r] || 0) + 1;
      ratingSum += r;
      if (Array.isArray(rev.photo_urls)) {
        rev.photo_urls.forEach((url) => {
          if (url) {
            allPhotos.push({
              url,
              reviewer: rev.customer_name,
              rating: rev.rating,
              reviewText: rev.review_text,
              date: rev.created_at,
            });
          }
        });
      }
    });

    const average = total > 0 ? (ratingSum / total).toFixed(1) : '5.0';

    return NextResponse.json({
      reviews: list,
      stats: {
        total,
        average: parseFloat(average),
        breakdown,
      },
      photos: allPhotos,
    });
  } catch (error) {
    console.error('Fetch Reviews Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST: Submit a new review with photos (Zero login required)
export async function POST(request) {
  try {
    const formData = await request.formData();

    const productId = formData.get('productId');
    const customerName = formData.get('customerName')?.trim();
    const customerLocation = formData.get('customerLocation')?.trim() || null;
    const rating = parseInt(formData.get('rating') || '5', 10);
    const reviewText = formData.get('reviewText')?.trim();
    const verifiedBuyer = formData.get('verifiedBuyer') === 'true';

    if (!customerName) {
      return NextResponse.json({ error: 'Please enter your name or nickname' }, { status: 400 });
    }
    if (!reviewText) {
      return NextResponse.json({ error: 'Please share your thoughts on the set' }, { status: 400 });
    }

    // Process file uploads
    const photoUrls = [];
    const files = formData.getAll('photos');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && typeof file === 'object' && file.size > 0) {
        try {
          const ext = file.name ? file.name.split('.').pop() : 'jpg';
          const cleanName = (customerName || 'review').toLowerCase().replace(/[^a-z0-9]/g, '');
          const fileName = `review-${cleanName}-${Date.now()}-${i}.${ext}`;

          const buffer = await file.arrayBuffer();

          const { error: uploadError } = await supabaseAdmin.storage
            .from('review-images')
            .upload(fileName, buffer, {
              contentType: file.type || 'image/jpeg',
              upsert: false,
            });

          if (uploadError) {
            // Bucket might need to be created if not exists yet
            if (uploadError.message?.includes('bucket') || uploadError.error === 'Bucket not found') {
              await supabaseAdmin.storage.createBucket('review-images', { public: true });
              // Retry once
              await supabaseAdmin.storage
                .from('review-images')
                .upload(fileName, buffer, {
                  contentType: file.type || 'image/jpeg',
                  upsert: true,
                });
            } else {
              console.error('Review image upload warning:', uploadError);
            }
          }

          const { data: publicUrlData } = supabaseAdmin.storage
            .from('review-images')
            .getPublicUrl(fileName);

          if (publicUrlData?.publicUrl) {
            photoUrls.push(publicUrlData.publicUrl);
          }
        } catch (imgErr) {
          console.error('Image processing error:', imgErr);
        }
      }
    }

    // Insert into database
    const { data: newReview, error: insertError } = await supabaseAdmin
      .from('reviews')
      .insert([
        {
          product_id: productId || null,
          customer_name: customerName,
          customer_location: customerLocation,
          rating: Math.min(Math.max(rating, 1), 5),
          review_text: reviewText,
          photo_urls: photoUrls,
          verified_buyer: verifiedBuyer,
          status: 'approved', // Auto-approved for instant satisfaction, admin can moderate
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Review DB Insert Error:', insertError);
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: "Chef's kiss! Your review is live in the journal.",
      review: newReview,
    });
  } catch (error) {
    console.error('Submit Review API Error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong while saving your review' }, { status: 500 });
  }
}

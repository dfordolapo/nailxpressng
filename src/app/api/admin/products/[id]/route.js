import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const compareAtPrice = formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice')) : null;
    const category = formData.get('category');
    const stockCount = parseInt(formData.get('stockCount') || '0', 10);
    const featured = formData.get('featured') === 'true';
    const imageFile = formData.get('image');
    const videoFile = formData.get('video');
    const tags = formData.get('tags');
    const length = formData.get('length');
    const color = formData.get('color');

    // 1. Get Category ID
    let categoryId = null;
    if (category) {
      const { data: categoryData } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', category.toLowerCase().replace(/\s+/g, '-'))
        .maybeSingle();
      
      if (categoryData) categoryId = categoryData.id;
    }

    // Generate a safe slug base for new files
    const slugBase = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Fetch existing product to check for old media
    const { data: existingProduct, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('images, video_url, slug')
      .eq('id', id)
      .single();
    if (fetchError) throw fetchError;

    // We shouldn't change the slug if the name changes to avoid breaking existing URLs, 
    // or maybe we should? For this MVP we'll just update it, or keep it. Let's update it but handle duplicates.
    const slug = slugBase; 

    // Handle Image
    let imageUrls = existingProduct.images || [];
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${slugBase}-${Date.now()}.${fileExt}`;
      const buffer = await imageFile.arrayBuffer();

      const { error: uploadError } = await supabaseAdmin.storage
        .from('product-images')
        .upload(fileName, buffer, { contentType: imageFile.type, upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabaseAdmin.storage.from('product-images').getPublicUrl(fileName);
      
      // Delete old images if replaced
      if (imageUrls.length > 0) {
        for (const oldUrl of imageUrls) {
          try {
            const oldFileName = oldUrl.split('/').pop();
            await supabaseAdmin.storage.from('product-images').remove([oldFileName]);
          } catch (e) {
            console.error("Failed to delete old image:", e);
          }
        }
      }
      imageUrls = [publicUrlData.publicUrl];
    }

    // Handle Video
    let videoUrl = existingProduct.video_url;
    if (videoFile && videoFile.size > 0) {
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `video-${slugBase}-${Date.now()}.${fileExt}`;
      const buffer = await videoFile.arrayBuffer();

      const { error: uploadError } = await supabaseAdmin.storage
        .from('product-images')
        .upload(fileName, buffer, { contentType: videoFile.type, upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabaseAdmin.storage.from('product-images').getPublicUrl(fileName);
      
      // Delete old video if replaced
      if (videoUrl) {
        try {
          const oldFileName = videoUrl.split('/').pop();
          await supabaseAdmin.storage.from('product-images').remove([oldFileName]);
        } catch (e) {
          console.error("Failed to delete old video:", e);
        }
      }
      videoUrl = publicUrlData.publicUrl;
    }

    const productData = {
      name,
      slug,
      description: description || '',
      price,
      compare_at_price: compareAtPrice,
      category_id: categoryId,
      style: tags || 'Solid',
      color: color || null,
      images: imageUrls,
      bestseller: featured,
      stock_count: stockCount,
      lengths: length ? [length] : [],
      video_url: videoUrl,
    };

    const { data: product, error: updateError } = await supabaseAdmin
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      // If slug conflict, fallback to original slug
      if (updateError.code === '23505') {
        productData.slug = existingProduct.slug;
        const retry = await supabaseAdmin.from('products').update(productData).eq('id', id).select().single();
        if (retry.error) throw retry.error;
        return NextResponse.json({ success: true, product: retry.data });
      }
      throw updateError;
    }

    return NextResponse.json({ success: true, product });

  } catch (error) {
    console.error('Update Product API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Product API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

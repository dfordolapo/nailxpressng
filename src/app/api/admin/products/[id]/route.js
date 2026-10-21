import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key"
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

    // 1. Get Category ID directly from user selection
    let categoryId = null;
    const { data: allCategories } = await supabaseAdmin
      .from('categories')
      .select('id, name, slug');

    let targetSlug = 'handmade';
    if (category) {
      const catTrim = String(category).trim();
      const catLower = catTrim.toLowerCase();
      if (allCategories && allCategories.length > 0) {
        const found = allCategories.find(c => 
          c.id === catTrim || 
          c.slug.toLowerCase() === catLower || 
          c.name.toLowerCase() === catLower
        );
        if (found) {
          targetSlug = found.slug;
          categoryId = found.id;
        }
      }
      if (!categoryId) {
        if (catLower.includes('factory')) targetSlug = 'factory';
        else if (catLower.includes('handmade')) targetSlug = 'handmade';
        else targetSlug = catLower;
      }
    }

    if (!categoryId && allCategories && allCategories.length > 0) {
      const match = allCategories.find(c => c.slug.toLowerCase() === targetSlug);
      categoryId = match ? match.id : allCategories[0].id;
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

    const rawSizes = formData.get('sizes');
    let sizesArray = [];
    if (rawSizes) {
      try {
        const parsed = JSON.parse(rawSizes);
        if (Array.isArray(parsed)) sizesArray = parsed.map(s => String(s).trim()).filter(Boolean);
        else sizesArray = String(rawSizes).split(',').map(s => s.trim()).filter(Boolean);
      } catch {
        sizesArray = String(rawSizes).split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const isFactory = targetSlug === 'factory';
    const isHalloween = targetSlug === 'halloween' || (name && name.toLowerCase().includes('halloween'));
    if (isFactory) {
      sizesArray = [];
    } else if (sizesArray.length === 0) {
      if (isHalloween) {
        sizesArray = ['S', 'M', 'L'];
      } else {
        sizesArray = Array.isArray(existingProduct.sizes) ? existingProduct.sizes : [];
      }
    }

    const productData = {
      name,
      slug,
      description: description || '',
      price,
      compare_at_price: compareAtPrice,
      category_id: categoryId,
      nail_shape: formData.get('shape') || existingProduct.nail_shape || 'Square',
      style: tags || 'Solid',
      color: color && color.trim() ? color.trim() : null,
      images: imageUrls,
      bestseller: featured,
      stock_count: stockCount,
      lengths: length ? [length] : [],
      sizes: sizesArray,
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

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateData = {};

    if (typeof body.stock_count !== 'undefined') {
      updateData.stock_count = body.stock_count;
    }
    if (typeof body.bestseller !== 'undefined') {
      updateData.bestseller = body.bestseller;
    }
    if (typeof body.sizes !== 'undefined') {
      let parsedSizes = [];
      if (Array.isArray(body.sizes)) {
        parsedSizes = body.sizes.map(s => String(s).trim()).filter(Boolean);
      } else if (typeof body.sizes === 'string') {
        try {
          const j = JSON.parse(body.sizes);
          if (Array.isArray(j)) parsedSizes = j.map(s => String(s).trim()).filter(Boolean);
          else parsedSizes = body.sizes.split(',').map(s => s.trim()).filter(Boolean);
        } catch {
          parsedSizes = body.sizes.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      updateData.sizes = parsedSizes;
    }
    if (typeof body.lengths !== 'undefined') {
      updateData.lengths = Array.isArray(body.lengths) ? body.lengths : [body.lengths];
    }
    if (body.category_id) {
      updateData.category_id = body.category_id;
    } else if (body.category || body.collection) {
      const catVal = String(body.category || body.collection).trim();
      const catLower = catVal.toLowerCase();

      const { data: allCategories } = await supabaseAdmin
        .from('categories')
        .select('id, name, slug');

      const found = allCategories?.find(c => 
        c.id === catVal || 
        c.slug.toLowerCase() === catLower || 
        c.name.toLowerCase() === catLower
      );

      if (found) {
        updateData.category_id = found.id;
      }
    }

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select('*, categories(id, name, slug)')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Patch Product API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // 1. Remove references in reviews to prevent foreign key errors if cascade isn't set in DB
    try {
      await supabaseAdmin.from('reviews').delete().eq('product_id', id);
    } catch (err) {
      console.warn('Could not clean up reviews:', err);
    }

    // 2. Set product_id to null or delete dependent order_items if needed
    try {
      await supabaseAdmin.from('order_items').update({ product_id: null }).eq('product_id', id);
    } catch (err) {
      console.warn('Could not nullify order_items product_id:', err);
    }

    // 3. Delete the product
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

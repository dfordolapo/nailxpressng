import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const compareAtPrice = formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice')) : null;
    const category = formData.get('category');
    const stockCount = parseInt(formData.get('stockCount') || '0', 10);
    const featured = formData.get('featured') === 'true';
    const imageFile = formData.get('image');
    const tags = formData.get('tags');
    
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

    // 2. Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // 3. Upload Image if provided
    let imageUrls = [];
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${slug}-${Date.now()}.${fileExt}`;
      
      const buffer = await imageFile.arrayBuffer();

      const { error: uploadError } = await supabaseAdmin.storage
        .from('product-images')
        .upload(fileName, buffer, {
          contentType: imageFile.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(fileName);
        
      imageUrls.push(publicUrlData.publicUrl);
    }

    // 4. Insert Product
    const length = formData.get('length');
    const lengthsArray = length ? [length] : [];

    const productData = {
      name,
      slug,
      description: description || '',
      price,
      compare_at_price: compareAtPrice,
      category_id: categoryId,
      nail_shape: 'Square',
      style: tags || 'Solid',
      images: imageUrls,
      bestseller: featured,
      stock_count: stockCount,
      lengths: lengthsArray,
    };

    const { data: product, error: insertError } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (insertError) {
      // If it fails because slug is not unique, we can catch it, but throwing for now
      throw insertError;
    }

    return NextResponse.json({ success: true, product });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

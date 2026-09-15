import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const mode = formData.get('mode'); // 'images_only' | 'json'

    // Fetch categories for mapping
    const { data: categories, error: catError } = await supabaseAdmin
      .from('categories')
      .select('id, name, slug');

    if (catError) throw catError;

    const factoryCategoryId = categories?.find(c => c.slug === 'factory')?.id || null;
    const handmadeCategoryId = categories?.find(c => c.slug === 'handmade')?.id || null;
    const defaultCategory = handmadeCategoryId || categories?.[0]?.id || null;

    if (mode === 'images_only') {
      const imageFiles = formData.getAll('images');
      const defaultCategoryName = (formData.get('defaultCategory') || '').toLowerCase().trim();
      const defaultPrice = parseFloat(formData.get('defaultPrice') || '12000');
      const defaultStock = parseInt(formData.get('defaultStock') || '10', 10);
      const defaultShape = formData.get('defaultShape') || 'Square';

      // 1. If user tagged explicit collection ('Factory Made' or 'Handmade'), respect it:
      let targetCatId = null;
      if (defaultCategoryName.includes('factory')) {
        targetCatId = factoryCategoryId || defaultCategory;
      } else if (defaultCategoryName.includes('handmade')) {
        targetCatId = handmadeCategoryId || defaultCategory;
      } else {
        // 2. Fallback to price rule
        targetCatId = (defaultPrice > 0 && defaultPrice < 10000)
          ? (factoryCategoryId || defaultCategory)
          : (handmadeCategoryId || defaultCategory);
      }

      if (!imageFiles || imageFiles.length === 0) {
        return NextResponse.json({ success: false, error: 'No images were uploaded' }, { status: 400 });
      }

      const timestamp = Date.now();
      const preparedProducts = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (!file || file.size === 0) continue;

        // Clean file name to create product title
        // e.g. "Ruby_Velvet_Nails_01.png" -> "Ruby Velvet Nails"
        const rawName = file.name
          .replace(/\.[^/.]+$/, "") // remove extension
          .replace(/[_-]+/g, " ") // replace underscores/dashes with spaces
          .trim();

        // Capitalize words
        const productName = rawName
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ') || `Nail Set ${i + 1}`;

        const slugBase = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `bulk-${slugBase}-${timestamp}-${i}.${fileExt}`;
        const buffer = await file.arrayBuffer();

        // Upload to supabase storage
        const { error: uploadError } = await supabaseAdmin.storage
          .from('product-images')
          .upload(fileName, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: false
          });

        if (uploadError) {
          console.error(`Failed to upload ${fileName}:`, uploadError);
          continue;
        }

        const { data: publicUrlData } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(fileName);

        preparedProducts.push({
          name: productName,
          slug: `${slugBase}-${timestamp}-${i}`,
          description: `Handcrafted ${productName} luxury press-on nail set. Ready to wear.`,
          price: defaultPrice,
          compare_at_price: null,
          category_id: targetCatId,
          nail_shape: defaultShape,
          style: 'Solid',
          color: null,
          images: [publicUrlData.publicUrl],
          bestseller: false,
          stock_count: defaultStock,
          lengths: ['Short', 'Medium', 'Long'],
          sizes: ['S', 'M', 'L'],
        });
      }

      if (preparedProducts.length === 0) {
        return NextResponse.json({ success: false, error: 'Failed to process any of the uploaded images.' }, { status: 400 });
      }

      const { data: inserted, error: insertError } = await supabaseAdmin
        .from('products')
        .insert(preparedProducts)
        .select('*, categories(slug, name)');

      if (insertError) throw insertError;

      return NextResponse.json({ 
        success: true, 
        count: inserted.length, 
        products: inserted 
      });
    }

    // JSON array mode (e.g. from Excel / CSV preview)
    const rawProducts = formData.get('products');
    const products = rawProducts ? JSON.parse(rawProducts) : [];

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ success: false, error: 'No products provided for bulk upload' }, { status: 400 });
    }

    const categoryMap = new Map();
    categories?.forEach((cat) => {
      categoryMap.set(cat.slug.toLowerCase(), cat.id);
      categoryMap.set(cat.name.toLowerCase(), cat.id);
    });

    const timestamp = Date.now();
    const preparedProducts = [];

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      if (!p.name || !p.price) continue;

      const slugBase = String(p.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const uniqueSlug = `${slugBase}-${timestamp}-${i}`;

      const rawPrice = parseFloat(p.price) || 0;
      const rawCompare = p.compareAtPrice ? parseFloat(p.compareAtPrice) : null;
      const stock = parseInt(p.stockCount ?? p.stock ?? '10', 10);
      const isFeatured = p.featured === true || p.featured === 'true' || p.bestseller === true || p.bestseller === 'true';

      // 1. If explicit category specified in row, honor it:
      let catId = null;
      if (p.category) {
        const catKey = String(p.category).toLowerCase().trim();
        if (catKey.includes('factory')) catId = factoryCategoryId;
        else if (catKey.includes('handmade')) catId = handmadeCategoryId;
        else catId = categoryMap.get(catKey) || null;
      }
      
      // 2. Otherwise fallback to mistake-proof price rule (< 10000 is factory, >= 10000 is handmade):
      if (!catId) {
        catId = (rawPrice > 0 && rawPrice < 10000)
          ? (factoryCategoryId || defaultCategory)
          : (handmadeCategoryId || defaultCategory);
      }

      let imagesArray = [];
      if (Array.isArray(p.images)) {
        imagesArray = p.images.filter(Boolean);
      } else if (typeof p.images === 'string' && p.images.trim()) {
        imagesArray = p.images.split(',').map(s => s.trim()).filter(Boolean);
      } else if (p.image) {
        imagesArray = [p.image];
      }

      preparedProducts.push({
        name: p.name.trim(),
        slug: uniqueSlug,
        description: p.description || '',
        price: rawPrice,
        compare_at_price: rawCompare,
        category_id: catId,
        nail_shape: p.nailShape || p.shape || 'Square',
        style: p.style || p.tags || 'Solid',
        color: p.color || null,
        images: imagesArray,
        bestseller: isFeatured,
        stock_count: isNaN(stock) ? 10 : stock,
        lengths: Array.isArray(p.lengths) ? p.lengths : p.length ? [p.length] : ['Short', 'Medium', 'Long'],
        sizes: ['S', 'M', 'L'],
      });
    }

    if (preparedProducts.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid products found in bulk data.' }, { status: 400 });
    }

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('products')
      .insert(preparedProducts)
      .select('*, categories(slug, name)');

    if (insertError) throw insertError;

    return NextResponse.json({ 
      success: true, 
      count: inserted.length, 
      products: inserted 
    });

  } catch (error) {
    console.error('Bulk upload products error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

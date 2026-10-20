import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key"
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

    const categoryMap = new Map();
    categories?.forEach((cat) => {
      if (cat.id) categoryMap.set(String(cat.id), cat.id);
      if (cat.slug) categoryMap.set(cat.slug.toLowerCase().trim(), cat.id);
      if (cat.name) categoryMap.set(cat.name.toLowerCase().trim(), cat.id);
    });

    const resolveCategoryId = (val) => {
      if (!val) return defaultCategory;
      const str = String(val).trim();
      const lower = str.toLowerCase();
      if (categoryMap.has(str)) return categoryMap.get(str);
      if (categoryMap.has(lower)) return categoryMap.get(lower);
      if (lower.includes('factory')) return factoryCategoryId || defaultCategory;
      if (lower.includes('handmade')) return handmadeCategoryId || defaultCategory;
      return defaultCategory;
    };

    if (mode === 'images_only') {
      const imageFiles = formData.getAll('images');
      const defaultCategoryName = (formData.get('defaultCategory') || '').trim();
      const defaultPrice = parseFloat(formData.get('defaultPrice') || '12000');
      const defaultStock = parseInt(formData.get('defaultStock') || '10', 10);
      const defaultShape = formData.get('defaultShape') || 'Square';
      const defaultLength = formData.get('defaultLength') || 'Medium';

      // Parse custom sizes if provided
      const rawDefaultSizes = formData.get('defaultSizes') || formData.get('sizes');
      let defaultSizesArray = [];
      if (rawDefaultSizes) {
        try {
          const parsed = JSON.parse(rawDefaultSizes);
          if (Array.isArray(parsed)) defaultSizesArray = parsed;
          else defaultSizesArray = String(rawDefaultSizes).split(',').map(s => s.trim()).filter(Boolean);
        } catch {
          defaultSizesArray = String(rawDefaultSizes).split(',').map(s => s.trim()).filter(Boolean);
        }
      }

      // 1. Map directly from user's chosen collection in the modal
      const targetCatId = resolveCategoryId(defaultCategoryName);
      const isTargetFactory = targetCatId === factoryCategoryId || defaultCategoryName.toLowerCase().includes('factory');
      const isTargetHalloween = defaultCategoryName.toLowerCase().includes('halloween');
      
      const finalImageSizes = defaultSizesArray.length > 0
        ? defaultSizesArray
        : (isTargetHalloween ? ['S', 'M', 'L'] : (isTargetFactory ? [] : ['S', 'M', 'L']));

      if (!imageFiles || imageFiles.length === 0) {
        return NextResponse.json({ success: false, error: 'No images were uploaded' }, { status: 400 });
      }

      const timestamp = Date.now();
      
      // Process and upload images concurrently in batches of 5 to avoid connection drops
      const uploadTasks = imageFiles.map(async (file, i) => {
        if (!file || file.size === 0) return null;

        const rawName = file.name
          .replace(/\.[^/.]+$/, "") // remove extension
          .replace(/[_-]+/g, " ") // replace underscores/dashes with spaces
          .trim();

        const productName = rawName
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ') || `Nail Set ${i + 1}`;

        const slugBase = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `nail-set-${i}`;
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `bulk-${slugBase}-${timestamp}-${i}.${fileExt}`;
        const buffer = await file.arrayBuffer();

        // Upload to supabase storage
        const { error: uploadError } = await supabaseAdmin.storage
          .from('product-images')
          .upload(fileName, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error(`Failed to upload ${fileName}:`, uploadError);
          return null;
        }

        const { data: publicUrlData } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(fileName);

        return {
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
          lengths: defaultLength ? [defaultLength] : ['Short', 'Medium', 'Long'],
          sizes: finalImageSizes,
        };
      });

      const results = await Promise.all(uploadTasks);
      const preparedProducts = results.filter(Boolean);

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

      // 1. Map directly from row's category column
      const catId = resolveCategoryId(p.category || p.categoryId || p.category_id);

      let imagesArray = [];
      if (Array.isArray(p.images)) {
        imagesArray = p.images.filter(Boolean);
      } else if (typeof p.images === 'string' && p.images.trim()) {
        imagesArray = p.images.split(',').map(s => s.trim()).filter(Boolean);
      } else if (p.image) {
        imagesArray = [p.image];
      }

      // Parse sizing from row
      let rowSizes = [];
      const rawRowSizes = p.sizes ?? p.size;
      if (Array.isArray(rawRowSizes)) {
        rowSizes = rawRowSizes.map(s => String(s).trim()).filter(Boolean);
      } else if (typeof rawRowSizes === 'string' && rawRowSizes.trim()) {
        try {
          const parsed = JSON.parse(rawRowSizes);
          if (Array.isArray(parsed)) rowSizes = parsed.map(s => String(s).trim()).filter(Boolean);
          else rowSizes = rawRowSizes.split(',').map(s => s.trim()).filter(Boolean);
        } catch {
          rowSizes = rawRowSizes.split(',').map(s => s.trim()).filter(Boolean);
        }
      }

      const isFactoryRow = catId === factoryCategoryId || 
        String(p.category || '').toLowerCase().includes('factory') ||
        String(p.categoryName || '').toLowerCase().includes('factory');

      const isHalloweenRow = String(p.category || '').toLowerCase().includes('halloween') ||
        String(p.categoryName || '').toLowerCase().includes('halloween') ||
        String(p.name || '').toLowerCase().includes('halloween');

      let finalSizes = [];
      if (rowSizes.length > 0) {
        finalSizes = rowSizes;
      } else if (isHalloweenRow) {
        finalSizes = ['S', 'M', 'L'];
      } else if (isFactoryRow) {
        finalSizes = [];
      } else {
        finalSizes = ['S', 'M', 'L'];
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
        sizes: finalSizes,
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

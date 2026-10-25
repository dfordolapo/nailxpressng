import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getLocalCollections, addLocalCollection } from '@/lib/collectionsStore';

const isPlaceholderUrl = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export const dynamic = 'force-dynamic';

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    if (isPlaceholderUrl) {
      return NextResponse.json({ success: true, collections: getLocalCollections() });
    }

    // 1. Fetch all categories
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin categories:', error);
      return NextResponse.json({ success: true, collections: getLocalCollections() });
    }

    // 2. Fetch products to calculate count per category
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, category_id, categories(slug, name)');

    const countMap = {};
    if (products) {
      for (const p of products) {
        if (p.category_id) {
          countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
        }
        if (p.categories?.slug) {
          countMap[p.categories.slug] = (countMap[p.categories.slug] || 0) + 1;
        }
      }
    }

    const enhanced = (categories || []).map((c) => ({
      ...c,
      is_published: c.is_published !== false,
      products_count: countMap[c.id] || countMap[c.slug] || 0,
    }));

    return NextResponse.json({ success: true, collections: enhanced });
  } catch (err) {
    console.error('GET /api/admin/collections error:', err);
    return NextResponse.json({ success: true, collections: getLocalCollections() });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let slug = '';
    let description = '';
    let tagline = '';
    let isPublished = true;
    let displayOrder = 0;
    let imageUrl = '';

    let dropTimerEnabled = false;
    let dropDate = null;
    let dropHeadline = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = formData.get('name') || '';
      slug = formData.get('slug') || '';
      description = formData.get('description') || '';
      tagline = formData.get('tagline') || '';
      isPublished = formData.get('is_published') === 'false' ? false : true;
      displayOrder = parseInt(formData.get('display_order') || '0', 10);
      imageUrl = formData.get('image_url') || '';
      dropTimerEnabled = formData.get('drop_timer_enabled') === 'true';
      dropDate = formData.get('drop_date') || null;
      dropHeadline = formData.get('drop_headline') ? String(formData.get('drop_headline')).trim() : null;

      const imageFile = formData.get('image');
      if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
        if (!isPlaceholderUrl) {
          try {
            const fileExt = (imageFile.name?.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
            const baseSlug = slugify(slug || name);
            const fileName = `collection-${baseSlug}-${Date.now()}.${fileExt}`;
            const buffer = Buffer.from(await imageFile.arrayBuffer());

            const { error: uploadError } = await supabaseAdmin.storage
              .from('product-images')
              .upload(fileName, buffer, {
                contentType: imageFile.type || 'image/jpeg',
                upsert: true
              });

            if (!uploadError) {
              const { data: publicUrlData } = supabaseAdmin.storage
                .from('product-images')
                .getPublicUrl(fileName);
              imageUrl = publicUrlData.publicUrl;
            } else {
              console.error('Storage upload error in POST:', uploadError.message);
              if (formData.has('image_base64')) {
                imageUrl = String(formData.get('image_base64'));
              }
            }
          } catch (storageErr) {
            console.error('Storage exception in POST:', storageErr);
            if (formData.has('image_base64')) {
              imageUrl = String(formData.get('image_base64'));
            }
          }
        } else if (formData.has('image_base64')) {
          imageUrl = String(formData.get('image_base64'));
        }
      }
    } else {
      const body = await request.json();
      name = body.name || '';
      slug = body.slug || '';
      description = body.description || '';
      tagline = body.tagline || '';
      isPublished = body.is_published !== false;
      displayOrder = parseInt(body.display_order || '0', 10);
      imageUrl = body.image || body.image_url || '';
      dropTimerEnabled = Boolean(body.drop_timer_enabled);
      dropDate = body.drop_date || null;
      dropHeadline = body.drop_headline ? String(body.drop_headline).trim() : null;
    }

    if (!name.trim()) {
      return NextResponse.json({ success: false, error: 'Collection name is required' }, { status: 400 });
    }

    const finalSlug = slugify(slug || name);
    if (!finalSlug) {
      return NextResponse.json({ success: false, error: 'A valid slug could not be generated' }, { status: 400 });
    }

    const record = {
      name: name.trim(),
      slug: finalSlug,
      description: description.trim() || null,
      tagline: tagline.trim() || null,
      image: imageUrl || null,
      is_published: isPublished,
      display_order: isNaN(displayOrder) ? 0 : displayOrder,
      drop_timer_enabled: dropTimerEnabled,
      drop_date: dropDate,
      drop_headline: dropHeadline,
    };

    if (isPlaceholderUrl) {
      const localCreated = addLocalCollection(record);
      return NextResponse.json({ success: true, collection: localCreated });
    }

    // Check if slug exists in Supabase
    const { data: existing } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', finalSlug)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: `A collection with slug "${finalSlug}" already exists. Please choose a different name or slug.` 
      }, { status: 409 });
    }

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('categories')
      .insert([record])
      .select()
      .single();

    if (insertError) {
      console.warn('Falling back to local collections store:', insertError.message);
      const localCreated = addLocalCollection(record);
      return NextResponse.json({ success: true, collection: localCreated });
    }

    return NextResponse.json({ success: true, collection: inserted });
  } catch (err) {
    console.error('POST /api/admin/collections error:', err);
    try {
      const fallbackRecord = {
        name: 'New Collection',
        slug: `col-${Date.now()}`,
        is_published: true,
      };
      const local = addLocalCollection(fallbackRecord);
      return NextResponse.json({ success: true, collection: local });
    } catch {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }
}

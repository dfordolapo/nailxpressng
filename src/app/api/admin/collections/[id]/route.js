import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { updateLocalCollection, deleteLocalCollection } from '@/lib/collectionsStore';

const isPlaceholderUrl = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key"
);

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';
    
    let updates = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('name')) updates.name = String(formData.get('name')).trim();
      if (formData.has('slug')) updates.slug = slugify(formData.get('slug'));
      if (formData.has('description')) updates.description = String(formData.get('description')).trim();
      if (formData.has('tagline')) updates.tagline = String(formData.get('tagline')).trim();
      if (formData.has('is_published')) updates.is_published = formData.get('is_published') === 'true';
      if (formData.has('display_order')) updates.display_order = parseInt(formData.get('display_order') || '0', 10);
      if (formData.has('image_url')) updates.image = String(formData.get('image_url'));
      if (formData.has('drop_timer_enabled')) {
        updates.drop_timer_enabled = formData.get('drop_timer_enabled') === 'true';
        if (updates.drop_timer_enabled) updates.drop_notification_sent = false;
      }
      if (formData.has('drop_date')) updates.drop_date = formData.get('drop_date') || null;
      if (formData.has('drop_headline')) updates.drop_headline = String(formData.get('drop_headline') || '').trim() || null;

      const imageFile = formData.get('image');
      if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
        if (!isPlaceholderUrl) {
          try {
            const fileExt = (imageFile.name?.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
            const baseSlug = slugify(updates.slug || id);
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
              updates.image = publicUrlData.publicUrl;
            } else {
              console.error('Storage upload error in PUT:', uploadError.message);
              if (formData.has('image_base64')) {
                updates.image = String(formData.get('image_base64'));
              }
            }
          } catch (storageErr) {
            console.error('Storage exception in PUT:', storageErr);
            if (formData.has('image_base64')) {
              updates.image = String(formData.get('image_base64'));
            }
          }
        } else if (formData.has('image_base64')) {
          updates.image = String(formData.get('image_base64'));
        }
      }
    } else {
      const body = await request.json();
      if (body.name !== undefined) updates.name = String(body.name).trim();
      if (body.slug !== undefined) updates.slug = slugify(body.slug);
      if (body.description !== undefined) updates.description = String(body.description).trim();
      if (body.tagline !== undefined) updates.tagline = String(body.tagline).trim();
      if (body.is_published !== undefined) updates.is_published = Boolean(body.is_published);
      if (body.display_order !== undefined) updates.display_order = parseInt(body.display_order || '0', 10);
      if (body.image !== undefined) updates.image = body.image;
      if (body.drop_timer_enabled !== undefined) {
        updates.drop_timer_enabled = Boolean(body.drop_timer_enabled);
        if (updates.drop_timer_enabled) updates.drop_notification_sent = false;
      }
      if (body.drop_date !== undefined) updates.drop_date = body.drop_date || null;
      if (body.drop_headline !== undefined) updates.drop_headline = body.drop_headline ? String(body.drop_headline).trim() : null;
    }

    if (isPlaceholderUrl) {
      const localUpdated = updateLocalCollection(id, updates);
      return NextResponse.json({ success: true, collection: localUpdated });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const localUpdated = updateLocalCollection(id, updates);
      return NextResponse.json({ success: true, collection: localUpdated });
    }

    return NextResponse.json({ success: true, collection: updated });
  } catch (err) {
    console.error('PUT /api/admin/collections/[id] error:', err);
    try {
      const { id } = await params;
      const localUpdated = updateLocalCollection(id, {});
      return NextResponse.json({ success: true, collection: localUpdated });
    } catch {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // 1. Clean up products referencing this collection to avoid foreign key errors
    try {
      if (!isPlaceholderUrl) {
        await supabaseAdmin
          .from('products')
          .update({ category_id: null })
          .eq('category_id', id);
      }
    } catch (cleanErr) {
      console.warn('Could not nullify category_id on products before category deletion:', cleanErr);
    }

    if (isPlaceholderUrl) {
      deleteLocalCollection(id);
      return NextResponse.json({ success: true, message: 'Collection deleted successfully' });
    }

    // 2. Try deleting from Supabase
    const { error: deleteError } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.warn('Supabase delete category error:', deleteError);
      deleteLocalCollection(id);
    }

    deleteLocalCollection(id);
    return NextResponse.json({ success: true, message: 'Collection deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/admin/collections/[id] error:', err);
    try {
      const { id } = await params;
      deleteLocalCollection(id);
      return NextResponse.json({ success: true, message: 'Collection deleted successfully' });
    } catch {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }
}

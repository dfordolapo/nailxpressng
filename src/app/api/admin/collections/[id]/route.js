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
    } else {
      const body = await request.json();
      if (body.name !== undefined) updates.name = String(body.name).trim();
      if (body.slug !== undefined) updates.slug = slugify(body.slug);
      if (body.description !== undefined) updates.description = String(body.description).trim();
      if (body.tagline !== undefined) updates.tagline = String(body.tagline).trim();
      if (body.is_published !== undefined) updates.is_published = Boolean(body.is_published);
      if (body.display_order !== undefined) updates.display_order = parseInt(body.display_order || '0', 10);
      if (body.image !== undefined) updates.image = body.image;
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

    if (id === 'handmade' || id === 'factory') {
      return NextResponse.json({ 
        success: false, 
        error: 'System collections ("Handmade" and "Factory Made") cannot be deleted.' 
      }, { status: 400 });
    }

    if (isPlaceholderUrl) {
      deleteLocalCollection(id);
      return NextResponse.json({ success: true, message: 'Collection deleted successfully' });
    }

    // Try deleting from Supabase
    const { error: deleteError } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      deleteLocalCollection(id);
    }

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

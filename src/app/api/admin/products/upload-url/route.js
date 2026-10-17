import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key"
);

export async function POST(request) {
  try {
    const { fileName, contentType = 'image/jpeg' } = await request.json();

    if (!fileName) {
      return NextResponse.json({ success: false, error: 'fileName is required' }, { status: 400 });
    }

    // Generate signed upload URL from Supabase with service role
    // This allows client to upload directly to Supabase Storage, completely bypassing Vercel 4.5MB limit
    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .createSignedUploadUrl(fileName);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: publicUrlData.publicUrl
    });

  } catch (error) {
    console.error('Create signed upload url error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

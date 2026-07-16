-- 1. Create a new storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING ( bucket_id = 'product-images' );

-- Note: We do not need to create INSERT/UPDATE/DELETE policies because 
-- our Next.js API routes will use the SERVICE_ROLE_KEY to bypass RLS 
-- when uploading images securely from the backend!

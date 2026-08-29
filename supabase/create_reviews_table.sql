-- 1. Create Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_location TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT '{}',
  verified_buyer BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'hidden')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup by product
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

-- 2. Create Storage Bucket for review images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Public Read Access Policy for review images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Access for Review Images'
  ) THEN
    CREATE POLICY "Public Access for Review Images"
    ON storage.objects FOR SELECT
    TO public
    USING ( bucket_id = 'review-images' );
  END IF;
END $$;

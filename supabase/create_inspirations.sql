-- Create the inspirations table
CREATE TABLE IF NOT EXISTS public.inspirations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.inspirations ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone."
ON public.inspirations FOR SELECT
USING ( true );

-- Allow authenticated users to insert/delete
CREATE POLICY "Authenticated users can insert inspirations."
ON public.inspirations FOR INSERT
TO authenticated
WITH CHECK ( true );

CREATE POLICY "Authenticated users can delete inspirations."
ON public.inspirations FOR DELETE
TO authenticated
USING ( true );

-- Note: You will also need to create a storage bucket named 'inspirations' in the Supabase dashboard
-- and ensure it is set to Public so images can be viewed by anyone.

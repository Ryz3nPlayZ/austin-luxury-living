-- Fix property_images table and RLS policies with proper error handling

-- Drop existing policies if they exist (to handle idempotency)
DROP POLICY IF EXISTS "Anyone can view property images" ON public.property_images;
DROP POLICY IF EXISTS "Authenticated users can manage property images" ON public.property_images;
DROP POLICY IF EXISTS "Authenticated users can update property images" ON public.property_images;
DROP POLICY IF EXISTS "Authenticated users can delete property images" ON public.property_images;

-- Drop table if it exists to recreate cleanly
DROP TABLE IF EXISTS public.property_images CASCADE;

-- Create property_images table
CREATE TABLE public.property_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_property_images_display_order ON public.property_images(display_order);

-- Enable RLS on property_images
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy 1: Anyone can view property images
CREATE POLICY "Anyone can view property images"
ON public.property_images
FOR SELECT
USING (true);

-- Policy 2: Authenticated users can insert property images
CREATE POLICY "Authenticated users can insert property images"
ON public.property_images
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: Authenticated users can update property images
CREATE POLICY "Authenticated users can update property images"
ON public.property_images
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: Authenticated users can delete property images
CREATE POLICY "Authenticated users can delete property images"
ON public.property_images
FOR DELETE
TO authenticated
USING (true);

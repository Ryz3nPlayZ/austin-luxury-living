-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  sqft INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Sold')),
  is_pocket_listing BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Properties: Public can read
CREATE POLICY "Anyone can view properties"
ON public.properties
FOR SELECT
USING (true);

-- Properties: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Properties: Only authenticated users can update
CREATE POLICY "Authenticated users can update properties"
ON public.properties
FOR UPDATE
TO authenticated
USING (true);

-- Properties: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete properties"
ON public.properties
FOR DELETE
TO authenticated
USING (true);

-- Enable RLS on leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Leads: Anyone can insert (submit inquiries)
CREATE POLICY "Anyone can submit leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Leads: Only authenticated users can view leads
CREATE POLICY "Authenticated users can view leads"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

-- Storage: Anyone can view images
CREATE POLICY "Anyone can view property images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-images');

-- Storage: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- Storage: Authenticated users can update their uploads
CREATE POLICY "Authenticated users can update property images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images');

-- Storage: Authenticated users can delete images
CREATE POLICY "Authenticated users can delete property images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'property-images');
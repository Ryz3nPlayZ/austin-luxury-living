-- Migrate existing image_url from properties table to property_images table
-- This fixes properties that were created before the property_images integration

-- Insert into property_images for any property that has image_url but no property_images entry
INSERT INTO public.property_images (property_id, image_url, display_order)
SELECT 
  p.id,
  p.image_url,
  0 as display_order
FROM public.properties p
WHERE 
  p.image_url IS NOT NULL 
  AND p.image_url != ''
  AND NOT EXISTS (
    SELECT 1 
    FROM public.property_images pi 
    WHERE pi.property_id = p.id 
    AND pi.image_url = p.image_url
  );

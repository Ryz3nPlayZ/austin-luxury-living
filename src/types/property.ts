export interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  description: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
  status: "Active" | "Pending" | "Sold";
  is_pocket_listing: boolean;
  created_at: string;
  property_images?: Array<{
    id: string;
    image_url: string;
    display_order: number;
  }>;
}

// Computed properties helper
export function getPropertyImages(property: Property): string[] {
  if (!property.property_images || property.property_images.length === 0) {
    return [];
  }
  return property.property_images
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => img.image_url);
}

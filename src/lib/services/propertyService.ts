import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface PropertyWithImages {
  id: string;
  title: string;
  address: string;
  price: number;
  description: string | null;
  sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  status: string;
  is_pocket_listing: boolean;
  created_at: string;
  property_images?: Array<{
    id: string;
    image_url: string;
    display_order: number;
  }>;
}

export interface CreatePropertyInput {
  title: string;
  address: string;
  price: number;
  description?: string;
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: string;
  is_pocket_listing?: boolean;
}

export interface UpdatePropertyInput extends CreatePropertyInput {
  id: string;
}

/**
 * Fetch all active properties with their images
 */
export async function fetchAllProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_images (
        id,
        image_url,
        display_order
      )
    `)
    .eq("status", "Active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }

  return data as PropertyWithImages[];
}

/**
 * Fetch all properties (admin view - includes all statuses)
 */
export async function fetchAllPropertiesAdmin() {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_images (
        id,
        image_url,
        display_order
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }

  return data as PropertyWithImages[];
}

/**
 * Fetch a single property by ID with images
 */
export async function fetchPropertyById(id: string) {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_images (
        id,
        image_url,
        display_order
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    throw error;
  }

  return data as PropertyWithImages;
}

/**
 * Create a new property
 */
export async function createProperty(input: CreatePropertyInput) {
  const { data, error } = await supabase
    .from("properties")
    .insert({
      title: input.title,
      address: input.address,
      price: input.price,
      description: input.description || null,
      sqft: input.sqft || null,
      bedrooms: input.bedrooms || null,
      bathrooms: input.bathrooms || null,
      status: input.status || "Active",
      is_pocket_listing: input.is_pocket_listing || false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating property:", error);
    throw error;
  }

  return data as PropertyWithImages;
}

/**
 * Update a property
 */
export async function updateProperty(id: string, input: CreatePropertyInput) {
  const { data, error } = await supabase
    .from("properties")
    .update({
      title: input.title,
      address: input.address,
      price: input.price,
      description: input.description || null,
      sqft: input.sqft || null,
      bedrooms: input.bedrooms || null,
      bathrooms: input.bathrooms || null,
      status: input.status || "Active",
      is_pocket_listing: input.is_pocket_listing || false,
    })
    .eq("id", id)
    .select(
      `
      *,
      property_images (
        id,
        image_url,
        display_order
      )
    `
    )
    .single();

  if (error) {
    console.error("Error updating property:", error);
    throw error;
  }

  return data as PropertyWithImages;
}

/**
 * Delete a property (cascades to images and leads)
 */
export async function deleteProperty(id: string) {
  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
}

/**
 * Add an image to a property
 */
export async function addPropertyImage(
  propertyId: string,
  imageUrl: string,
  displayOrder: number
) {
  const { data, error } = await supabase
    .from("property_images")
    .insert({
      property_id: propertyId,
      image_url: imageUrl,
      display_order: displayOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding property image:", error);
    throw error;
  }

  return data;
}

/**
 * Delete a property image
 */
export async function deletePropertyImage(imageId: string) {
  const { error } = await supabase
    .from("property_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    console.error("Error deleting property image:", error);
    throw error;
  }
}

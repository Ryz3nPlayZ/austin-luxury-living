import { supabase } from "@/integrations/supabase/client";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  property_id: string | null;
  created_at: string;
}

export interface LeadWithProperty extends Lead {
  properties?: {
    title: string;
    address: string;
  } | null;
}

export interface SubmitLeadInput {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  property_id?: string;
}

/**
 * Submit a new lead/inquiry
 */
export async function submitLead(input: SubmitLeadInput) {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      message: input.message || null,
      property_id: input.property_id || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting lead:", error);
    throw error;
  }

  return data as Lead;
}

/**
 * Fetch all leads (admin only)
 */
export async function fetchAllLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select(
      `
      *,
      properties (
        title,
        address
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }

  return data as LeadWithProperty[];
}

/**
 * Fetch leads for a specific property (admin only)
 */
export async function fetchLeadsByProperty(propertyId: string) {
  const { data, error } = await supabase
    .from("leads")
    .select(
      `
      *,
      properties (
        title,
        address
      )
    `
    )
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }

  return data as LeadWithProperty[];
}

/**
 * Delete a lead (admin only)
 */
export async function deleteLead(id: string) {
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    console.error("Error deleting lead:", error);
    throw error;
  }
}

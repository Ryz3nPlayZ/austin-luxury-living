import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  submitLead,
  fetchAllLeads,
  fetchLeadsByProperty,
  deleteLead,
  SubmitLeadInput,
} from "@/lib/services/leadService";

const LEADS_QUERY_KEY = ["leads"];
const LEADS_BY_PROPERTY_QUERY_KEY = (propertyId: string) => ["leads", propertyId];

/**
 * Hook to submit a new lead/inquiry
 */
export function useSubmitLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
}

/**
 * Hook to fetch all leads (admin only)
 */
export function useLeads() {
  return useQuery({
    queryKey: LEADS_QUERY_KEY,
    queryFn: fetchAllLeads,
  });
}

/**
 * Hook to fetch leads for a specific property (admin only)
 */
export function useLeadsByProperty(propertyId: string) {
  return useQuery({
    queryKey: LEADS_BY_PROPERTY_QUERY_KEY(propertyId),
    queryFn: () => fetchLeadsByProperty(propertyId),
    enabled: !!propertyId,
  });
}

/**
 * Hook to delete a lead (admin only)
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
}

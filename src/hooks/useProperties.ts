import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllProperties,
  fetchAllPropertiesAdmin,
  fetchPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  addPropertyImage,
  deletePropertyImage,
  CreatePropertyInput,
} from "@/lib/services/propertyService";

const PROPERTIES_QUERY_KEY = ["properties"];
const PROPERTY_QUERY_KEY = (id: string) => ["property", id];

/**
 * Hook to fetch all active properties (public view)
 */
export function useProperties() {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEY,
    queryFn: fetchAllProperties,
  });
}

/**
 * Hook to fetch all properties including inactive ones (admin view)
 */
export function usePropertiesAdmin() {
  return useQuery({
    queryKey: [...PROPERTIES_QUERY_KEY, "admin"],
    queryFn: fetchAllPropertiesAdmin,
  });
}

/**
 * Hook to fetch a single property by ID
 */
export function useProperty(id: string) {
  return useQuery({
    queryKey: PROPERTY_QUERY_KEY(id),
    queryFn: () => fetchPropertyById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new property
 */
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...PROPERTIES_QUERY_KEY, "admin"] });
    },
  });
}

/**
 * Hook to update a property
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreatePropertyInput }) =>
      updateProperty(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...PROPERTIES_QUERY_KEY, "admin"] });
      queryClient.setQueryData(PROPERTY_QUERY_KEY(data.id), data);
    },
  });
}

/**
 * Hook to delete a property
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...PROPERTIES_QUERY_KEY, "admin"] });
    },
  });
}

/**
 * Hook to add an image to a property
 */
export function useAddPropertyImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      imageUrl,
      displayOrder,
    }: {
      propertyId: string;
      imageUrl: string;
      displayOrder: number;
    }) => addPropertyImage(propertyId, imageUrl, displayOrder),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROPERTY_QUERY_KEY(variables.propertyId) });
      queryClient.invalidateQueries({ queryKey: [...PROPERTIES_QUERY_KEY, "admin"] });
    },
  });
}

/**
 * Hook to delete a property image
 */
export function useDeletePropertyImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePropertyImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PROPERTIES_QUERY_KEY, "admin"] });
    },
  });
}

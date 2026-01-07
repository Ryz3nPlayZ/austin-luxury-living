import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2, Building2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PropertyForm } from "./PropertyForm";
import { Badge } from "@/components/ui/badge";

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  description: string | null;
  sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  image_url: string | null;
  status: string;
  is_pocket_listing: boolean;
  created_at: string;
}

export const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const fetchProperties = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } else {
      setProperties(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      fetchProperties();
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProperty(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchProperties();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Pending":
        return "secondary";
      case "Sold":
        return "outline";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {properties.length} {properties.length === 1 ? "property" : "properties"}
        </p>
        <Button onClick={() => setIsFormOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Property
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No properties yet</p>
          <Button onClick={() => setIsFormOpen(true)} variant="outline">
            Add your first property
          </Button>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    {property.image_url ? (
                      <img
                        src={property.image_url}
                        alt={property.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {property.address}
                  </TableCell>
                  <TableCell className="font-display">
                    {formatPrice(property.price)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(property.status)}>
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {property.is_pocket_listing ? (
                      <Badge variant="outline" className="text-primary border-primary">
                        Pocket
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Public</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(property)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(property.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PropertyForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        property={editingProperty}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};



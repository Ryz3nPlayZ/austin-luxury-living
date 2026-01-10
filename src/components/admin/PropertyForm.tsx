import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X, Plus } from "lucide-react";
import { PropertyWithImages } from "@/lib/services/propertyService";

interface PropertyFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  property: PropertyWithImages | null;
}

interface ImageUpload {
  file: File;
  preview: string;
  isUploading: boolean;
}

export const PropertyForm = ({
  open,
  onClose,
  onSuccess,
  property,
}: PropertyFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{
    id: string;
    image_url: string;
    display_order: number;
  }>>([]);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    price: "",
    description: "",
    sqft: "",
    bedrooms: "",
    bathrooms: "",
    status: "Active",
    is_pocket_listing: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        address: property.address,
        price: property.price.toString(),
        description: property.description || "",
        sqft: property.sqft?.toString() || "",
        bedrooms: property.bedrooms?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        status: property.status,
        is_pocket_listing: property.is_pocket_listing,
      });
      setExistingImages(property.property_images || []);
    } else {
      setFormData({
        title: "",
        address: "",
        price: "",
        description: "",
        sqft: "",
        bedrooms: "",
        bathrooms: "",
        status: "Active",
        is_pocket_listing: false,
      });
      setExistingImages([]);
    }
    setImages([]);
  }, [property, open]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid files",
        description: "Some files were skipped because they are not images",
        variant: "destructive",
      });
    }

    const newImages: ImageUpload[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isUploading: false,
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeNewImage = (index: number) => {
    setImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const removeExistingImage = (imageId: string) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const uploadImages = async (): Promise<Array<{ image_url: string; display_order: number }>> => {
    const uploadedImages: Array<{ image_url: string; display_order: number }> = [];

    for (let i = 0; i < images.length; i++) {
      const imageUpload = images[i];
      setImages(prev => prev.map((img, idx) =>
        idx === i ? { ...img, isUploading: true } : img
      ));

      const fileExt = imageUpload.file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, imageUpload.file);

      if (uploadError) {
        toast({
          title: "Upload failed",
          description: `Failed to upload ${imageUpload.file.name}: ${uploadError.message}`,
          variant: "destructive",
        });
        continue;
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      console.log("Uploaded image URL:", urlData.publicUrl); // Debug log

      uploadedImages.push({
        image_url: urlData.publicUrl,
        display_order: existingImages.length + uploadedImages.length,
      });

      setImages(prev => prev.map((img, idx) =>
        idx === i ? { ...img, isUploading: false } : img
      ));
    }

    return uploadedImages;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload new images first
      const uploadedImages = await uploadImages();

      const payload = {
        title: formData.title,
        address: formData.address,
        price: parseFloat(formData.price),
        description: formData.description || null,
        sqft: formData.sqft ? parseInt(formData.sqft) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        status: formData.status,
        is_pocket_listing: formData.is_pocket_listing,
      };

      let propertyId = property?.id;

      if (property) {
        // Update existing property
        const { data, error } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", property.id)
          .select()
          .single();

        if (error) throw error;
        propertyId = data.id;
      } else {
        // Create new property
        const { data, error } = await supabase
          .from("properties")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        propertyId = data.id;
      }

      if (!propertyId) throw new Error("Failed to get property ID");

      // Handle existing images - remove deleted ones
      if (property?.property_images) {
        const currentImageIds = existingImages.map(img => img.id);
        const originalImageIds = property.property_images.map(img => img.id);
        const imagesToDelete = originalImageIds.filter(id => !currentImageIds.includes(id));

        for (const imageId of imagesToDelete) {
          await supabase.from("property_images").delete().eq("id", imageId);
        }
      }

      // Add new images
      for (const uploadedImage of uploadedImages) {
        await supabase.from("property_images").insert({
          property_id: propertyId,
          image_url: uploadedImage.image_url,
          display_order: uploadedImage.display_order,
        });
      }

      toast({
        title: "Success",
        description: property
          ? "Property updated successfully"
          : "Property created successfully",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Clean up object URLs
      images.forEach(img => URL.revokeObjectURL(img.preview));
    }
  };

  const allImages = [
    ...existingImages.map(img => ({ type: 'existing' as const, ...img })),
    ...images.map((img, idx) => ({ type: 'new' as const, index: idx, ...img }))
  ].sort((a, b) => {
    if (a.type === 'existing' && b.type === 'existing') {
      return a.display_order - b.display_order;
    }
    if (a.type === 'existing') return -1;
    if (b.type === 'existing') return 1;
    return 0;
  });

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display text-2xl">
            {property ? "Edit Property" : "New Property"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images Upload */}
          <div className="space-y-2">
            <Label>Property Images</Label>
            <div className="grid grid-cols-2 gap-4">
              {allImages.map((image, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={image.type === 'existing' ? image.image_url : image.preview}
                    alt={`Property ${idx + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => image.type === 'existing'
                      ? removeExistingImage(image.id)
                      : removeNewImage(image.index)
                    }
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {image.type === 'new' && image.isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
              ))}

              {/* Upload Button */}
              <label className="aspect-square border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors flex flex-col items-center justify-center">
                <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground text-center">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              required
            />
          </div>

          {/* Beds/Baths/Sqft Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Beds</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bedrooms: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Baths</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bathrooms: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sqft">Sq Ft</Label>
              <Input
                id="sqft"
                type="number"
                value={formData.sqft}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sqft: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pocket Listing Toggle */}
          <div className="flex items-center justify-between py-4 border-y border-border">
            <div>
              <Label className="text-base">Pocket Listing</Label>
              <p className="text-sm text-muted-foreground">
                Only visible to registered users
              </p>
            </div>
            <Switch
              checked={formData.is_pocket_listing}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_pocket_listing: checked }))
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 btn-primary" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : property ? (
                "Update Property"
              ) : (
                "Create Property"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

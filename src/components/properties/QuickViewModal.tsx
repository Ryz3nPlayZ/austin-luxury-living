import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Property, getPropertyImages } from "@/types/property";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useSubmitLead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";

interface QuickViewModalProps {
  property: Property | null;
  onClose: () => void;
}

const QuickViewModal = ({ property, onClose }: QuickViewModalProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const submitLead = useSubmitLead();
  const { toast } = useToast();

  if (!property) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const images = getPropertyImages(property);
  const displayImages = images.length > 0 ? images : ["https://via.placeholder.com/800x500?text=No+Image"];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleRequestShowing = async () => {
    try {
      await submitLead.mutateAsync({
        name: "Inquiry from Property View",
        email: "noreply@austinestates.com",
        message: `Requesting private showing for ${property.title}`,
        property_id: property.id,
      });

      toast({
        title: "Request Sent",
        description: "We'll contact you to schedule a private showing.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={!!property} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-0">
        <VisuallyHidden>
          <DialogTitle>{property.address}</DialogTitle>
        </VisuallyHidden>
        
        {/* Image Carousel */}
        <div className="relative aspect-[16/10] bg-muted">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={displayImages[currentImage]}
              alt={`${property.address} - Image ${currentImage + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 text-sm">
            {currentImage + 1} / {displayImages.length}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Info */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <p className="font-display text-3xl text-foreground mb-2">
                {formatPrice(property.price)}
              </p>
              <p className="text-sm uppercase tracking-widest text-foreground/50 mb-4">
                {property.address}
              </p>
              <p className="text-foreground/70">
                {property.bedrooms} Bedrooms · {property.bathrooms} Bathrooms · {property.sqft?.toLocaleString()} Sq Ft
              </p>
              {property.description && (
                <p className="text-foreground/60 mt-4 text-sm max-w-md">
                  {property.description}
                </p>
              )}
            </div>
            
            <Button 
              onClick={handleRequestShowing}
              disabled={submitLead.isPending}
              className="border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-colors px-8"
            >
              {submitLead.isPending ? "Sending..." : "Request Showing"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
};

export default QuickViewModal;

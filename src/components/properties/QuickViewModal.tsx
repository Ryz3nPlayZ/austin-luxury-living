import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface QuickViewModalProps {
  property: Property | null;
  onClose: () => void;
}

const QuickViewModal = ({ property, onClose }: QuickViewModalProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  if (!property) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
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
              src={property.images[currentImage]}
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
            {currentImage + 1} / {property.images.length}
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
                {property.beds} Bedrooms · {property.baths} Bathrooms · {property.sqft.toLocaleString()} Sq Ft
              </p>
            </div>
            
            <Button 
              className="border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-colors px-8"
            >
              Request Private Showing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;

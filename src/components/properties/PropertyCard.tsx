import { motion } from "framer-motion";
import { Property, getPropertyImages } from "@/types/property";

interface PropertyCardProps {
  property: Property;
  index: number;
  onClick: () => void;
}

const PropertyCard = ({ property, index, onClick }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const images = getPropertyImages(property);
  const imageUrl = images.length > 0 ? images[0] : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-foreground/5">
        <img
          src={imageUrl}
          alt={property.address}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Status Badge */}
        {property.status && property.status !== "Active" && (
          <span className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground uppercase tracking-wide">
            {property.status}
          </span>
        )}
        
        {/* Pocket Listing Badge */}
        {property.is_pocket_listing && (
          <span className="absolute top-4 right-4 bg-primary/90 px-3 py-1.5 text-xs font-medium text-white uppercase tracking-wide">
            Pocket Listing
          </span>
        )}
      </div>

      {/* Property Info */}
      <div>
        <p className="font-display text-xl text-foreground mb-1">
          {formatPrice(property.price)}
        </p>
        <p className="text-sm uppercase tracking-widest text-foreground/50 truncate">
          {property.address}
        </p>
        <p className="text-sm text-foreground/40 mt-2">
          {property.bedrooms} Bed · {property.bathrooms} Bath · {property.sqft?.toLocaleString()} Sq Ft
        </p>
      </div>
    </motion.article>
  );
};

export default PropertyCard;

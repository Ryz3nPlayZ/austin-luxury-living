import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import FilterBar from "@/components/properties/FilterBar";
import QuickViewModal from "@/components/properties/QuickViewModal";
import { Property } from "@/types/property";
import { useProperties } from "@/hooks/useProperties";
import { Loader2 } from "lucide-react";

const Properties = () => {
  const [showPocket, setShowPocket] = useState(false);
  const [pocketUnlocked, setPocketUnlocked] = useState(false);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>("all");
  const [bedsFilter, setBedsFilter] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const { data: properties = [], isLoading, error } = useProperties();

  const filteredProperties = properties.filter((property) => {
    // Pocket filter
    if (showPocket && !property.is_pocket_listing) return false;
    if (!showPocket && property.is_pocket_listing) return false;

    // Price filter
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number);
      if (max && (property.price < min || property.price > max)) return false;
      if (!max && property.price < min) return false;
    }

    // Neighborhood filter - need to derive from address for now
    if (neighborhoodFilter !== "all") {
      const addressParts = property.address.toUpperCase().split(",");
      const neighborhood = addressParts[0];
      const selectedArea = neighborhoodFilter.toUpperCase();
      if (!neighborhood.includes(selectedArea)) return false;
    }

    // Beds filter
    if (bedsFilter !== "all" && property.bedrooms && property.bedrooms < parseInt(bedsFilter)) return false;

    return true;
  });

  const handlePocketToggle = (enabled: boolean) => {
    if (enabled && !pocketUnlocked) {
      setPocketUnlocked(true);
    }
    setShowPocket(enabled);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="pt-32 pb-16 section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="font-display text-5xl md:text-6xl text-foreground mb-6">
            The Gallery
          </h1>
          <p className="text-lg text-foreground/70 max-w-prose">
            Browse our curated collection of Austin's finest properties. Each home has been 
            personally vetted by our team for quality, location, and investment potential.
          </p>
        </motion.div>
      </section>

      {/* Filter Bar */}
      <FilterBar
        showPocket={showPocket}
        onPocketToggle={handlePocketToggle}
        priceFilter={priceFilter}
        onPriceChange={setPriceFilter}
        neighborhoodFilter={neighborhoodFilter}
        onNeighborhoodChange={setNeighborhoodFilter}
        bedsFilter={bedsFilter}
        onBedsChange={setBedsFilter}
      />

      {/* Properties Grid */}
      <section className="section-padding py-16">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-foreground/60 mt-4">Loading properties...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <p className="font-display text-2xl text-red-500 mb-4">
                Error loading properties
              </p>
              <p className="text-foreground/40">
                Please try refreshing the page
              </p>
            </motion.div>
          ) : filteredProperties.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16"
            >
              {filteredProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={index}
                  onClick={() => setSelectedProperty(property)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <p className="font-display text-2xl text-foreground/50 mb-4">
                No properties match your criteria
              </p>
              <p className="text-foreground/40">
                Try adjusting your filters to discover more homes
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      <Footer />
    </div>
  );
};

export default Properties;

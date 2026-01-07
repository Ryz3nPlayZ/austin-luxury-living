import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import FilterBar from "@/components/properties/FilterBar";
import QuickViewModal from "@/components/properties/QuickViewModal";
import { Property } from "@/types/property";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const mockProperties: Property[] = [
  {
    id: "1",
    images: [property1, property2, property3, property1, property2],
    price: 2850000,
    address: "4521 WESTLAKE DRIVE",
    neighborhood: "Westlake",
    beds: 5,
    baths: 4,
    sqft: 4200,
    status: "New",
    isPocket: false,
  },
  {
    id: "2",
    images: [property2, property1, property3, property2, property1],
    price: 1950000,
    address: "2847 TARRYTOWN ROAD",
    neighborhood: "Tarrytown",
    beds: 4,
    baths: 3,
    sqft: 3100,
    status: null,
    isPocket: false,
  },
  {
    id: "3",
    images: [property3, property1, property2, property3, property1],
    price: 3200000,
    address: "901 BALCONES DRIVE",
    neighborhood: "Balcones",
    beds: 6,
    baths: 5,
    sqft: 5500,
    status: "Under Contract",
    isPocket: false,
  },
  {
    id: "4",
    images: [property1, property3, property2, property1, property3],
    price: 4100000,
    address: "1200 LAKE AUSTIN BLVD",
    neighborhood: "Lake Austin",
    beds: 5,
    baths: 6,
    sqft: 6200,
    status: null,
    isPocket: true,
  },
  {
    id: "5",
    images: [property2, property3, property1, property2, property3],
    price: 1750000,
    address: "3456 BARTON HILLS DR",
    neighborhood: "Barton Hills",
    beds: 3,
    baths: 2,
    sqft: 2400,
    status: "New",
    isPocket: true,
  },
  {
    id: "6",
    images: [property3, property2, property1, property3, property2],
    price: 2200000,
    address: "789 CLARKSVILLE LANE",
    neighborhood: "Clarksville",
    beds: 4,
    baths: 3,
    sqft: 3800,
    status: null,
    isPocket: false,
  },
];

const Properties = () => {
  const [showPocket, setShowPocket] = useState(false);
  const [pocketUnlocked, setPocketUnlocked] = useState(false);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>("all");
  const [bedsFilter, setBedsFilter] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties = mockProperties.filter((property) => {
    // Pocket filter
    if (showPocket && !property.isPocket) return false;
    if (!showPocket && property.isPocket) return false;

    // Price filter
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number);
      if (max && (property.price < min || property.price > max)) return false;
      if (!max && property.price < min) return false;
    }

    // Neighborhood filter
    if (neighborhoodFilter !== "all" && property.neighborhood !== neighborhoodFilter) return false;

    // Beds filter
    if (bedsFilter !== "all" && property.beds < parseInt(bedsFilter)) return false;

    return true;
  });

  const handlePocketToggle = (enabled: boolean) => {
    if (enabled && !pocketUnlocked) {
      // Would show email gate modal here
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
          {filteredProperties.length > 0 ? (
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

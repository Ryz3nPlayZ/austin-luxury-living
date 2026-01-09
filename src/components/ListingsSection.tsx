import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { getPropertyImages } from "@/types/property";
import { Link } from "react-router-dom";

const ListingsSection = () => {
  const { data: properties = [], isLoading } = useProperties();
  
  // Get first 3 properties for featured section
  const featuredProperties = properties.slice(0, 3);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-24 section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-section text-foreground mb-4">
            Featured Properties
          </h2>
          <p className="text-muted-foreground text-body max-w-xl mx-auto">
            Curated selections from Austin's most desirable neighborhoods
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : featuredProperties.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => {
                const images = getPropertyImages(property);
                const imageUrl = images.length > 0 ? images[0] : "https://via.placeholder.com/400x300?text=No+Image";
                const isPocket = property.is_pocket_listing;

                return (
                  <motion.article
                    key={property.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="card-property group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={property.address}
                        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                          isPocket ? "blur-sm" : ""
                        }`}
                      />
                      
                      {isPocket && (
                        <div className="absolute inset-0 bg-foreground/60 flex flex-col items-center justify-center gap-4">
                          <Lock className="w-8 h-8 text-primary-foreground" />
                          <span className="text-primary-foreground text-sm uppercase tracking-widest font-medium">
                            Pocket Listing
                          </span>
                          <Button variant="hero" size="sm" asChild>
                            <Link to="/contact">Unlock Details</Link>
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                        {property.title}
                      </p>
                      <h3 className="font-display text-xl font-medium text-foreground mb-3">
                        {property.address}
                      </h3>
                      <p className="text-primary font-display text-2xl mb-4">
                        {formatPrice(property.price)}
                      </p>
                      
                      <div className="flex gap-6 text-sm text-muted-foreground border-t border-border pt-4">
                        <span>{property.bedrooms} Beds</span>
                        <span>{property.bathrooms} Baths</span>
                        <span>{property.sqft?.toLocaleString()} Sq Ft</span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button variant="outline" size="lg" asChild>
                <Link to="/properties">View All Listings</Link>
              </Button>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No properties available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ListingsSection;

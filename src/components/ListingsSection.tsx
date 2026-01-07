import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import { Button } from "@/components/ui/button";

const properties = [
  {
    id: 1,
    image: property1,
    address: "2847 Westlake Drive",
    neighborhood: "Westlake Hills",
    price: "$4,250,000",
    beds: 5,
    baths: 6,
    sqft: "6,200",
  },
  {
    id: 2,
    image: property2,
    address: "1523 Pemberton Heights",
    neighborhood: "Pemberton Heights",
    price: "$3,875,000",
    beds: 4,
    baths: 5,
    sqft: "5,400",
  },
  {
    id: 3,
    image: property3,
    address: "Exclusive Off-Market",
    neighborhood: "Barton Creek",
    price: "Coming Soon",
    beds: 6,
    baths: 7,
    sqft: "8,100",
    comingSoon: true,
  },
];

const ListingsSection = () => {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
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
                  src={property.image}
                  alt={property.address}
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    property.comingSoon ? "blur-sm" : ""
                  }`}
                />
                
                {property.comingSoon && (
                  <div className="absolute inset-0 bg-foreground/60 flex flex-col items-center justify-center gap-4">
                    <Lock className="w-8 h-8 text-primary-foreground" />
                    <span className="text-primary-foreground text-sm uppercase tracking-widest font-medium">
                      Coming Soon
                    </span>
                    <Button variant="hero" size="sm">
                      Unlock Details
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  {property.neighborhood}
                </p>
                <h3 className="font-display text-xl font-medium text-foreground mb-3">
                  {property.address}
                </h3>
                <p className="text-primary font-display text-2xl mb-4">
                  {property.price}
                </p>
                
                <div className="flex gap-6 text-sm text-muted-foreground border-t border-border pt-4">
                  <span>{property.beds} Beds</span>
                  <span>{property.baths} Baths</span>
                  <span>{property.sqft} Sq Ft</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg">
            View All Listings
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ListingsSection;

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, Hammer, Truck, Sparkles, TreeDeciduous, Shield } from "lucide-react";

const vendors = [
  { icon: Palette, title: "Interior Designers", description: "Curated design partners" },
  { icon: Hammer, title: "Contractors", description: "Vetted renovation experts" },
  { icon: Truck, title: "Moving Services", description: "White-glove relocators" },
  { icon: Sparkles, title: "Deep Cleaning", description: "Pre-sale specialists" },
  { icon: TreeDeciduous, title: "Landscaping", description: "Curb appeal masters" },
  { icon: Shield, title: "Home Warranty", description: "Protection partners" },
];

const VendorNetwork = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-4xl text-foreground mb-4">
          The Black Book
        </h2>
        <p className="text-foreground/70 max-w-prose mx-auto">
          Our clients get exclusive access to Austin's most trusted service providers.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {vendors.map((vendor, index) => (
          <motion.div
            key={vendor.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 border border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors">
              <vendor.icon className="w-6 h-6 text-primary" strokeWidth={1} />
            </div>
            <h3 className="font-display text-sm text-foreground mb-1">
              {vendor.title}
            </h3>
            <p className="text-xs text-foreground/50">
              {vendor.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default VendorNetwork;

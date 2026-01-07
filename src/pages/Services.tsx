import { motion } from "framer-motion";
import { 
  Camera, 
  Target, 
  Lock, 
  Megaphone,
  Palette,
  Hammer,
  Truck,
  Star
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureSection from "@/components/services/FeatureSection";
import ProcessTimeline from "@/components/services/ProcessTimeline";
import ComparisonTable from "@/components/services/ComparisonTable";
import VendorNetwork from "@/components/services/VendorNetwork";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const Services = () => {
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
            The Concierge
          </h1>
          <p className="text-lg text-foreground/70 max-w-prose">
            Selling a home in Austin isn't just a transaction—it's an orchestration. 
            Our white-glove service ensures every detail is handled with precision.
          </p>
        </motion.div>
      </section>

      {/* Feature Sections - Zig Zag Layout */}
      <FeatureSection
        title="Staging That Sells"
        description="First impressions are everything. Our in-house staging team transforms your home into an irresistible lifestyle that buyers can't stop imagining themselves in. Every piece of furniture, every throw pillow, every carefully placed book tells a story."
        image={property1}
        reverse={false}
      />

      <FeatureSection
        title="Pricing Intelligence"
        description="Forget the algorithm. Our pricing strategy is built on decades of neighborhood knowledge, off-market intel, and real relationships with Austin's most active buyers. We know what the market will bear—and we'll get every dollar of it."
        image={property2}
        reverse={true}
      />

      <FeatureSection
        title="Private Launch Strategy"
        description="Before your home hits the MLS, we introduce it to our network of pre-qualified buyers. This exclusive preview period creates urgency and often results in offers before the general public even knows your home is for sale."
        image={property3}
        reverse={false}
      />

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* Comparison Table */}
      <ComparisonTable />

      {/* Vendor Network */}
      <VendorNetwork />

      <Footer />
    </div>
  );
};

export default Services;

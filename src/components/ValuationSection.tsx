import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ValuationSection = () => {
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle valuation request
    console.log("Valuation requested for:", address);
  };

  return (
    <section className="py-24 bg-foreground">
      <div className="max-w-5xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-section text-background mb-4">
            What's Your Home Worth?
          </h2>
          <p className="text-background/70 text-body">
            Get a comprehensive market report tailored to your property
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row items-stretch gap-4"
        >
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your Austin address..."
              className="w-full bg-background text-foreground pl-12 pr-6 py-5 text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <Button 
            type="submit" 
            variant="hero" 
            size="lg"
            className="md:w-auto w-full flex items-center gap-2"
          >
            Get Free Report
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-background/50 text-sm mt-6"
        >
          No obligation. Personalized analysis delivered within 24 hours.
        </motion.p>
      </div>
    </section>
  );
};

export default ValuationSection;

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";

const comparisons = [
  {
    category: "Photography",
    them: "iPhone photos",
    us: "Architectural photography & drone footage",
  },
  {
    category: "Marketing",
    them: "MLS listing only",
    us: "Custom website, social campaign, print collateral",
  },
  {
    category: "Staging",
    them: "Suggestions only",
    us: "Full staging with our curated inventory",
  },
  {
    category: "Network",
    them: "Wait for buyers to find you",
    us: "Direct access to our buyer database",
  },
  {
    category: "Communication",
    them: "Weekly updates",
    us: "Real-time feedback after every showing",
  },
];

const ComparisonTable = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 section-padding bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-4xl text-foreground mb-4">
          The Difference
        </h2>
        <p className="text-foreground/70 max-w-prose mx-auto">
          Not all agents are created equal. Here's how we compare.
        </p>
      </motion.div>

      {/* Table Headers */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div />
          <p className="text-sm uppercase tracking-widest text-foreground/50">
            Standard Agents
          </p>
          <p className="text-sm uppercase tracking-widest text-primary font-medium">
            Austin Estates
          </p>
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="max-w-4xl mx-auto">
        {comparisons.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-b border-border items-center"
          >
            <p className="font-display text-lg text-foreground">
              {item.category}
            </p>
            <div className="flex items-start gap-3 text-foreground/60">
              <X className="w-4 h-4 text-foreground/40 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{item.them}</span>
            </div>
            <div className="flex items-start gap-3 text-foreground">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{item.us}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ComparisonTable;

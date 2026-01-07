import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, Target, Lock, Megaphone } from "lucide-react";

const steps = [
  {
    icon: Palette,
    title: "Staging",
    description: "Professional staging and photography to showcase your home at its absolute best.",
  },
  {
    icon: Target,
    title: "Pricing",
    description: "Strategic pricing based on market intelligence and neighborhood expertise.",
  },
  {
    icon: Lock,
    title: "Private Launch",
    description: "Exclusive preview to our network of pre-qualified buyers before public listing.",
  },
  {
    icon: Megaphone,
    title: "Public Launch",
    description: "Full market exposure with premium marketing across all channels.",
  },
];

const ProcessTimeline = () => {
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
          The Seller's Journey
        </h2>
        <p className="text-foreground/70 max-w-prose mx-auto">
          Our proven four-step process ensures maximum exposure and optimal results.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative max-w-3xl mx-auto">
        {/* Central Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative flex items-start gap-8 mb-12 last:mb-0"
          >
            {/* Dot */}
            <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 mt-1.5 z-10" />

            {/* Content - alternating sides on desktop */}
            <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"}`}>
              <div className={`flex items-center gap-3 mb-2 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                <step.icon className="w-5 h-5 text-primary" strokeWidth={1} />
                <h3 className="font-display text-xl text-foreground">
                  {step.title}
                </h3>
              </div>
              <p className="text-foreground/70 text-sm">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProcessTimeline;

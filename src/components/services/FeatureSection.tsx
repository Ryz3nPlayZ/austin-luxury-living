import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface FeatureSectionProps {
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
}

const FeatureSection = ({ title, description, image, reverse = false }: FeatureSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 section-padding overflow-hidden">
      <div className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${reverse ? "md:flex-row-reverse" : ""}`}>
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`${reverse ? "md:order-2" : "md:order-1"}`}
        >
          <h2 className="font-display text-4xl text-foreground mb-6">
            {title}
          </h2>
          <p className="text-foreground/70 leading-relaxed max-w-prose">
            {description}
          </p>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: reverse ? -50 : 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className={`${reverse ? "md:order-1" : "md:order-2"}`}
        >
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const team = [
  {
    name: "Sarah Chen",
    title: "Senior Agent",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=533&fit=crop",
  },
  {
    name: "Marcus Williams",
    title: "Luxury Specialist",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=533&fit=crop",
  },
  {
    name: "Elena Rodriguez",
    title: "Buyer's Agent",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=533&fit=crop",
  },
  {
    name: "David Park",
    title: "Investment Advisor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=533&fit=crop",
  },
  {
    name: "Olivia Thompson",
    title: "Marketing Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=533&fit=crop",
  },
  {
    name: "Michael Foster",
    title: "Client Relations",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=533&fit=crop",
  },
];

const TeamGrid = () => {
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
          Meet The Team
        </h2>
        <p className="text-foreground/70 max-w-prose mx-auto">
          Every member of our team lives and breathes Austin real estate.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            {/* Image with grayscale effect */}
            <div className="aspect-[3/4] overflow-hidden mb-4">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            
            {/* Name and Title */}
            <h3 className="font-display text-lg text-foreground">
              {member.name}
            </h3>
            <p className="text-xs uppercase tracking-widest text-foreground/50 mt-1">
              {member.title}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TeamGrid;

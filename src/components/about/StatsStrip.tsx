import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 850, suffix: "M+", label: "Sold Volume" },
  { value: 23, suffix: "", label: "Years Active" },
  { value: 1200, suffix: "+", label: "Happy Families" },
];

const CountUp = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {target >= 100 ? `$${count}` : count}{suffix}
    </span>
  );
};

const StatsStrip = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section 
      ref={ref} 
      className="py-20 section-padding"
      style={{ backgroundColor: "hsl(var(--foreground))" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <p 
              className="font-display text-5xl md:text-6xl mb-2"
              style={{ color: "hsl(var(--background))" }}
            >
              <CountUp target={stat.value} suffix={stat.suffix} />
            </p>
            <p 
              className="text-sm uppercase tracking-widest"
              style={{ color: "hsl(var(--background) / 0.7)" }}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsStrip;

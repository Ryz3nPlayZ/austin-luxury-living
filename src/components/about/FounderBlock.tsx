import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const FounderBlock = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding pb-32">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* Founder Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="aspect-[3/4] bg-muted overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop"
              alt="James Mitchell, Founder"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Founder's Letter */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pt-8"
        >
          <h2 className="font-display text-3xl text-foreground mb-8">
            A Letter From Our Founder
          </h2>
          
          <div className="space-y-6 text-foreground/80 text-lg italic leading-relaxed max-w-prose">
            <p>
              When I started in real estate twenty-three years ago, Austin was a different city. 
              But even as the skyline changed, one thing remained constant: people want to work 
              with someone who truly knows their neighborhood.
            </p>
            <p>
              I've watched families grow in the homes I helped them find. I've seen first-time 
              buyers become seasoned investors. And I've learned that this business isn't about 
              transactions—it's about trust.
            </p>
            <p>
              At Austin Estates, we've built a team that shares this philosophy. Every agent 
              here lives in the neighborhoods they serve. Every recommendation comes from 
              personal experience. And every client becomes part of our extended family.
            </p>
            <p>
              Thank you for considering us as your partners in this journey.
            </p>
          </div>

          {/* Signature */}
          <div className="mt-10">
            <svg
              viewBox="0 0 200 60"
              className="w-48 h-auto text-foreground"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 45 Q 25 20, 50 35 T 90 30 Q 100 25, 110 40 Q 120 50, 140 25 Q 155 15, 180 35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M85 45 Q 95 55, 115 45"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <p className="text-sm text-foreground/60 mt-2">
              James Mitchell, Founder & Principal Broker
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderBlock;

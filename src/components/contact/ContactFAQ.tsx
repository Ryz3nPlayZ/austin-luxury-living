import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do you work with first-time buyers?",
    answer: "Absolutely. Many of our clients are purchasing their first home, and we take extra care to guide them through every step of the process. From explaining financing options to negotiating on your behalf, we're here to make the experience as smooth as possible.",
  },
  {
    question: "What areas of Austin do you cover?",
    answer: "We specialize in Central Austin, Westlake, Tarrytown, Barton Hills, and the surrounding Hill Country communities. Our agents live in these neighborhoods and have deep, personal knowledge of each area's character, schools, and market dynamics.",
  },
  {
    question: "How is your commission structured?",
    answer: "Our commission is competitive with the Austin market and reflects the premium level of service we provide. We're happy to discuss our fee structure during an initial consultation—no pressure, just transparency.",
  },
];

const ContactFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding py-24 bg-muted/30">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl text-foreground text-center mb-12"
        >
          Common Questions
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-b border-border"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between py-6 text-left"
              >
                <span className="font-display text-lg text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-foreground/50 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-foreground/70 pb-6 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;

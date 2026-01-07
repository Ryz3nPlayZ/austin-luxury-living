import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FounderBlock from "@/components/about/FounderBlock";
import StatsStrip from "@/components/about/StatsStrip";
import TeamGrid from "@/components/about/TeamGrid";

const About = () => {
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
            Our Story
          </h1>
          <p className="text-lg text-foreground/70 max-w-prose">
            We're not just agents. We're neighbors, advocates, and trusted advisors 
            who've spent decades learning every corner of this city.
          </p>
        </motion.div>
      </section>

      {/* Founder's Letter */}
      <FounderBlock />

      {/* Stats Strip */}
      <StatsStrip />

      {/* Team Grid */}
      <TeamGrid />

      <Footer />
    </div>
  );
};

export default About;

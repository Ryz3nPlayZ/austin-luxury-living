import { motion } from "framer-motion";

const agents = [
  {
    id: 1,
    name: "Alexandra Chen",
    role: "Founding Partner",
    signature: "Alexandra",
    initials: "AC",
  },
  {
    id: 2,
    name: "Marcus Williams",
    role: "Senior Advisor",
    signature: "Marcus",
    initials: "MW",
  },
  {
    id: 3,
    name: "Isabella Torres",
    role: "Luxury Specialist",
    signature: "Isabella",
    initials: "IT",
  },
];

const TeamSection = () => {
  return (
    <section className="py-24 section-padding bg-secondary">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-section text-foreground mb-4">
            Your Trusted Advisors
          </h2>
          <p className="text-muted-foreground text-body max-w-xl mx-auto">
            Decades of combined experience navigating Austin's luxury market
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              {/* Avatar */}
              <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center border-2 border-border overflow-hidden">
                <span className="font-display text-3xl md:text-4xl text-foreground">
                  {agent.initials}
                </span>
              </div>

              {/* Name & Role */}
              <h3 className="font-display text-xl font-medium text-foreground mb-1">
                {agent.name}
              </h3>
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                {agent.role}
              </p>

              {/* Signature */}
              <p className="font-display text-2xl italic text-primary">
                {agent.signature}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

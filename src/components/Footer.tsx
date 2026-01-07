import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-16 section-padding bg-foreground">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start gap-12"
        >
          {/* Brand */}
          <div className="max-w-sm">
            <h3 className="font-display text-2xl font-medium text-background mb-4">
              Austin<span className="text-primary">Estates</span>
            </h3>
            <p className="text-background/60 text-sm leading-relaxed">
              Austin's premier luxury real estate advisors. 
              Personalized service for extraordinary homes.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-background/50 mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>512.555.0100</li>
              <li>hello@austinestates.com</li>
              <li>1200 West 6th Street, Suite 400</li>
              <li>Austin, TX 78703</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-background/50 mb-4">
              Hours
            </h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>Monday – Friday: 9am – 6pm</li>
              <li>Saturday: 10am – 4pm</li>
              <li>Sunday: By Appointment</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs text-background/40">
            © 2025 AustinEstates. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-background/40 hover:text-background/70 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-background/40 hover:text-background/70 transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

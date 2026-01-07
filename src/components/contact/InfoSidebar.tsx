import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const InfoSidebar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Map */}
      <div className="aspect-[4/3] bg-muted overflow-hidden">
        <img
          src="https://api.mapbox.com/styles/v1/mapbox/light-v11/static/-97.7431,30.2672,13,0/400x300@2x?access_token=pk.placeholder"
          alt="Office location map"
          className="w-full h-full object-cover grayscale"
          onError={(e) => {
            // Fallback to a placeholder if mapbox fails
            e.currentTarget.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop&sat=-100";
          }}
        />
      </div>

      {/* Contact Info */}
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={1} />
          <div>
            <p className="text-sm uppercase tracking-widest text-foreground/50 mb-1">
              Office
            </p>
            <p className="text-foreground">
              1200 Congress Avenue<br />
              Suite 400<br />
              Austin, TX 78701
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={1} />
          <div>
            <p className="text-sm uppercase tracking-widest text-foreground/50 mb-1">
              Direct Line
            </p>
            <a 
              href="tel:+15125550199" 
              className="text-foreground hover:text-primary transition-colors"
            >
              (512) 555-0199
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={1} />
          <div>
            <p className="text-sm uppercase tracking-widest text-foreground/50 mb-1">
              Email
            </p>
            <a 
              href="mailto:hello@austinestates.com" 
              className="text-foreground hover:text-primary transition-colors"
            >
              hello@austinestates.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={1} />
          <div>
            <p className="text-sm uppercase tracking-widest text-foreground/50 mb-1">
              Hours
            </p>
            <p className="text-foreground">
              Monday – Friday: 9am – 6pm<br />
              Saturday: By appointment<br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoSidebar;

import { motion } from "framer-motion";
import { MapPin, ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSubmitLead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";

const ValuationSection = () => {
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const submitLead = useSubmitLead();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !email) {
      toast({
        title: "Missing information",
        description: "Please provide both your address and email",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitLead.mutateAsync({
        name: "Home Valuation Request",
        email: email,
        message: `Property address: ${address}`,
      });

      toast({
        title: "Request Received!",
        description: "We'll send your personalized market report within 24 hours.",
      });

      setAddress("");
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="valuation" className="py-24 bg-foreground">
      <div className="max-w-5xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-section text-background mb-4">
            What's Your Home Worth?
          </h2>
          <p className="text-background/70 text-body">
            Get a comprehensive market report tailored to your property
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your Austin address..."
                required
                className="w-full bg-background text-foreground pl-12 pr-6 h-12 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address..."
                required
                className="w-full bg-background text-foreground pl-12 pr-6 h-12 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <Button 
              type="submit" 
              variant="hero" 
              size="lg"
              disabled={submitLead.isPending}
              className="md:w-auto w-full h-12 flex items-center gap-2"
            >
              {submitLead.isPending ? "Sending..." : "Get Free Report"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-background/50 text-sm mt-6"
        >
          No obligation. Personalized analysis delivered within 24 hours.
        </motion.p>
      </div>
    </section>
  );
};

export default ValuationSection;

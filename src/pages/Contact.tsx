import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import InfoSidebar from "@/components/contact/InfoSidebar";
import ContactFAQ from "@/components/contact/ContactFAQ";

const Contact = () => {
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
            The Invitation
          </h1>
          <p className="text-lg text-foreground/70 max-w-prose">
            Ready to start your Austin real estate journey? We'd love to hear from you. 
            Reach out and let's begin the conversation.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="section-padding pb-24">
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {/* Info Sidebar - moves to top on mobile */}
          <div className="md:order-2">
            <InfoSidebar />
          </div>

          {/* Contact Form - takes 2/3 width */}
          <div className="md:col-span-2 md:order-1">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <ContactFAQ />

      <Footer />
    </div>
  );
};

export default Contact;

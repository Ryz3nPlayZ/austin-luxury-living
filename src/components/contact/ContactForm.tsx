import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSubmitLead } from "@/hooks/useLeads";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const submitLead = useSubmitLead();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitLead.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        message: data.message || undefined,
      });

      toast({
        title: "Message Sent",
        description: "We'll be in touch within 24 hours.",
      });

      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm uppercase tracking-widest text-foreground/60 mb-2">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full h-12 bg-transparent border-0 border-b-2 border-border focus:border-primary focus:outline-none text-foreground text-lg transition-colors"
          placeholder="Your name"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-2">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm uppercase tracking-widest text-foreground/60 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full h-12 bg-transparent border-0 border-b-2 border-border focus:border-primary focus:outline-none text-foreground text-lg transition-colors"
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-2">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-sm uppercase tracking-widest text-foreground/60 mb-2">
          Phone Number (Optional)
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="w-full h-12 bg-transparent border-0 border-b-2 border-border focus:border-primary focus:outline-none text-foreground text-lg transition-colors"
          placeholder="(512) 555-0123"
        />
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm uppercase tracking-widest text-foreground/60 mb-2">
          Your Message
        </label>
        <textarea
          id="message"
          {...register("message")}
          rows={4}
          className="w-full bg-transparent border-0 border-b-2 border-border focus:border-primary focus:outline-none text-foreground text-lg transition-colors resize-none"
          placeholder="Tell us about your real estate goals..."
        />
        {errors.message && (
          <p className="text-sm text-red-500 mt-2">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={submitLead.isPending}
        className="border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all px-12 h-14 text-sm uppercase tracking-widest"
      >
        {submitLead.isPending ? "Sending..." : "Send Message"}
      </Button>
    </motion.form>
  );
};

export default ContactForm;

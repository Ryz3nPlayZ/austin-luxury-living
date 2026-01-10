import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitLead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";

const requestShowingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  message: z.string().optional(),
});

type RequestShowingFormData = z.infer<typeof requestShowingSchema>;

interface RequestShowingModalProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
}

export const RequestShowingModal = ({
  open,
  onClose,
  propertyId,
  propertyTitle,
}: RequestShowingModalProps) => {
  const submitLead = useSubmitLead();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestShowingFormData>({
    resolver: zodResolver(requestShowingSchema),
  });

  const onSubmit = async (data: RequestShowingFormData) => {
    try {
      await submitLead.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: `Requesting showing for: ${propertyTitle}${data.message ? `\n\nAdditional message: ${data.message}` : ""}`,
        property_id: propertyId,
      });

      toast({
        title: "Request Sent!",
        description: "We'll contact you within 24 hours to schedule your showing.",
      });

      reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Private Showing</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">{propertyTitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="John Doe"
              className="mt-1.5"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              className="mt-1.5"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="(512) 555-0123"
              className="mt-1.5"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Preferred showing times, questions, etc..."
              className="mt-1.5"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitLead.isPending}
              className="flex-1"
            >
              {submitLead.isPending ? "Sending..." : "Request Showing"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

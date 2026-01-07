import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  property_id: string | null;
  created_at: string;
  properties?: {
    title: string;
    address: string;
  } | null;
}

export const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select(`
          *,
          properties (
            title,
            address
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load leads",
          variant: "destructive",
        });
      } else {
        setLeads(data || []);
      }
      setIsLoading(false);
    };

    fetchLeads();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-lg">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No inquiries yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Leads will appear here when visitors submit the contact form
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-6">
        {leads.length} {leads.length === 1 ? "inquiry" : "inquiries"}
      </p>

      {leads.map((lead) => (
        <div
          key={lead.id}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-display text-xl text-foreground">{lead.name}</h3>
              {lead.properties && (
                <p className="text-sm text-primary mt-1">
                  Interested in: {lead.properties.title}
                </p>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(lead.created_at), "MMM d, yyyy 'at' h:mm a")}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center text-sm text-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              {lead.email}
            </a>
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center text-sm text-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                {lead.phone}
              </a>
            )}
          </div>

          {lead.message && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {lead.message}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

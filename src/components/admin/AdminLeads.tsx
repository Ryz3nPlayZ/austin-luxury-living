import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchAllLeads } from "@/lib/services/leadService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Phone, Calendar, MessageSquare, Trash2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

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
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLeads = async () => {
    setIsLoading(true);

    try {
      // Try using the service layer first (should handle RLS properly)
      const serviceLeads = await fetchAllLeads();
      setLeads(serviceLeads);
    } catch (serviceError) {
      console.warn("Service layer failed, trying direct query:", serviceError);

      // Fallback: Direct query with simplified select
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, email, phone, message, property_id, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load leads",
          variant: "destructive",
        });
        console.error("Direct query failed:", error);
        setLeads([]);
      } else {
        setLeads(data || []);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
      fetchLeads();
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

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
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          {leads.length} {leads.length === 1 ? "lead" : "leads"}
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Property Interest</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <a
                      href={`mailto:${lead.email}`}
                      className="flex items-center text-sm hover:text-primary transition-colors"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      {lead.email}
                    </a>
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        {lead.phone}
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {lead.properties ? (
                    <Badge variant="secondary" className="text-xs">
                      {lead.properties.title}
                    </Badge>
                  ) : lead.name === "Home Valuation Request" ? (
                    <Badge variant="outline" className="text-xs border-primary text-primary">
                      Valuation Request
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">General Inquiry</span>
                  )}
                </TableCell>
                <TableCell>
                  {lead.message ? (
                    <div className="max-w-xs">
                      <p className={`text-sm text-muted-foreground ${expandedMessage === lead.id ? "" : "truncate"}`}>
                        {lead.message}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedMessage(expandedMessage === lead.id ? null : lead.id)}
                        className="h-auto p-0 mt-1 text-xs"
                      >
                        {expandedMessage === lead.id ? (
                          <><EyeOff className="h-3 w-3 mr-1" /> Show less</>
                        ) : (
                          <><Eye className="h-3 w-3 mr-1" /> Show more</>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(lead.created_at), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(lead.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this lead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

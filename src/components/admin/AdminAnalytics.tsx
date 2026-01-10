import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Users, Home, Eye, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays, startOfDay } from "date-fns";

interface AnalyticsStats {
  totalLeads: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  totalProperties: number;
  activeProperties: number;
  pocketListings: number;
  leadsBySource: {
    valuation: number;
    contact: number;
    property_showing: number;
  };
  recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    created_at: string;
    property_id: string | null;
  }>;
}

export const AdminAnalytics = () => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>("7");
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const daysAgo = parseInt(timeRange);
      const dateThreshold = startOfDay(subDays(new Date(), daysAgo));

      // Fetch total leads
      const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

      // Fetch leads this week
      const { count: leadsThisWeek } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfDay(subDays(new Date(), 7)).toISOString());

      // Fetch leads this month
      const { count: leadsThisMonth } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfDay(subDays(new Date(), 30)).toISOString());

      // Fetch properties stats
      const { count: totalProperties } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true });

      const { count: activeProperties } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("status", "Active");

      const { count: pocketListings } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("is_pocket_listing", true);

      // Fetch leads by source (based on property_id and message content)
      const { data: allLeads } = await supabase
        .from("leads")
        .select("*")
        .gte("created_at", dateThreshold.toISOString());

      let valuationCount = 0;
      let contactCount = 0;
      let propertyShowingCount = 0;

      allLeads?.forEach((lead) => {
        const message = lead.message?.toLowerCase() || "";
        const name = lead.name?.toLowerCase() || "";
        if (name.includes("valuation") || message.includes("valuation") || message.includes("home value")) {
          valuationCount++;
        } else if (lead.property_id) {
          propertyShowingCount++;
        } else {
          contactCount++;
        }
      });

      // Fetch recent leads
      const { data: recentLeads } = await supabase
        .from("leads")
        .select("id, name, email, created_at, property_id")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalLeads: totalLeads || 0,
        leadsThisWeek: leadsThisWeek || 0,
        leadsThisMonth: leadsThisMonth || 0,
        totalProperties: totalProperties || 0,
        activeProperties: activeProperties || 0,
        pocketListings: pocketListings || 0,
        leadsBySource: {
          valuation: valuationCount,
          contact: contactCount,
          property_showing: propertyShowingCount,
        },
        recentLeads: recentLeads || [],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.leadsThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leadsThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProperties}</div>
            <p className="text-xs text-muted-foreground mt-1">
              of {stats.totalProperties} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pocket Listings</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pocketListings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Exclusive properties
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lead Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Sources</CardTitle>
          <CardDescription>
            Breakdown of leads by source in the last {timeRange} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Valuation Requests</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{stats.leadsBySource.valuation}</span>
                <span className="text-sm text-muted-foreground">
                  ({Math.round((stats.leadsBySource.valuation / (stats.leadsBySource.valuation + stats.leadsBySource.contact + stats.leadsBySource.property_showing || 1)) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Property Showings</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{stats.leadsBySource.property_showing}</span>
                <span className="text-sm text-muted-foreground">
                  ({Math.round((stats.leadsBySource.property_showing / (stats.leadsBySource.valuation + stats.leadsBySource.contact + stats.leadsBySource.property_showing || 1)) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">General Contact</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{stats.leadsBySource.contact}</span>
                <span className="text-sm text-muted-foreground">
                  ({Math.round((stats.leadsBySource.contact / (stats.leadsBySource.valuation + stats.leadsBySource.contact + stats.leadsBySource.property_showing || 1)) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Latest 5 inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentLeads.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No leads yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(lead.created_at), "MMM d")}
                    </div>
                    {lead.property_id && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        Property Inquiry
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

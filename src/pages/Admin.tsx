import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Building2, Users, Settings, LogOut, Menu, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminProperties } from "@/components/admin/AdminProperties";
import { AdminLeads } from "@/components/admin/AdminLeads";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";

type TabType = "properties" | "leads" | "analytics" | "settings";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("properties");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (!session) {
        navigate("/login");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const tabs = [
    { id: "properties" as TabType, label: "Properties", icon: Building2 },
    { id: "leads" as TabType, label: "Leads", icon: Users },
    { id: "analytics" as TabType, label: "Analytics", icon: BarChart3 },
    { id: "settings" as TabType, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            {sidebarOpen && (
              <span className="font-display text-xl text-foreground">Admin</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <tab.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{tab.label}</span>}
              </button>
            ))}
          </nav>

          {/* User Info & Sign Out */}
          <div className="p-4 border-t border-border">
            {sidebarOpen && (
              <p className="text-xs text-muted-foreground mb-3 truncate">
                {user?.email}
              </p>
            )}
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                sidebarOpen ? "w-full justify-start" : "w-full justify-center"
              )}
            >
              <LogOut className="h-4 w-4" />
              {sidebarOpen && <span className="ml-2">Sign Out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <div className="p-8">
          <header className="mb-8">
            <h1 className="font-display text-3xl text-foreground">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
          </header>

          {activeTab === "properties" && <AdminProperties />}
          {activeTab === "analytics" && <AdminAnalytics />}
          {activeTab === "leads" && <AdminLeads />}
          {activeTab === "settings" && <AdminSettings user={user} />}
        </div>
      </main>
    </div>
  );
};

export default Admin;

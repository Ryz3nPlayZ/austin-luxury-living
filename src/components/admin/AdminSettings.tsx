import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface AdminSettingsProps {
  user: User | null;
}

export const AdminSettings = ({ user }: AdminSettingsProps) => {
  return (
    <div className="max-w-2xl">
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="font-display text-xl mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-foreground">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="text-foreground text-sm font-mono">{user?.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Sign In</p>
            <p className="text-foreground">
              {user?.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="font-display text-xl mb-4">Quick Links</h2>
        <div className="space-y-3">
          <a
            href="https://supabase.com/dashboard/project/dunecyusauwafguvksjl"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <span className="text-foreground">Supabase Dashboard</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
          <a
            href="https://supabase.com/dashboard/project/dunecyusauwafguvksjl/storage/buckets/property-images"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <span className="text-foreground">Image Storage</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
          <a
            href="https://supabase.com/dashboard/project/dunecyusauwafguvksjl/auth/users"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <span className="text-foreground">Manage Users</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> To speed up testing, you can disable "Confirm email" in your{" "}
          <a
            href="https://supabase.com/dashboard/project/dunecyusauwafguvksjl/auth/providers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Supabase Auth settings
          </a>
          .
        </p>
      </div>
    </div>
  );
};

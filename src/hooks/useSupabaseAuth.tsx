import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'customer';

export interface UserProfile {
  id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session ?? null);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Only fetch profile if database migration has been run
        // For now, assume all authenticated users are admins until migration is applied
        setUserProfile({
          id: session.user.id,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setIsLoadingProfile(false);
      } else {
        setUserProfile(null);
        setIsLoadingProfile(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        // Only fetch profile if database migration has been run
        // For now, assume all authenticated users are admins until migration is applied
        setUserProfile({
          id: newSession.user.id,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setIsLoadingProfile(false);
      } else {
        setUserProfile(null);
        setIsLoadingProfile(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    // Skip profile fetching until database is properly set up
    // This prevents app crashes when the user_profiles table doesn't exist yet
    setIsLoadingProfile(false);
    setUserProfile({
      id: userId,
      role: 'admin', // Default to admin for backward compatibility
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  const signInWithOtp = (email: string) => supabase.auth.signInWithOtp({ email });
  const signOut = () => supabase.auth.signOut();

  const isAdmin = userProfile?.role === 'admin';
  const isCustomer = userProfile?.role === 'customer';
  const isAuthenticated = !!session && !!user;

  return {
    session,
    user,
    userProfile,
    isLoadingProfile,
    isAdmin,
    isCustomer,
    isAuthenticated,
    signInWithOtp,
    signOut
  };
}

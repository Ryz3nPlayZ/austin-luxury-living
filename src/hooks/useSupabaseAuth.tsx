import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
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
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        fetchUserProfile(newSession.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    setIsLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // For backward compatibility, assume admin if profile doesn't exist
        setUserProfile({
          id: userId,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUserProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
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

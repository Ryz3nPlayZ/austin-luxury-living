import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session ?? null);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithOtp = (email: string) => supabase.auth.signInWithOtp({ email });
  const signOut = () => supabase.auth.signOut();

  return { session, user, signInWithOtp, signOut };
}

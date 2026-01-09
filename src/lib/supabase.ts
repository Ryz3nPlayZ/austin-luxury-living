import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  // Warn in dev if env vars are missing
  console.warn("VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set");
}

export const supabase = createClient(url, anonKey);

export default supabase;

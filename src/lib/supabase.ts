import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";
import type { Database } from "@/types/database.types";

export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export type { Database } from "@/types/database.types";

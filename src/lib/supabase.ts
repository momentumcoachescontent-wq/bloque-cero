import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Critical Warning: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Las variables de entorno son requeridas en Lovable y Render."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder-key", 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          whatsapp: string | null;
          role: "admin" | "client";
          is_premium: boolean;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      leads: {
        Row: {
          id: string;
          email: string;
          name: string;
          whatsapp: string | null;
          diagnostic_answers: Record<string, unknown> | null;
          status: "new" | "contacted" | "qualified" | "converted" | "lost";
          score: number | null;
          notes: string | null;
          converted_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["leads"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
      };
      projects: {
        Row: {
          id: string;
          client_id: string;
          bloque_number: number;
          bloque_name: string;
          status: "pending" | "in_progress" | "delivered" | "cancelled";
          entregable_url: string | null;
          notes: string | null;
          started_at: string | null;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      payments: {
        Row: {
          id: string;
          project_id: string;
          amount: number;
          currency: string;
          provider: "stripe" | "mercadopago" | "manual";
          provider_ref: string | null;
          status: "pending" | "completed" | "failed" | "refunded";
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};

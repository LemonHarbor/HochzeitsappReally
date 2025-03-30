import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Typed queries for guests
export const guestsQuery = {
  getAll: () => supabase.from("guests").select("*"),
  getById: (id: string) =>
    supabase.from("guests").select("*").eq("id", id).single(),
  create: (data: Partial<Database['public']['Tables']['guests']['Insert']>) => supabase.from("guests").insert(data).select(),
  update: (id: string, data: Partial<Database['public']['Tables']['guests']['Update']>) =>
    supabase.from("guests").update(data).eq("id", id).select(),
  delete: (id: string) => supabase.from("guests").delete().eq("id", id),
  getByRsvpStatus: (status: string) =>
    supabase.from("guests").select("*").eq("rsvp_status", status),
};

// Typed queries for tables
export const tablesQuery = {
  getAll: () => supabase.from("tables").select("*"),
  getById: (id: string) =>
    supabase.from("tables").select("*").eq("id", id).single(),
  create: (data: Partial<Database['public']['Tables']['tables']['Insert']>) => supabase.from("tables").insert(data).select(),
  update: (id: string, data: Partial<Database['public']['Tables']['tables']['Update']>) =>
    supabase.from("tables").update(data).eq("id", id).select(),
  delete: (id: string) => supabase.from("tables").delete().eq("id", id),
  updatePosition: (id: string, position: Database['public']['Tables']['tables']['Row']['position'], rotation: number) =>
    supabase
      .from("tables")
      .update({ position, rotation, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(),
};

// Typed queries for seats
export const seatsQuery = {
  getAll: () => supabase.from("seats").select("*"),
  getByTableId: (tableId: string) =>
    supabase.from("seats").select("*").eq("table_id", tableId),
  create: (data: Partial<Database['public']['Tables']['seats']['Insert']>) => supabase.from("seats").insert(data).select(),
  update: (id: string, data: Partial<Database['public']['Tables']['seats']['Update']>) =>
    supabase.from("seats").update(data).eq("id", id).select(),
  delete: (id: string) => supabase.from("seats").delete().eq("id", id),
  assignGuest: (id: string, guestId: string) =>
    supabase
      .from("seats")
      .update({ guest_id: guestId, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(),
  removeGuest: (id: string) =>
    supabase
      .from("seats")
      .update({ guest_id: null, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(),
};

// Type definitions for music service
export interface SongRequest {
  id: string;
  title: string;
  artist: string;
  guest_id: string | null;
  guest_name: string;
  notes: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string | null;
  updated_at: string | null;
  guests?: {
    name: string;
  };
}

// Service functions
import { supabase } from "@/lib/supabase";

// Get all song requests
export async function getSongRequests(): Promise<SongRequest[]> {
  try {
    const { data, error } = await supabase
      .from("song_requests")
      .select(`
        *,
        guests (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform the data to match the SongRequest interface
    return data.map(item => ({
      ...item,
      status: (item.status || "pending") as "pending" | "approved" | "rejected"
    })) as SongRequest[];
  } catch (error) {
    console.error("Error fetching song requests:", error);
    return [];
  }
}

// Get song requests by guest ID
export async function getSongRequestsByGuest(
  guestId: string
): Promise<SongRequest[]> {
  try {
    const { data, error } = await supabase
      .from("song_requests")
      .select(`
        *,
        guests (
          name
        )
      `)
      .eq("guest_id", guestId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform the data to match the SongRequest interface
    return data.map(item => ({
      ...item,
      status: (item.status || "pending") as "pending" | "approved" | "rejected"
    })) as SongRequest[];
  } catch (error) {
    console.error("Error fetching song requests by guest:", error);
    return [];
  }
}

// Create a new song request
export async function createSongRequest(
  request: Omit<SongRequest, "id" | "created_at" | "updated_at">
): Promise<SongRequest> {
  try {
    const { data, error } = await supabase
      .from("song_requests")
      .insert([
        {
          ...request,
          status: request.status || "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select(`
        *,
        guests (
          name
        )
      `)
      .single();

    if (error) throw error;

    // Transform the data to match the SongRequest interface
    return {
      ...data,
      status: (data.status || "pending") as "pending" | "approved" | "rejected"
    } as SongRequest;
  } catch (error) {
    console.error("Error creating song request:", error);
    throw error;
  }
}

// Update a song request
export async function updateSongRequest(
  requestId: string,
  updates: Partial<SongRequest>
): Promise<SongRequest> {
  try {
    const { data, error } = await supabase
      .from("song_requests")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .select(`
        *,
        guests (
          name
        )
      `)
      .single();

    if (error) throw error;

    // Transform the data to match the SongRequest interface
    return {
      ...data,
      status: (data.status || "pending") as "pending" | "approved" | "rejected"
    } as SongRequest;
  } catch (error) {
    console.error("Error updating song request:", error);
    throw error;
  }
}

// Delete a song request
export async function deleteSongRequest(requestId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("song_requests")
      .delete()
      .eq("id", requestId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting song request:", error);
    throw error;
  }
}

export default {
  getSongRequests,
  getSongRequestsByGuest,
  createSongRequest,
  updateSongRequest,
  deleteSongRequest,
};

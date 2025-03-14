import { supabase } from "./supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

// Types for our realtime data
export interface RealtimeGuest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  rsvp_status: string;
  dietary_restrictions?: string;
  plus_one: boolean;
  notes?: string;
}

export interface RealtimeTable {
  id: string;
  name: string;
  shape: "round" | "rectangle" | "custom";
  capacity: number;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  rotation: number;
}

export interface RealtimeSeat {
  id: string;
  table_id: string;
  guest_id?: string;
  position: { x: number; y: number };
}

// Subscription types
type SubscriptionCallback<T> = (payload: { new: T; old: T | null }) => void;

// Singleton class to manage Supabase realtime subscriptions
class RealtimeManager {
  private guestsChannel: RealtimeChannel | null = null;
  private tablesChannel: RealtimeChannel | null = null;
  private seatsChannel: RealtimeChannel | null = null;

  // Subscribe to guests changes
  subscribeToGuests(callback: SubscriptionCallback<RealtimeGuest>) {
    if (this.guestsChannel) {
      this.guestsChannel.unsubscribe();
    }

    this.guestsChannel = supabase
      .channel("guests-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guests" },
        (payload) => {
          callback(payload as any);
        },
      )
      .subscribe();

    return () => {
      if (this.guestsChannel) {
        this.guestsChannel.unsubscribe();
        this.guestsChannel = null;
      }
    };
  }

  // Subscribe to tables changes
  subscribeToTables(callback: SubscriptionCallback<RealtimeTable>) {
    if (this.tablesChannel) {
      this.tablesChannel.unsubscribe();
    }

    this.tablesChannel = supabase
      .channel("tables-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tables" },
        (payload) => {
          callback(payload as any);
        },
      )
      .subscribe();

    return () => {
      if (this.tablesChannel) {
        this.tablesChannel.unsubscribe();
        this.tablesChannel = null;
      }
    };
  }

  // Subscribe to seats changes
  subscribeToSeats(callback: SubscriptionCallback<RealtimeSeat>) {
    if (this.seatsChannel) {
      this.seatsChannel.unsubscribe();
    }

    this.seatsChannel = supabase
      .channel("seats-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "seats" },
        (payload) => {
          callback(payload as any);
        },
      )
      .subscribe();

    return () => {
      if (this.seatsChannel) {
        this.seatsChannel.unsubscribe();
        this.seatsChannel = null;
      }
    };
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    if (this.guestsChannel) {
      this.guestsChannel.unsubscribe();
      this.guestsChannel = null;
    }
    if (this.tablesChannel) {
      this.tablesChannel.unsubscribe();
      this.tablesChannel = null;
    }
    if (this.seatsChannel) {
      this.seatsChannel.unsubscribe();
      this.seatsChannel = null;
    }
  }
}

export const realtimeManager = new RealtimeManager();

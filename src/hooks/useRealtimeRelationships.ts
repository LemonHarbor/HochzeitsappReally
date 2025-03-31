import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { GuestRelationship } from "../types/relationship";

export const useRealtimeRelationships = (guestId: string) => {
  const [relationships, setRelationships] = useState<GuestRelationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial relationships
    const loadRelationships = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from("guest_relationships")
          .select("*")
          .or(`guest_id.eq.${guestId},related_guest_id.eq.${guestId}`);

        if (fetchError) throw fetchError;
        
        // Cast the data to ensure TypeScript compatibility
        setRelationships(data as GuestRelationship[]);
      } catch (err) {
        console.error("Error loading relationships:", err);
        setError("Failed to load relationships");
      } finally {
        setIsLoading(false);
      }
    };

    loadRelationships();

    // Set up realtime subscription
    const subscription = supabase
      .channel("guest_relationships_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guest_relationships",
          filter: `guest_id=eq.${guestId}`,
        },
        (payload) => {
          const newRecord = payload.new as GuestRelationship;
          setRelationships((prev) => [...prev, newRecord]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guest_relationships",
          filter: `related_guest_id=eq.${guestId}`,
        },
        (payload) => {
          const newRecord = payload.new as GuestRelationship;
          // Only add if not already added from the other subscription
          if (
            newRecord.guest_id !== guestId &&
            newRecord.related_guest_id !== guestId
          ) {
            setRelationships((prev) => [...prev, newRecord]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "guest_relationships",
          filter: `guest_id=eq.${guestId}`,
        },
        (payload) => {
          const updatedRecord = payload.new as GuestRelationship;
          setRelationships((prev) =>
            prev.map((rel) =>
              rel.id === updatedRecord.id ? updatedRecord : rel
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "guest_relationships",
          filter: `related_guest_id=eq.${guestId}`,
        },
        (payload) => {
          const updatedRecord = payload.new as GuestRelationship;
          setRelationships((prev) =>
            prev.map((rel) =>
              rel.id === updatedRecord.id ? updatedRecord : rel
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "guest_relationships",
          filter: `guest_id=eq.${guestId}`,
        },
        (payload) => {
          const deletedId = payload.old.id;
          setRelationships((prev) =>
            prev.filter((rel) => rel.id !== deletedId)
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "guest_relationships",
          filter: `related_guest_id=eq.${guestId}`,
        },
        (payload) => {
          const deletedId = payload.old.id;
          setRelationships((prev) =>
            prev.filter((rel) => rel.id !== deletedId)
          );
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [guestId]);

  return { relationships, isLoading, error };
};

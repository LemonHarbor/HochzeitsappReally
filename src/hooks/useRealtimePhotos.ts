import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { PhotoComment, PhotoLike } from "../types/photo";

export const useRealtimePhotos = (photoId: string, guestId: string) => {
  const [comments, setComments] = useState<PhotoComment[]>([]);
  const [likes, setLikes] = useState<PhotoLike[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial comments and likes
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from("photo_comments")
          .select("*, guests(name)")
          .eq("photo_id", photoId)
          .order("created_at", { ascending: true });

        if (commentsError) throw commentsError;

        // Format comments with guest names
        const formattedComments = commentsData.map((comment) => ({
          ...comment,
          guest_name: comment.guests?.name || "Unknown Guest",
        })) as PhotoComment[];

        setComments(formattedComments);

        // Fetch likes
        const { data: likesData, error: likesError } = await supabase
          .from("photo_likes")
          .select("*")
          .eq("photo_id", photoId);

        if (likesError) throw likesError;
        setLikes(likesData as PhotoLike[]);
      } catch (err) {
        console.error("Error loading photo data:", err);
        setError("Failed to load comments and likes");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Set up realtime subscriptions
    const commentsSubscription = supabase
      .channel("photo_comments_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "photo_comments",
          filter: `photo_id=eq.${photoId}`,
        },
        async (payload) => {
          const newRecord = payload.new as PhotoComment;
          
          // Fetch guest name
          try {
            const { data: guestData, error: guestError } = await supabase
              .from("guests")
              .select("name")
              .eq("id", newRecord.guest_id)
              .single();

            if (!guestError && guestData) {
              setComments((prev) => [
                ...prev,
                { ...newRecord, guest_name: guestData.name } as PhotoComment,
              ]);
            } else {
              setComments((prev) => [
                ...prev,
                { ...newRecord, guest_name: "Unknown Guest" } as PhotoComment,
              ]);
            }
          } catch (err) {
            setComments((prev) => [
              ...prev,
              { ...newRecord, guest_name: "Unknown Guest" } as PhotoComment,
            ]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "photo_comments",
          filter: `photo_id=eq.${photoId}`,
        },
        (payload) => {
          const updatedRecord = payload.new as PhotoComment;
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === updatedRecord.id
                ? { ...updatedRecord, guest_name: comment.guest_name } as PhotoComment
                : comment
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "photo_comments",
          filter: `photo_id=eq.${photoId}`,
        },
        (payload) => {
          const deletedId = payload.old.id;
          setComments((prev) => prev.filter((comment) => comment.id !== deletedId));
        }
      )
      .subscribe();

    const likesSubscription = supabase
      .channel("photo_likes_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "photo_likes",
          filter: `photo_id=eq.${photoId}`,
        },
        (payload) => {
          const newRecord = payload.new as PhotoLike;
          setLikes((prev) => [...prev, newRecord]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "photo_likes",
          filter: `photo_id=eq.${photoId}`,
        },
        (payload) => {
          const deletedId = payload.old.id;
          setLikes((prev) => prev.filter((like) => like.id !== deletedId));
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(commentsSubscription);
      supabase.removeChannel(likesSubscription);
    };
  }, [photoId, guestId]);

  // Add a comment
  const addComment = async (content: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("photo_comments").insert([
        {
          photo_id: photoId,
          guest_id: guestId,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment");
      return false;
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("photo_comments")
        .delete()
        .eq("id", commentId)
        .eq("guest_id", guestId); // Ensure only the author can delete

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Failed to delete comment");
      return false;
    }
  };

  // Toggle like
  const toggleLike = async (): Promise<boolean> => {
    try {
      // Check if already liked
      const existingLike = likes.find((like) => like.guest_id === guestId);

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from("photo_likes")
          .delete()
          .eq("id", existingLike.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase.from("photo_likes").insert([
          {
            photo_id: photoId,
            guest_id: guestId,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
      }

      return true;
    } catch (err) {
      console.error("Error toggling like:", err);
      setError("Failed to update like");
      return false;
    }
  };

  const hasLiked = likes.some((like) => like.guest_id === guestId);

  return {
    comments,
    likes,
    isLoading,
    error,
    addComment,
    deleteComment,
    toggleLike,
    hasLiked,
  };
};

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Photo, PhotoComment, PhotoLike } from "../types/photo";

// Hook to get all photos
export const useRealtimePhotos = (guestId?: string) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Load initial photos
    const loadPhotos = async () => {
      setIsLoading(true);
      try {
        const query = supabase
          .from("photos")
          .select("*, guests(name)")
          .order("created_at", { ascending: false });

        // Filter by guest ID if provided
        const { data, error: photosError } = guestId 
          ? await query.eq("guest_id", guestId)
          : await query;

        if (photosError) throw photosError;

        // Format photos with guest names
        const formattedPhotos = data.map((photo) => ({
          ...photo,
          guest_name: photo.guests?.name || "Unknown Guest",
        })) as Photo[];

        setPhotos(formattedPhotos);
      } catch (err) {
        console.error("Error loading photos:", err);
        setError(err instanceof Error ? err : new Error("Failed to load photos"));
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();

    // Set up realtime subscription
    const photosSubscription = supabase
      .channel("photos_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "photos",
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newPhoto = payload.new as Photo;
            
            // Only add if it matches the filter
            if (!guestId || newPhoto.guest_id === guestId) {
              // Fetch guest name
              try {
                const { data: guestData, error: guestError } = await supabase
                  .from("guests")
                  .select("name")
                  .eq("id", newPhoto.guest_id)
                  .single();

                if (!guestError && guestData) {
                  setPhotos((prev) => [
                    { ...newPhoto, guest_name: guestData.name } as Photo,
                    ...prev,
                  ]);
                } else {
                  setPhotos((prev) => [
                    { ...newPhoto, guest_name: "Unknown Guest" } as Photo,
                    ...prev,
                  ]);
                }
              } catch (err) {
                setPhotos((prev) => [
                  { ...newPhoto, guest_name: "Unknown Guest" } as Photo,
                  ...prev,
                ]);
              }
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedPhoto = payload.new as Photo;
            setPhotos((prev) =>
              prev.map((photo) =>
                photo.id === updatedPhoto.id
                  ? { ...updatedPhoto, guest_name: photo.guest_name }
                  : photo
              )
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            setPhotos((prev) => prev.filter((photo) => photo.id !== deletedId));
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(photosSubscription);
    };
  }, [guestId]);

  return {
    data: photos,
    isLoading,
    error,
    photos, // For backward compatibility
    loading: isLoading // For backward compatibility
  };
};

// Hook to get comments for a specific photo
export const useRealtimePhotoComments = (photoId: string) => {
  const [comments, setComments] = useState<PhotoComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Load initial comments
    const loadComments = async () => {
      setLoading(true);
      try {
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
      } catch (err) {
        console.error("Error loading photo comments:", err);
        setError(err instanceof Error ? err : new Error("Failed to load comments"));
      } finally {
        setLoading(false);
      }
    };

    loadComments();

    // Set up realtime subscription
    const commentsSubscription = supabase
      .channel("photo_comments_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "photo_comments",
          filter: `photo_id=eq.${photoId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newComment = payload.new as PhotoComment;
            
            // Fetch guest name
            try {
              const { data: guestData, error: guestError } = await supabase
                .from("guests")
                .select("name")
                .eq("id", newComment.guest_id)
                .single();

              if (!guestError && guestData) {
                setComments((prev) => [
                  ...prev,
                  { ...newComment, guest_name: guestData.name } as PhotoComment,
                ]);
              } else {
                setComments((prev) => [
                  ...prev,
                  { ...newComment, guest_name: "Unknown Guest" } as PhotoComment,
                ]);
              }
            } catch (err) {
              setComments((prev) => [
                ...prev,
                { ...newComment, guest_name: "Unknown Guest" } as PhotoComment,
              ]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedComment = payload.new as PhotoComment;
            setComments((prev) =>
              prev.map((comment) =>
                comment.id === updatedComment.id
                  ? { ...updatedComment, guest_name: comment.guest_name }
                  : comment
              )
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            setComments((prev) => prev.filter((comment) => comment.id !== deletedId));
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(commentsSubscription);
    };
  }, [photoId]);

  return {
    comments,
    loading,
    error
  };
};

// Hook to get likes for a specific photo
export const useRealtimePhotoLikes = (photoId: string, currentGuestId?: string) => {
  const [likes, setLikes] = useState<PhotoLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Load initial likes
    const loadLikes = async () => {
      setLoading(true);
      try {
        const { data: likesData, error: likesError } = await supabase
          .from("photo_likes")
          .select("*")
          .eq("photo_id", photoId);

        if (likesError) throw likesError;
        setLikes(likesData as PhotoLike[]);
      } catch (err) {
        console.error("Error loading photo likes:", err);
        setError(err instanceof Error ? err : new Error("Failed to load likes"));
      } finally {
        setLoading(false);
      }
    };

    loadLikes();

    // Set up realtime subscription
    const likesSubscription = supabase
      .channel("photo_likes_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "photo_likes",
          filter: `photo_id=eq.${photoId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newLike = payload.new as PhotoLike;
            setLikes((prev) => [...prev, newLike]);
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            setLikes((prev) => prev.filter((like) => like.id !== deletedId));
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(likesSubscription);
    };
  }, [photoId]);

  // Check if current guest has liked
  const hasLiked = currentGuestId 
    ? likes.some((like) => like.guest_id === currentGuestId)
    : false;

  return {
    likes,
    likesCount: likes.length,
    hasLiked,
    loading,
    error
  };
};

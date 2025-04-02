import { supabase } from "../lib/supabase";
import { 
  WeddingHomepage, 
  WeddingSection, 
  WeddingEvent, 
  WeddingPhoto,
  WeddingGift,
  WeddingGuestbookEntry,
  WeddingAccommodation,
  WeddingFAQ,
  WeddingRSVP,
  WeddingTheme
} from "../types/wedding-homepage";

// Wedding Homepage Services
export const createWeddingHomepage = async (data: Omit<WeddingHomepage, "id" | "created_at" | "updated_at">): Promise<WeddingHomepage> => {
  try {
    const { data: newHomepage, error } = await supabase
      .from("wedding_homepages")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newHomepage as WeddingHomepage;
  } catch (error) {
    console.error("Error creating wedding homepage:", error);
    throw error;
  }
};

export const getWeddingHomepageById = async (id: string): Promise<WeddingHomepage> => {
  try {
    const { data, error } = await supabase
      .from("wedding_homepages")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data as WeddingHomepage;
  } catch (error) {
    console.error("Error fetching wedding homepage:", error);
    throw error;
  }
};

export const getWeddingHomepageByUserId = async (userId: string): Promise<WeddingHomepage | null> => {
  try {
    const { data, error } = await supabase
      .from("wedding_homepages")
      .select("*")
      .eq("user_id", userId)
      .single();
      
    if (error) {
      if (error.code === "PGRST116") {
        // No homepage found for this user
        return null;
      }
      throw error;
    }
    return data as WeddingHomepage;
  } catch (error) {
    console.error("Error fetching wedding homepage by user ID:", error);
    throw error;
  }
};

export const updateWeddingHomepage = async (id: string, updates: Partial<WeddingHomepage>): Promise<WeddingHomepage> => {
  try {
    const { data, error } = await supabase
      .from("wedding_homepages")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data as WeddingHomepage;
  } catch (error) {
    console.error("Error updating wedding homepage:", error);
    throw error;
  }
};

export const deleteWeddingHomepage = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("wedding_homepages")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting wedding homepage:", error);
    throw error;
  }
};

// Wedding Section Services
export const createWeddingSection = async (data: Omit<WeddingSection, "id" | "created_at" | "updated_at">): Promise<WeddingSection> => {
  try {
    const { data: newSection, error } = await supabase
      .from("wedding_sections")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newSection as WeddingSection;
  } catch (error) {
    console.error("Error creating wedding section:", error);
    throw error;
  }
};

export const getWeddingSectionsByHomepageId = async (homepageId: string): Promise<WeddingSection[]> => {
  try {
    const { data, error } = await supabase
      .from("wedding_sections")
      .select("*")
      .eq("homepage_id", homepageId)
      .order("order", { ascending: true });
      
    if (error) throw error;
    return data as WeddingSection[] || [];
  } catch (error) {
    console.error("Error fetching wedding sections:", error);
    throw error;
  }
};

export const updateWeddingSection = async (id: string, updates: Partial<WeddingSection>): Promise<WeddingSection> => {
  try {
    const { data, error } = await supabase
      .from("wedding_sections")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data as WeddingSection;
  } catch (error) {
    console.error("Error updating wedding section:", error);
    throw error;
  }
};

export const deleteWeddingSection = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("wedding_sections")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting wedding section:", error);
    throw error;
  }
};

// Wedding Event Services
export const createWeddingEvent = async (data: Omit<WeddingEvent, "id" | "created_at" | "updated_at">): Promise<WeddingEvent> => {
  try {
    const { data: newEvent, error } = await supabase
      .from("wedding_events")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newEvent as WeddingEvent;
  } catch (error) {
    console.error("Error creating wedding event:", error);
    throw error;
  }
};

export const getWeddingEventsByHomepageId = async (homepageId: string): Promise<WeddingEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("wedding_events")
      .select("*")
      .eq("homepage_id", homepageId)
      .order("date", { ascending: true });
      
    if (error) throw error;
    return data as WeddingEvent[] || [];
  } catch (error) {
    console.error("Error fetching wedding events:", error);
    throw error;
  }
};

export const updateWeddingEvent = async (id: string, updates: Partial<WeddingEvent>): Promise<WeddingEvent> => {
  try {
    const { data, error } = await supabase
      .from("wedding_events")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data as WeddingEvent;
  } catch (error) {
    console.error("Error updating wedding event:", error);
    throw error;
  }
};

export const deleteWeddingEvent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("wedding_events")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting wedding event:", error);
    throw error;
  }
};

// Wedding Photo Services
export const createWeddingPhoto = async (data: Omit<WeddingPhoto, "id" | "created_at" | "updated_at">, file: File): Promise<WeddingPhoto> => {
  try {
    // Upload the photo to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `wedding-photos/${data.homepage_id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
      
    // Create a thumbnail (in a real app, you might use a serverless function for this)
    // For now, we'll just use the same URL
    const thumbnailUrl = urlData.publicUrl;
    
    // Save the photo record
    const { data: newPhoto, error } = await supabase
      .from("wedding_photos")
      .insert({
        ...data,
        url: urlData.publicUrl,
        thumbnail_url: thumbnailUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newPhoto as WeddingPhoto;
  } catch (error) {
    console.error("Error creating wedding photo:", error);
    throw error;
  }
};

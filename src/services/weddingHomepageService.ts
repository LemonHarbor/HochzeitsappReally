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
    return newHomepage;
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
    return data;
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
    return data;
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
    return data;
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
    return newSection;
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
    return data || [];
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
    return data;
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
    return newEvent;
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
    return data || [];
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
    return data;
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
    return newPhoto;
  } catch (error) {
    console.error("Error creating wedding photo:", error);
    throw error;
  }
};

export const getWeddingPhotosByHomepageId = async (homepageId: string): Promise<WeddingPhoto[]> => {
  try {
    const { data, error } = await supabase
      .from("wedding_photos")
      .select("*")
      .eq("homepage_id", homepageId)
      .order("order", { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching wedding photos:", error);
    throw error;
  }
};

export const updateWeddingPhoto = async (id: string, updates: Partial<WeddingPhoto>): Promise<WeddingPhoto> => {
  try {
    const { data, error } = await supabase
      .from("wedding_photos")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating wedding photo:", error);
    throw error;
  }
};

export const deleteWeddingPhoto = async (id: string): Promise<boolean> => {
  try {
    // Get the photo to delete the file from storage
    const { data: photo, error: fetchError } = await supabase
      .from("wedding_photos")
      .select("url")
      .eq("id", id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Extract the path from the URL
    const urlParts = photo.url.split('/');
    const filePath = urlParts.slice(urlParts.indexOf('images') + 1).join('/');
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('images')
      .remove([filePath]);
      
    if (storageError) throw storageError;
    
    // Delete the record
    const { error } = await supabase
      .from("wedding_photos")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting wedding photo:", error);
    throw error;
  }
};

// Wedding Gift Services
export const createWeddingGift = async (data: Omit<WeddingGift, "id" | "created_at" | "updated_at">): Promise<WeddingGift> => {
  try {
    const { data: newGift, error } = await supabase
      .from("wedding_gifts")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newGift;
  } catch (error) {
    console.error("Error creating wedding gift:", error);
    throw error;
  }
};

export const getWeddingGiftsByHomepageId = async (homepageId: string): Promise<WeddingGift[]> => {
  try {
    const { data, error } = await supabase
      .from("wedding_gifts")
      .select("*")
      .eq("homepage_id", homepageId)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching wedding gifts:", error);
    throw error;
  }
};

export const updateWeddingGift = async (id: string, updates: Partial<WeddingGift>): Promise<WeddingGift> => {
  try {
    const { data, error } = await supabase
      .from("wedding_gifts")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating wedding gift:", error);
    throw error;
  }
};

export const deleteWeddingGift = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("wedding_gifts")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting wedding gift:", error);
    throw error;
  }
};

// Wedding Guestbook Services
export const createWeddingGuestbookEntry = async (data: Omit<WeddingGuestbookEntry, "id" | "created_at" | "updated_at">): Promise<WeddingGuestbookEntry> => {
  try {
    const { data: newEntry, error } = await supabase
      .from("wedding_guestbook_entries")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newEntry;
  } catch (error) {
    console.error("Error creating wedding guestbook entry:", error);
    throw error;
  }
};

export const getWeddingGuestbookEntriesByHomepageId = async (homepageId: string, approvedOnly: boolean = false): Promise<WeddingGuestbookEntry[]> => {
  try {
    let query = supabase
      .from("wedding_guestbook_entries")
      .select("*")
      .eq("homepage_id", homepageId);
      
    if (approvedOnly) {
      query = query.eq("is_approved", true);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching wedding guestbook entries:", error);
    throw error;
  }
};

export const updateWeddingGuestbookEntry = async (id: string, updates: Partial<WeddingGuestbookEntry>): Promise<WeddingGuestbookEntry> => {
  try {
    const { data, error } = await supabase
      .from("wedding_guestbook_entries")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating wedding guestbook entry:", error);
    throw error;
  }
};

export const deleteWeddingGuestbookEntry = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("wedding_guestbook_entries")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting wedding guestbook entry:", error);
    throw error;
  }
};

// Wedding Accommodation Services
export const createWeddingAccommodation = async (data: Omit<WeddingAccommodation, "id" | "created_at" | "updated_at">): Promise<WeddingAccommodation> => {
  try {
    const { data: newAccommodation, error } = await supabase
      .from("wedding_accommodations")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newAccommodation;
  } catch (error) {
    console.error("Error creating wedding accommodation:", error);
    throw error;
  }
};

export const getWeddingAccommodationsByHomepageId = async (homepageId: string): Promise<WeddingAccommodation[]> => {
  try {
    const { data, error } = await supabase
      .from("wedding_accommodations")
      .select("*")
      .eq("homepage_id", homepageId)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching wedding accommodations:", error);
    throw error;
  }
};

export const updateWeddingAccommodation = async (id: string, updates: Partial<WeddingAccommodation>): Promise<WeddingAccommodation> => {
  try {
    const { data, error } = await supabase
      .from("wedding_accommodations")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating wedding accommodation:", error);
    throw error;
  }
};

export const deleteWeddingAccommodation = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("wedding_accommodations")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting wedding accommodation:", error);
    throw error;
  }
};

// Wedding FAQ Services
export const createWeddingFAQ = async (data: Omit<WeddingFAQ, "id" | "created_at" | "updated_at">): Promise<WeddingFAQ> => {
  try {
    const { data: newFAQ, error } = await supabase
      .from("wedding_faqs")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newFAQ;
  } catch (error) {
    console.error("Error creating wedding FAQ:", error);
    throw error;
  }
};

export const getWeddingFAQsByHomepageId = async (homepageId: string): Promise<WeddingFAQ[]> => {
  try {
    const { data, error } = await supabase
      .from("wedding_faqs")
      .select("*")
      .eq("homepage_id", homepageId)
      .order("order", { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching wedding FAQs:", error);
    throw error;
  }
};

export const updateWeddingFAQ = async (id: string, updates: Partial<WeddingFAQ>): Promise<WeddingFAQ> => {
  try {
    const { data, error } = await supabase
      .from("wedding_faqs")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating wedding FAQ:", error);
    throw error;
  }
};

export const deleteWeddingFAQ = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("wedding_faqs")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting wedding FAQ:", error);
    throw error;
  }
};

// Wedding RSVP Services
export const createWeddingRSVP = async (data: Omit<WeddingRSVP, "id" | "created_at" | "updated_at">): Promise<WeddingRSVP> => {
  try {
    const { data: newRSVP, error } = await supabase
      .from("wedding_rsvps")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newRSVP;
  } catch (error) {
    console.error("Error creating wedding RSVP:", error);
    throw error;
  }
};

export const getWeddingRSVPsByHomepageId = async (homepageId: string): Promise<WeddingRSVP[]> => {
  try {
    const { data, error } = await supabase
      .from("wedding_rsvps")
      .select("*")
      .eq("homepage_id", homepageId)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching wedding RSVPs:", error);
    throw error;
  }
};

export const updateWeddingRSVP = async (id: string, updates: Partial<WeddingRSVP>): Promise<WeddingRSVP> => {
  try {
    const { data, error } = await supabase
      .from("wedding_rsvps")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating wedding RSVP:", error);
    throw error;
  }
};

export const deleteWeddingRSVP = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("wedding_rsvps")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting wedding RSVP:", error);
    throw error;
  }
};

// Wedding Theme Services
export const getWeddingThemes = async (): Promise<WeddingTheme[]> => {
  try {
    const { data, error } = await supabase
      .from("wedding_themes")
      .select("*")
      .order("name", { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching wedding themes:", error);
    throw error;
  }
};

export const getWeddingThemeById = async (id: string): Promise<WeddingTheme> => {
  try {
    const { data, error } = await supabase
      .from("wedding_themes")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching wedding theme:", error);
    throw error;
  }
};

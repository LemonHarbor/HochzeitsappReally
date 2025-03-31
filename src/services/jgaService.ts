import { supabase } from "../lib/supabase";
import { 
  JGAEvent, 
  JGADateOption, 
  JGADateVote, 
  JGABudgetItem, 
  JGABudgetSplit,
  JGAActivity,
  JGATask,
  JGASurpriseIdea,
  JGAParticipant,
  JGAPhoto
} from "../types/jga";

// JGA Event Services
export const createJGAEvent = async (data: Omit<JGAEvent, "id" | "created_at" | "updated_at">): Promise<JGAEvent> => {
  try {
    const { data: newEvent, error } = await supabase
      .from("jga_events")
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
    console.error("Error creating JGA event:", error);
    throw error;
  }
};

export const getJGAEventById = async (id: string): Promise<JGAEvent> => {
  try {
    const { data, error } = await supabase
      .from("jga_events")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching JGA event:", error);
    throw error;
  }
};

export const getJGAEventsByOrganizer = async (organizerId: string): Promise<JGAEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("jga_events")
      .select("*")
      .eq("organizer_id", organizerId)
      .order("date", { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching JGA events by organizer:", error);
    throw error;
  }
};

export const updateJGAEvent = async (id: string, updates: Partial<JGAEvent>): Promise<JGAEvent> => {
  try {
    const { data, error } = await supabase
      .from("jga_events")
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
    console.error("Error updating JGA event:", error);
    throw error;
  }
};

export const deleteJGAEvent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("jga_events")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting JGA event:", error);
    throw error;
  }
};

// JGA Date Options Services
export const createJGADateOption = async (data: Omit<JGADateOption, "id" | "created_at" | "updated_at">): Promise<JGADateOption> => {
  try {
    const { data: newDateOption, error } = await supabase
      .from("jga_date_options")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newDateOption;
  } catch (error) {
    console.error("Error creating JGA date option:", error);
    throw error;
  }
};

export const getJGADateOptionsByEvent = async (eventId: string): Promise<JGADateOption[]> => {
  try {
    const { data, error } = await supabase
      .from("jga_date_options")
      .select("*")
      .eq("event_id", eventId)
      .order("date", { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching JGA date options:", error);
    throw error;
  }
};

export const deleteJGADateOption = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("jga_date_options")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting JGA date option:", error);
    throw error;
  }
};

// JGA Date Votes Services
export const createJGADateVote = async (data: Omit<JGADateVote, "id" | "created_at" | "updated_at">): Promise<JGADateVote> => {
  try {
    // Check if vote already exists
    const { data: existingVote, error: checkError } = await supabase
      .from("jga_date_votes")
      .select("*")
      .eq("date_option_id", data.date_option_id)
      .eq("participant_id", data.participant_id)
      .single();
      
    if (checkError && checkError.code !== "PGRST116") throw checkError;
    
    if (existingVote) {
      // Update existing vote
      const { data: updatedVote, error } = await supabase
        .from("jga_date_votes")
        .update({
          vote: data.vote,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingVote.id)
        .select()
        .single();
        
      if (error) throw error;
      return updatedVote;
    } else {
      // Create new vote
      const { data: newVote, error } = await supabase
        .from("jga_date_votes")
        .insert({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      return newVote;
    }
  } catch (error) {
    console.error("Error creating/updating JGA date vote:", error);
    throw error;
  }
};

export const getJGADateVotesByOption = async (dateOptionId: string): Promise<JGADateVote[]> => {
  try {
    const { data, error } = await supabase
      .from("jga_date_votes")
      .select("*")
      .eq("date_option_id", dateOptionId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching JGA date votes:", error);
    throw error;
  }
};

// JGA Budget Items Services
export const createJGABudgetItem = async (data: Omit<JGABudgetItem, "id" | "created_at" | "updated_at">): Promise<JGABudgetItem> => {
  try {
    const { data: newBudgetItem, error } = await supabase
      .from("jga_budget_items")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newBudgetItem;
  } catch (error) {
    console.error("Error creating JGA budget item:", error);
    throw error;
  }
};

export const getJGABudgetItemsByEvent = async (eventId: string): Promise<JGABudgetItem[]> => {
  try {
    const { data, error } = await supabase
      .from("jga_budget_items")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching JGA budget items:", error);
    throw error;
  }
};

export const updateJGABudgetItem = async (id: string, updates: Partial<JGABudgetItem>): Promise<JGABudgetItem> => {
  try {
    const { data, error } = await supabase
      .from("jga_budget_items")
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
    console.error("Error updating JGA budget item:", error);
    throw error;
  }
};

export const deleteJGABudgetItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("jga_budget_items")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting JGA budget item:", error);
    throw error;
  }
};

// JGA Budget Splits Services
export const createJGABudgetSplit = async (data: Omit<JGABudgetSplit, "id" | "created_at" | "updated_at">): Promise<JGABudgetSplit> => {
  try {
    const { data: newBudgetSplit, error } = await supabase
      .from("jga_budget_splits")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newBudgetSplit;
  } catch (error) {
    console.error("Error creating JGA budget split:", error);
    throw error;
  }
};

export const getJGABudgetSplitsByItem = async (budgetItemId: string): Promise<JGABudgetSplit[]> => {
  try {
    const { data, error } = await supabase
      .from("jga_budget_splits")
      .select("*")
      .eq("budget_item_id", budgetItemId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching JGA budget splits:", error);
    throw error;
  }
};

export const updateJGABudgetSplit = async (id: string, updates: Partial<JGABudgetSplit>): Promise<JGABudgetSplit> => {
  try {
    const { data, error } = await supabase
      .from("jga_budget_splits")
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
    console.error("Error updating JGA budget split:", error);
    throw error;
  }
};

// JGA Activities Services
export const createJGAActivity = async (data: Omit<JGAActivity, "id" | "created_at" | "updated_at">): Promise<JGAActivity> => {
  try {
    const { data: newActivity, error } = await supabase
      .from("jga_activities")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newActivity;
  } catch (error) {
    console.error("Error creating JGA activity:", error);
    throw error;
  }
};

export const getJGAActivitiesByEvent = async (eventId: string): Promise<JGAActivity[]> => {
  try {
    const { data, error } = await supabase
      .from("jga_activities")
      .select("*")
      .eq("event_id", eventId)
      .order("start_time", { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching JGA activities:", error);
    throw error;
  }
};

export const updateJGAActivity = async (id: string, updates: Partial<JGAActivity>): Promise<JGAActivity> => {
  try {
    const { data, error } = await supabase
      .from("jga_activities")
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
    console.error("Error updating JGA activity:", error);
    throw error;
  }
};

export const deleteJGAActivity = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("jga_activities")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting JGA activity:", error);
    throw error;
  }
};

// JGA Tasks Services
export const createJGATask = async (data: Omit<JGATask, "id" | "created_at" | "updated_at">): Promise<JGATask> => {
  try {
    const { data: newTask, error } = await supabase
      .from("jga_tasks")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newTask;
  } catch (error) {
    console.error("Error creating JGA task:", error);
    throw error;
  }
};

export const getJGATasksByEvent = async (eventId: string): Promise<JGATask[]> => {
  try {
    const { data, error } = await supabase
      .from("jga_tasks")
      .select("*")
      .eq("event_id", eventId)
      .order("due_date", { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching JGA tasks:", error);
    throw error;
  }
};

export const updateJGATask = async (id: string, updates: Partial<JGATask>): Promise<JGATask> => {
  try {
    const { data, error } = await supabase
      .from("jga_tasks")
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
    console.error("Error updating JGA task:", error);
    throw error;
  }
};

export const deleteJGATask = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("jga_tasks")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting JGA task:", error);
    throw error;
  }
};

// JGA Surprise Ideas Services
export const createJGASurpriseIdea = async (data: Omit<JGASurpriseIdea, "id" | "created_at" | "updated_at">): Promise<JGASurpriseIdea> => {
  try {
    const { data: newIdea, error } = await supabase
      .from("jga_surprise_ideas")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newIdea;
  } catch (error) {
    console.error("Error creating JGA surprise idea:", error);
    throw error;
  }
};

export const getJGASurpriseIdeasByEvent = async (eventId: string): Promise<JGASurpriseIdea[]> => {
  try {
    const { data, error } = await supabase
      .from("jga_surprise_ideas")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching JGA surprise ideas:", error);
    throw error;
  }
};

export const updateJGASurpriseIdea = async (id: string, updates: Partial<JGASurpriseIdea>): Promise<JGASurpriseIdea> => {
  try {
    const { data, error } = await supabase
      .from("jga_surprise_ideas")
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
    console.error("Error updating JGA surprise idea:", error);
    throw error;
  }
};

export const deleteJGASurpriseIdea = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("jga_surprise_ideas")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting JGA surprise idea:", error);
    throw error;
  }
};

// JGA Participants Services
export const createJGAParticipant = async (data: Omit<JGAParticipant, "id" | "created_at" | "updated_at">): Promise<JGAParticipant> => {
  try {
    const { data: newParticipant, error } = await supabase
      .from("jga_participants")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return newParticipant;
  } catch (error) {
    console.error("Error creating JGA participant:", error);
    throw error;
  }
};

export const getJGAParticipantsByEvent = async (eventId: string): Promise<JGAParticipant[]> => {
  try {
    const { data, error } = await supabase
      .from("jga_participants")
      .select("*")
      .eq("event_id", eventId)
      .order("name", { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching JGA participants:", error);
    throw error;
  }
};

export const updateJGAParticipant = async (id: string, updates: Partial<JGAParticipant>): Promise<JGAParticipant> => {
  try {
    const { data, error } = await supabase
      .from("jga_participants")
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
    console.error("Error updating JGA participant:", error);
    throw error;
  }
};

export const deleteJGAParticipant = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("jga_participants")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting JGA participant:", error);
    throw error;
  }
};

// JGA Photos Services
export const createJGAPhoto = async (data: Omit<JGAPhoto, "id" | "created_at" | "updated_at">, file: File): Promise<JGAPhoto> => {
  try {
    // Upload the photo to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `jga-photos/${data.event_id}/${fileName}`;
    
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
      .from("jga_photos")
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
    console.error("Error creating JGA photo:", error);
    throw error;
  }
};

export const getJGAPhotosByEvent = async (eventId: string): Promise<JGAPhoto[]> => {
  try {
    const { data, error } = await supabase
      .from("jga_photos")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching JGA photos:", error);
    throw error;
  }
};

export const updateJGAPhoto = async (id: string, updates: Partial<JGAPhoto>): Promise<JGAPhoto> => {
  try {
    const { data, error } = await supabase
      .from("jga_photos")
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
    console.error("Error updating JGA photo:", error);
    throw error;
  }
};

export const deleteJGAPhoto = async (id: string): Promise<boolean> => {
  try {
    // Get the photo to delete the file from storage
    const { data: photo, error: fetchError } = await supabase
      .from("jga_photos")
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
      .from("jga_photos")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting JGA photo:", error);
    throw error;
  }
};

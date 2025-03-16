import { supabase } from "@/lib/supabase";
import { Vendor } from "@/types/vendor";
import { getVendorsByCategory } from "./vendorService";
import { getVendorAverageRating } from "./reviewService";

export interface VendorPreferences {
  budget?: { min: number; max: number };
  categories?: string[];
  style?: string[];
  rating?: number;
}

// Get recommended vendors based on user preferences
export const getRecommendedVendors = async (
  preferences: VendorPreferences,
  limit: number = 6,
): Promise<Vendor[]> => {
  try {
    // Start with a base query
    let query = supabase.from("vendors").select("*").eq("status", "active");

    // Apply category filter if specified
    if (preferences.categories && preferences.categories.length > 0) {
      query = query.in("category", preferences.categories);
    }

    // Fetch vendors
    const { data, error } = await query.limit(limit);

    if (error) throw error;

    // Apply additional filters that can't be done in the query
    let filteredVendors = data || [];

    // Filter by rating if specified
    if (preferences.rating && preferences.rating > 0) {
      const vendorsWithRatings = [];

      for (const vendor of filteredVendors) {
        const rating = await getVendorAverageRating(vendor.id);
        if (rating >= preferences.rating) {
          vendorsWithRatings.push(vendor);
        }
      }

      filteredVendors = vendorsWithRatings;
    }

    // Sort by relevance (this is a placeholder - in a real app, you'd have a more sophisticated algorithm)
    filteredVendors.sort((a, b) => a.name.localeCompare(b.name));

    return filteredVendors.slice(0, limit);
  } catch (error) {
    console.error("Error getting recommended vendors:", error);
    throw error;
  }
};

// Get similar vendors to a specific vendor
export const getSimilarVendors = async (
  vendorId: string,
  limit: number = 3,
): Promise<Vendor[]> => {
  try {
    // Get the original vendor
    const { data: vendor, error: vendorError } = await supabase
      .from("vendors")
      .select("*")
      .eq("id", vendorId)
      .single();

    if (vendorError) throw vendorError;

    // Get vendors in the same category
    const similarVendors = await getVendorsByCategory(vendor.category);

    // Filter out the original vendor
    const filteredVendors = similarVendors.filter((v) => v.id !== vendorId);

    // Sort by relevance (this is a placeholder - in a real app, you'd have a more sophisticated algorithm)
    filteredVendors.sort((a, b) => a.name.localeCompare(b.name));

    return filteredVendors.slice(0, limit);
  } catch (error) {
    console.error("Error getting similar vendors:", error);
    throw error;
  }
};

// Get popular vendors by category
export const getPopularVendorsByCategory = async (
  category: string,
  limit: number = 3,
): Promise<Vendor[]> => {
  try {
    // Get vendors in the category
    const vendors = await getVendorsByCategory(category);

    // In a real app, you'd sort by popularity metrics like review count, average rating, etc.
    // For now, we'll just return the first few vendors
    return vendors.slice(0, limit);
  } catch (error) {
    console.error("Error getting popular vendors by category:", error);
    throw error;
  }
};

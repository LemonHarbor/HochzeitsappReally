import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vendor } from "@/types/vendor";
import { useToast } from "@/components/ui/use-toast";
import RatingStars from "./RatingStars";
import { getVendorAverageRating } from "@/services/reviewService";
import {
  getRecommendedVendors,
  getSimilarVendors,
  getPopularVendorsByCategory,
  VendorPreferences,
} from "@/services/recommendationService";
import {
  Store,
  Star,
  ThumbsUp,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { VendorCard } from "./VendorCard";
import { VendorFilterPanel } from "./VendorFilterPanel";

interface VendorRecommendationsProps {
  selectedVendor?: Vendor;
  onViewVendorDetail?: (vendor: Vendor) => void;
}

const VendorRecommendations: React.FC<VendorRecommendationsProps> = ({
  selectedVendor,
  onViewVendorDetail = () => {},
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("recommended");
  const [recommendedVendors, setRecommendedVendors] = useState<Vendor[]>([]);
  const [similarVendors, setSimilarVendors] = useState<Vendor[]>([]);
  const [popularVendors, setPopularVendors] = useState<
    Record<string, Vendor[]>
  >({});
  const [vendorRatings, setVendorRatings] = useState<Record<string, number>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<VendorPreferences>({
    budget: { min: 0, max: 5000 },
    categories: [],
    style: [],
    rating: 3,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Categories for filtering
  const categories = [
    "venue",
    "catering",
    "photography",
    "videography",
    "florist",
    "music",
    "cake",
    "attire",
    "transportation",
    "decor",
    "beauty",
    "stationery",
    "jewelry",
    "other",
  ];

  // Style options
  const styleOptions = [
    "modern",
    "rustic",
    "elegant",
    "vintage",
    "bohemian",
    "minimalist",
    "glamorous",
    "traditional",
    "beach",
    "garden",
  ];

  // Fetch recommended vendors
  const fetchRecommendedVendors = async () => {
    try {
      setLoading(true);
      const vendors = await getRecommendedVendors(preferences, 6);
      setRecommendedVendors(vendors);

      // Fetch ratings for each vendor
      const ratings: Record<string, number> = {};
      for (const vendor of vendors) {
        ratings[vendor.id] = await getVendorAverageRating(vendor.id);
      }
      setVendorRatings((prev) => ({ ...prev, ...ratings }));
    } catch (error) {
      console.error("Error fetching recommended vendors:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load vendor recommendations.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch similar vendors when a vendor is selected
  const fetchSimilarVendors = async () => {
    if (!selectedVendor) {
      setSimilarVendors([]);
      return;
    }

    try {
      setLoading(true);
      const vendors = await getSimilarVendors(selectedVendor.id, 3);
      setSimilarVendors(vendors);

      // Fetch ratings for each vendor
      const ratings: Record<string, number> = {};
      for (const vendor of vendors) {
        ratings[vendor.id] = await getVendorAverageRating(vendor.id);
      }
      setVendorRatings((prev) => ({ ...prev, ...ratings }));
    } catch (error) {
      console.error("Error fetching similar vendors:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load similar vendors.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch popular vendors by category
  const fetchPopularVendors = async () => {
    try {
      setLoading(true);
      const popularByCategory: Record<string, Vendor[]> = {};
      const ratings: Record<string, number> = {};

      // Get top vendors for key categories
      const categoriesToFetch = [
        "venue",
        "catering",
        "photography",
        "music",
        "florist",
      ];

      for (const category of categoriesToFetch) {
        const vendors = await getPopularVendorsByCategory(category, 3);
        popularByCategory[category] = vendors;

        // Fetch ratings for each vendor
        for (const vendor of vendors) {
          ratings[vendor.id] = await getVendorAverageRating(vendor.id);
        }
      }

      setPopularVendors(popularByCategory);
      setVendorRatings((prev) => ({ ...prev, ...ratings }));
    } catch (error) {
      console.error("Error fetching popular vendors:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load popular vendors.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  React.useEffect(() => {
    if (activeTab === "recommended") {
      fetchRecommendedVendors();
    } else if (activeTab === "similar" && selectedVendor) {
      fetchSimilarVendors();
    } else if (activeTab === "popular") {
      fetchPopularVendors();
    }
  }, [activeTab, selectedVendor]);

  // Refetch when preferences change
  React.useEffect(() => {
    if (activeTab === "recommended") {
      fetchRecommendedVendors();
    }
  }, [preferences]);

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setPreferences((prev) => {
      const categories = prev.categories || [];
      if (categories.includes(category)) {
        return {
          ...prev,
          categories: categories.filter((c) => c !== category),
        };
      } else {
        return { ...prev, categories: [...categories, category] };
      }
    });
  };

  // Handle style selection
  const handleStyleChange = (style: string) => {
    setPreferences((prev) => {
      const styles = prev.style || [];
      if (styles.includes(style)) {
        return { ...prev, style: styles.filter((s) => s !== style) };
      } else {
        return { ...prev, style: [...styles, style] };
      }
    });
  };

  // Get category display name
  const getCategoryDisplay = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Render loading skeleton
  const renderSkeleton = () => {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 sm:h-6 w-3/4" />
          <Skeleton className="h-4 sm:h-5 w-1/4 mt-1" />
        </CardHeader>
        <CardContent className="pt-3 sm:pt-4">
          <div className="space-y-2 sm:space-y-3">
            <Skeleton className="h-3 sm:h-4 w-full" />
            <Skeleton className="h-3 sm:h-4 w-3/4" />
            <Skeleton className="h-3 sm:h-4 w-5/6" />
            <Skeleton className="h-3 sm:h-4 w-2/3" />
            <Skeleton className="h-8 sm:h-9 w-full mt-2" />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
          <div>
            <CardTitle className="text-base sm:text-lg">
              Vendor Recommendations
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Discover vendors that match your preferences
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Customize</span>
                  <span className="sm:hidden">Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 sm:w-80" align="end">
                <VendorFilterPanel
                  preferences={preferences}
                  categories={categories.slice(0, 8)}
                  styleOptions={styleOptions.slice(0, 6)}
                  onCategoryChange={handleCategoryChange}
                  onStyleChange={handleStyleChange}
                  onPreferencesChange={setPreferences}
                  onApply={() => {
                    fetchRecommendedVendors();
                    setShowFilters(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-3 sm:mb-4 h-8 sm:h-10 w-full">
            <TabsTrigger value="recommended" className="text-xs sm:text-sm">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Recommended for You</span>
              <span className="sm:hidden">For You</span>
            </TabsTrigger>
            {selectedVendor && (
              <TabsTrigger value="similar" className="text-xs sm:text-sm">
                <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  Similar to {selectedVendor.name}
                </span>
                <span className="sm:hidden">Similar</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="popular" className="text-xs sm:text-sm">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Popular Vendors</span>
              <span className="sm:hidden">Popular</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommended">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i}>{renderSkeleton()}</div>
                  ))}
              </div>
            ) : recommendedVendors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {recommendedVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    rating={vendorRatings[vendor.id] || 0}
                    onViewDetails={() => onViewVendorDetail(vendor)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 sm:py-6">
                <Store className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-2 sm:mt-4 text-base sm:text-lg font-medium">
                  No recommendations found
                </h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  Try adjusting your preferences
                </p>
                <Button
                  variant="outline"
                  className="mt-3 sm:mt-4 text-xs sm:text-sm h-8 sm:h-9"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Adjust Preferences
                </Button>
              </div>
            )}
          </TabsContent>

          {selectedVendor && (
            <TabsContent value="similar">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i}>{renderSkeleton()}</div>
                    ))}
                </div>
              ) : similarVendors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {similarVendors.map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      rating={vendorRatings[vendor.id] || 0}
                      onViewDetails={() => onViewVendorDetail(vendor)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 sm:py-6">
                  <Store className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-2 sm:mt-4 text-base sm:text-lg font-medium">
                    No similar vendors found
                  </h3>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                    We couldn't find any similar vendors to{" "}
                    {selectedVendor.name} at this time.
                  </p>
                </div>
              )}
            </TabsContent>
          )}

          <TabsContent value="popular">
            {loading ? (
              <div className="space-y-4 sm:space-y-6">
                {Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-5 sm:h-6 w-32 sm:w-48 mb-2 sm:mb-3" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {Array(3)
                          .fill(0)
                          .map((_, j) => (
                            <div key={j}>{renderSkeleton()}</div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : Object.keys(popularVendors).length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {Object.entries(popularVendors).map(
                  ([category, vendors]) =>
                    vendors.length > 0 && (
                      <div key={category}>
                        <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">
                          Top {getCategoryDisplay(category)} Vendors
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {vendors.map((vendor) => (
                            <VendorCard
                              key={vendor.id}
                              vendor={vendor}
                              rating={vendorRatings[vendor.id] || 0}
                              onViewDetails={() => onViewVendorDetail(vendor)}
                            />
                          ))}
                        </div>
                      </div>
                    ),
                )}
              </div>
            ) : (
              <div className="text-center py-4 sm:py-6">
                <Star className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-2 sm:mt-4 text-base sm:text-lg font-medium">
                  No popular vendors found
                </h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  We're still gathering data on the most popular vendors.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VendorRecommendations;

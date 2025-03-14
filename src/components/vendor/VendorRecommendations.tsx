import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  DollarSign,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  useEffect(() => {
    if (activeTab === "recommended") {
      fetchRecommendedVendors();
    } else if (activeTab === "similar" && selectedVendor) {
      fetchSimilarVendors();
    } else if (activeTab === "popular") {
      fetchPopularVendors();
    }
  }, [activeTab, selectedVendor]);

  // Refetch when preferences change
  useEffect(() => {
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

  // Render vendor card
  const renderVendorCard = (vendor: Vendor) => {
    const rating = vendorRatings[vendor.id] || 0;

    return (
      <Card
        key={vendor.id}
        className="overflow-hidden hover:border-primary cursor-pointer transition-colors"
        onClick={() => onViewVendorDetail(vendor)}
      >
        <CardHeader className="pb-2 bg-muted/30">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{vendor.name}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {getCategoryDisplay(vendor.category)}
              </Badge>
            </div>
            <div className="flex items-center">
              <span className="font-bold mr-1">{rating.toFixed(1)}</span>
              <RatingStars rating={rating} size="sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {vendor.contact_name && (
              <div className="text-sm">
                <span className="font-medium">Contact:</span>{" "}
                {vendor.contact_name}
              </div>
            )}

            {vendor.address && (
              <div className="flex items-center text-sm">
                <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className="truncate">{vendor.address}</span>
              </div>
            )}

            {vendor.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span>{vendor.phone}</span>
              </div>
            )}

            {vendor.email && (
              <div className="flex items-center text-sm">
                <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <a
                  href={`mailto:${vendor.email}`}
                  className="text-primary hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {vendor.email}
                </a>
              </div>
            )}

            {vendor.website && (
              <div className="flex items-center text-sm">
                <ExternalLink className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {vendor.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={(e) => {
                e.stopPropagation();
                onViewVendorDetail(vendor);
              }}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render loading skeleton
  const renderSkeleton = () => {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-1/4 mt-1" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-9 w-full mt-2" />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Vendor Recommendations</h2>
          <p className="text-muted-foreground">
            Discover vendors that match your preferences and budget
          </p>
        </div>
        <div className="flex gap-2">
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Customize Recommendations
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Budget Range</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Min: ${preferences.budget?.min}</span>
                    <span>Max: ${preferences.budget?.max}</span>
                  </div>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      min="0"
                      value={preferences.budget?.min || 0}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          budget: {
                            ...preferences.budget,
                            min: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-1/2"
                    />
                    <Input
                      type="number"
                      min="0"
                      value={preferences.budget?.max || 5000}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          budget: {
                            ...preferences.budget,
                            max: parseInt(e.target.value) || 5000,
                          },
                        })
                      }
                      className="w-1/2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Minimum Rating</h4>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[preferences.rating || 3]}
                      min={1}
                      max={5}
                      step={0.5}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, rating: value[0] })
                      }
                    />
                    <span className="font-medium">{preferences.rating}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 8).map((category) => (
                      <Badge
                        key={category}
                        variant={
                          preferences.categories?.includes(category)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleCategoryChange(category)}
                      >
                        {getCategoryDisplay(category)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Style Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {styleOptions.slice(0, 6).map((style) => (
                      <Badge
                        key={style}
                        variant={
                          preferences.style?.includes(style)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleStyleChange(style)}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    fetchRecommendedVendors();
                    setShowFilters(false);
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Recommendations
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="recommended">
            <Sparkles className="mr-2 h-4 w-4" />
            Recommended for You
          </TabsTrigger>
          {selectedVendor && (
            <TabsTrigger value="similar">
              <ThumbsUp className="mr-2 h-4 w-4" />
              Similar to {selectedVendor.name}
            </TabsTrigger>
          )}
          <TabsTrigger value="popular">
            <Star className="mr-2 h-4 w-4" />
            Popular Vendors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>{renderSkeleton()}</div>
                ))}
            </div>
          ) : recommendedVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedVendors.map((vendor) => renderVendorCard(vendor))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Store className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">
                No recommendations found
              </h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your preferences or adding more vendors to get
                personalized recommendations.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Adjust Preferences
              </Button>
            </div>
          )}
        </TabsContent>

        {selectedVendor && (
          <TabsContent value="similar">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i}>{renderSkeleton()}</div>
                  ))}
              </div>
            ) : similarVendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarVendors.map((vendor) => renderVendorCard(vendor))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Store className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">
                  No similar vendors found
                </h3>
                <p className="mt-2 text-muted-foreground">
                  We couldn't find any similar vendors to {selectedVendor.name}{" "}
                  at this time.
                </p>
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="popular">
          {loading ? (
            <div className="space-y-8">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-6 w-48 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="space-y-8">
              {Object.entries(popularVendors).map(
                ([category, vendors]) =>
                  vendors.length > 0 && (
                    <div key={category}>
                      <h3 className="text-lg font-medium mb-4">
                        Top {getCategoryDisplay(category)} Vendors
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {vendors.map((vendor) => renderVendorCard(vendor))}
                      </div>
                    </div>
                  ),
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">
                No popular vendors found
              </h3>
              <p className="mt-2 text-muted-foreground">
                We're still gathering data on the most popular vendors.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorRecommendations;

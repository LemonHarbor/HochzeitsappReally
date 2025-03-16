import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { Review, ReviewStatus, VerificationType } from "@/types/review";
import { useAuth } from "@/context/AuthContext";
import {
  Star,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  SortAsc,
  ThumbsUp,
  Filter,
  Calendar,
  Search,
  X,
  ShieldCheck,
  FileCheck,
  Award,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ReviewVoteButtons from "./ReviewVoteButtons";
import VerificationBadge from "./VerificationBadge";

interface ReviewListProps {
  reviews: Review[];
  averageRating?: number;
  ratingDistribution?: Record<number, number>;
  loading?: boolean;
  onAddReview?: () => void;
  onEditReview?: (review: Review) => void;
  onDeleteReview?: (id: string) => void;
  showPendingReviews?: boolean;
}

type SortOption = "recent" | "helpful" | "rating" | "oldest";
type FilterOptions = {
  ratings: number[];
  searchTerm: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  showVerifiedOnly: boolean;
  verificationType?: VerificationType | null;
};

const ReviewList: React.FC<ReviewListProps> = ({
  reviews: initialReviews,
  averageRating = 0,
  ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  loading = false,
  onAddReview = () => {},
  onEditReview = () => {},
  onDeleteReview = () => {},
  showPendingReviews = false,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const { user, permissions } = useAuth();
  const [reviewToDelete, setReviewToDelete] = React.useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    ratings: [],
    searchTerm: "",
    dateRange: { from: null, to: null },
    showVerifiedOnly: false,
    verificationType: null,
  });
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Update search term in filter options when it changes
  useEffect(() => {
    setFilterOptions((prev) => ({ ...prev, searchTerm }));
  }, [searchTerm]);

  // Check if any filter is active
  useEffect(() => {
    const hasActiveFilters =
      filterOptions.ratings.length > 0 ||
      filterOptions.searchTerm.trim() !== "" ||
      filterOptions.dateRange.from !== null ||
      filterOptions.dateRange.to !== null ||
      filterOptions.showVerifiedOnly ||
      filterOptions.verificationType !== null;

    setIsFilterActive(hasActiveFilters);
  }, [filterOptions]);

  // Toggle rating filter
  const toggleRatingFilter = (rating: number) => {
    setFilterOptions((prev) => {
      const newRatings = prev.ratings.includes(rating)
        ? prev.ratings.filter((r) => r !== rating)
        : [...prev.ratings, rating];
      return { ...prev, ratings: newRatings };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterOptions({
      ratings: [],
      searchTerm: "",
      dateRange: { from: null, to: null },
      showVerifiedOnly: false,
      verificationType: null,
    });
    setSearchTerm("");
  };

  // Filter reviews based on permissions and filter options
  const filteredReviews = initialReviews.filter((review) => {
    // First apply permission-based filtering
    const passesPermissionFilter =
      (permissions.canManagePermissions && showPendingReviews) ||
      review.status === "approved" ||
      (user && user.id === review.user_id);

    if (!passesPermissionFilter) return false;

    // Then apply user-selected filters
    // Rating filter
    if (
      filterOptions.ratings.length > 0 &&
      !filterOptions.ratings.includes(review.rating)
    ) {
      return false;
    }

    // Search term filter
    if (filterOptions.searchTerm.trim() !== "") {
      const searchLower = filterOptions.searchTerm.toLowerCase();
      const textLower = review.review_text?.toLowerCase() || "";
      if (!textLower.includes(searchLower)) {
        return false;
      }
    }

    // Date range filter
    if (filterOptions.dateRange.from || filterOptions.dateRange.to) {
      const reviewDate = review.created_at ? new Date(review.created_at) : null;
      if (!reviewDate) return false;

      if (
        filterOptions.dateRange.from &&
        reviewDate < filterOptions.dateRange.from
      ) {
        return false;
      }

      if (filterOptions.dateRange.to) {
        // Set the end of day for the "to" date
        const endDate = new Date(filterOptions.dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        if (reviewDate > endDate) {
          return false;
        }
      }
    }

    // Verified reviews filter
    if (filterOptions.showVerifiedOnly && !review.is_verified) {
      return false;
    }

    // Filter by verification type
    if (
      filterOptions.verificationType &&
      (!review.is_verified ||
        review.verification_type !== filterOptions.verificationType)
    ) {
      return false;
    }

    return true;
  });

  // Calculate total reviews
  const totalReviews = initialReviews.length;

  // Format date
  const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Check if user can edit/delete a review
  const canModifyReview = (review: Review) => {
    return (
      user && (user.id === review.user_id || permissions.canManagePermissions)
    );
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (reviewToDelete) {
      onDeleteReview(reviewToDelete);
      setReviewToDelete(null);
    }
  };

  // Get user initials for avatar
  const getUserInitials = (userId: string) => {
    // In a real app, you would fetch the user's name
    // For now, just use the first two characters of the user ID
    return userId.substring(0, 2).toUpperCase();
  };

  // Get status badge for a review
  const getStatusBadge = (status?: ReviewStatus) => {
    if (!status || status === "approved") return null;

    if (status === "pending") {
      return (
        <Badge variant="outline" className="bg-yellow-50">
          <Clock className="h-3 w-3 mr-1 text-yellow-500" />
          Pending
        </Badge>
      );
    }

    if (status === "rejected") {
      return (
        <Badge variant="outline" className="bg-red-50">
          <XCircle className="h-3 w-3 mr-1 text-red-500" />
          Rejected
        </Badge>
      );
    }

    return null;
  };

  // Sort reviews based on selected option
  const visibleReviews = [...filteredReviews].sort((a, b) => {
    switch (sortOption) {
      case "helpful":
        const aHelpful = (a.helpful_votes || 0) - (a.unhelpful_votes || 0);
        const bHelpful = (b.helpful_votes || 0) - (b.unhelpful_votes || 0);
        return bHelpful - aHelpful;
      case "rating":
        return b.rating - a.rating;
      case "oldest":
        return (
          new Date(a.created_at || "").getTime() -
          new Date(b.created_at || "").getTime()
        );
      case "recent":
      default:
        return (
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
        );
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle>Reviews & Ratings</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[200px] h-9 pl-8"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={
                      isFilterActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : ""
                    }
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    {isFilterActive && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-primary-foreground text-primary"
                      >
                        {filterOptions.ratings.length +
                          (filterOptions.searchTerm ? 1 : 0) +
                          (filterOptions.dateRange.from ||
                          filterOptions.dateRange.to
                            ? 1
                            : 0) +
                          (filterOptions.showVerifiedOnly ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-4" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Rating</h4>
                      <div className="flex flex-col gap-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div
                            key={rating}
                            className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${filterOptions.ratings.includes(rating) ? "bg-muted" : ""}`}
                            onClick={() => toggleRatingFilter(rating)}
                          >
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm">
                              {rating} star{rating !== 1 ? "s" : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Verification Filters</h4>
                      <div className="flex items-center gap-2 p-1.5 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          id="verified"
                          checked={filterOptions.showVerifiedOnly}
                          onChange={() =>
                            setFilterOptions((prev) => ({
                              ...prev,
                              showVerifiedOnly: !prev.showVerifiedOnly,
                              verificationType: null, // Reset verification type when toggling all verified
                            }))
                          }
                          className="mr-2"
                        />
                        <label
                          htmlFor="verified"
                          className="text-sm cursor-pointer"
                        >
                          Verified reviews only
                        </label>
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          Filter by verification type:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant={
                              filterOptions.verificationType === "booking"
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer flex items-center gap-1"
                            onClick={() =>
                              setFilterOptions((prev) => ({
                                ...prev,
                                verificationType:
                                  prev.verificationType === "booking"
                                    ? null
                                    : "booking",
                                showVerifiedOnly:
                                  prev.verificationType === "booking"
                                    ? false
                                    : true,
                              }))
                            }
                          >
                            <ShieldCheck className="h-3 w-3" />
                            <span>Booking</span>
                          </Badge>

                          <Badge
                            variant={
                              filterOptions.verificationType === "contract"
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer flex items-center gap-1"
                            onClick={() =>
                              setFilterOptions((prev) => ({
                                ...prev,
                                verificationType:
                                  prev.verificationType === "contract"
                                    ? null
                                    : "contract",
                                showVerifiedOnly:
                                  prev.verificationType === "contract"
                                    ? false
                                    : true,
                              }))
                            }
                          >
                            <FileCheck className="h-3 w-3" />
                            <span>Contract</span>
                          </Badge>

                          <Badge
                            variant={
                              filterOptions.verificationType === "purchase"
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer flex items-center gap-1"
                            onClick={() =>
                              setFilterOptions((prev) => ({
                                ...prev,
                                verificationType:
                                  prev.verificationType === "purchase"
                                    ? null
                                    : "purchase",
                                showVerifiedOnly:
                                  prev.verificationType === "purchase"
                                    ? false
                                    : true,
                              }))
                            }
                          >
                            <CheckCircle className="h-3 w-3" />
                            <span>Purchase</span>
                          </Badge>

                          <Badge
                            variant={
                              filterOptions.verificationType === "admin"
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer flex items-center gap-1"
                            onClick={() =>
                              setFilterOptions((prev) => ({
                                ...prev,
                                verificationType:
                                  prev.verificationType === "admin"
                                    ? null
                                    : "admin",
                                showVerifiedOnly:
                                  prev.verificationType === "admin"
                                    ? false
                                    : true,
                              }))
                            }
                          >
                            <Award className="h-3 w-3" />
                            <span>Admin</span>
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        disabled={!isFilterActive}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SortAsc className="mr-2 h-4 w-4" />
                    {sortOption === "recent" && "Most Recent"}
                    {sortOption === "oldest" && "Oldest First"}
                    {sortOption === "helpful" && "Most Helpful"}
                    {sortOption === "rating" && "Highest Rated"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setSortOption("recent")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Most Recent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("oldest")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Oldest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("helpful")}>
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Most Helpful
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("rating")}>
                      <Star className="mr-2 h-4 w-4" />
                      Highest Rated
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={onAddReview}>
                <Plus className="mr-2 h-4 w-4" />
                Write a Review
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Based on {totalReviews}{" "}
                {totalReviews === 1 ? "review" : "reviews"}
              </div>
            </div>

            <div className="col-span-2">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingDistribution[rating] || 0;
                  const percentage =
                    totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex items-center w-12">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
                      </div>
                      <Progress value={percentage} className="h-2 flex-1" />
                      <div className="w-12 text-right text-sm text-muted-foreground">
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : visibleReviews.length > 0 ? (
            <div className="space-y-6">
              {isFilterActive && (
                <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                  <div className="text-sm">
                    <span className="font-medium">{visibleReviews.length}</span>{" "}
                    {visibleReviews.length === 1 ? "review" : "reviews"} match
                    your filters
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-2 h-3 w-3" />
                    Clear filters
                  </Button>
                </div>
              )}
              {visibleReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {getUserInitials(review.user_id)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          User {review.user_id.substring(0, 8)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatReviewDate(review.created_at || "")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(review.status)}
                      {review.is_verified && (
                        <VerificationBadge
                          type={review.verification_type}
                          size="sm"
                          showLabel={false}
                        />
                      )}
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 whitespace-pre-line">
                    {review.review_text}
                  </div>
                  <div className="mt-3">
                    <ReviewVoteButtons
                      reviewId={review.id}
                      helpfulCount={review.helpful_votes}
                      unhelpfulCount={review.unhelpful_votes}
                      size="sm"
                    />
                  </div>
                  {review.moderation_notes &&
                    permissions.canManagePermissions && (
                      <div className="mt-3 p-2 bg-muted rounded-md">
                        <p className="text-xs font-medium">Moderation Notes:</p>
                        <p className="text-sm">{review.moderation_notes}</p>
                      </div>
                    )}
                  {canModifyReview(review) && (
                    <div className="mt-4 flex justify-end gap-2">
                      {(review.status === "approved" ||
                        user?.id === review.user_id) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditReview(review)}
                        >
                          <Edit className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => setReviewToDelete(review.id)}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {isFilterActive ? (
                <>
                  <p>No reviews match your current filters.</p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <p>No reviews yet. Be the first to review this vendor!</p>
                  <Button
                    variant="outline"
                    onClick={onAddReview}
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Write a Review
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!reviewToDelete}
        onOpenChange={(open) => !open && setReviewToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReviewList;

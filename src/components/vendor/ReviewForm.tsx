import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  createReview,
  updateReview,
  getReviewByVendorAndUser,
} from "@/services/reviewService";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  review_text: z
    .string()
    .min(10, { message: "Review must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ReviewFormProps {
  vendorId: string;
  initialData?: Partial<FormValues>;
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  reviewId?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  vendorId,
  initialData = {},
  onSubmit,
  onCancel = () => {},
  isEditing = false,
  reviewId,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData.rating || 0,
      review_text: initialData.review_text || "",
    },
  });

  const watchedRating = form.watch("rating");

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You must be logged in to submit a review.",
        });
        return;
      }

      // If not editing, check if user has already reviewed this vendor
      if (!isEditing) {
        const existingReview = await getReviewByVendorAndUser(
          vendorId,
          user.id,
        );
        if (existingReview) {
          toast({
            variant: "destructive",
            title: "Review Error",
            description: "You have already reviewed this vendor.",
          });
          return;
        }
      }

      // If onSubmit is provided, use that (for custom handling)
      if (onSubmit) {
        onSubmit(values);
      } else {
        // Otherwise use the default service methods
        const reviewData = {
          vendor_id: vendorId,
          user_id: user.id,
          rating: values.rating,
          review_text: values.review_text,
        };

        if (isEditing && reviewId) {
          await updateReview(reviewId, reviewData);
        } else {
          await createReview(reviewData);
        }

        toast({
          title: isEditing ? "Review Updated" : "Review Submitted",
          description: isEditing
            ? "Your review has been updated successfully."
            : "Thank you for your feedback!",
        });

        // Reset form if not editing
        if (!isEditing) {
          form.reset();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "submit"} review: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Review" : "Write a Review"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update your review and rating"
            : "Share your experience with this vendor"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => field.onChange(rating)}
                          onMouseEnter={() => setHoveredRating(rating)}
                          onMouseLeave={() => setHoveredRating(null)}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              (
                                hoveredRating !== null
                                  ? rating <= hoveredRating
                                  : rating <= field.value
                              )
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    {watchedRating === 1 && "Poor"}
                    {watchedRating === 2 && "Fair"}
                    {watchedRating === 3 && "Good"}
                    {watchedRating === 4 && "Very Good"}
                    {watchedRating === 5 && "Excellent"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="review_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share details of your experience with this vendor..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your honest feedback helps other couples make informed
                    decisions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-6 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Review"
                    : "Submit Review"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;

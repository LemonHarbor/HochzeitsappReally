import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

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
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  vendorId,
  initialData = {},
  onSubmit = () => {},
  onCancel = () => {},
  isEditing = false,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);

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
  const handleSubmit = (values: FormValues) => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You must be logged in to submit a review.",
        });
        return;
      }

      onSubmit(values);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "submit"} review: ${error.message}`,
      });
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
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Review" : "Submit Review"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;

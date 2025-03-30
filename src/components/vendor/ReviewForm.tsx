import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X, Star, ShieldCheck, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  createReview,
  updateReview,
  getReviewByVendorAndUser,
} from "@/services/reviewService";
import { checkUserBookedVendor } from "@/services/verificationService";
import { useLanguage } from "@/lib/language";
import { DatePickerField } from "./DatePickerField";

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
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  review_text: z
    .string()
    .min(10, { message: "Review must be at least 10 characters" }),
  visit_date: z.date().optional(),
  is_verified: z.boolean().optional(),
  verification_type: z.string().optional(),
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
  const { language, t } = useLanguage();
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [canBeVerified, setCanBeVerified] = React.useState(false);
  const [verificationType, setVerificationType] = React.useState<string | null>(
    null,
  );

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData.rating || 0,
      review_text: initialData.review_text || "",
      visit_date: initialData.visit_date,
      is_verified: initialData.is_verified || false,
      verification_type: initialData.verification_type || "",
    },
  });

  // Check if the user has booked this vendor
  useEffect(() => {
    const checkBookingStatus = async () => {
      if (!user || !vendorId) return;

      try {
        const hasBooked = await checkUserBookedVendor(user.id, vendorId);
        setCanBeVerified(hasBooked);

        if (hasBooked) {
          // Determine verification type based on booking history
          // This is simplified - in a real app you'd have more complex logic
          setVerificationType("booking");

          // If this is a new review (not editing), auto-set as verified
          if (!isEditing) {
            form.setValue("is_verified", true);
            form.setValue("verification_type", "booking");
          }
        }
      } catch (error) {
        console.error("Error checking booking status:", error);
      }
    };

    checkBookingStatus();
  }, [user, vendorId, isEditing, form]);

  const watchedRating = form.watch("rating");

  // Get rating description based on language
  const getRatingDescription = (rating: number) => {
    if (language === "de") {
      switch (rating) {
        case 1:
          return "Schlecht";
        case 2:
          return "Ausreichend";
        case 3:
          return "Gut";
        case 4:
          return "Sehr gut";
        case 5:
          return "Ausgezeichnet";
        default:
          return "";
      }
    } else {
      switch (rating) {
        case 1:
          return "Poor";
        case 2:
          return "Fair";
        case 3:
          return "Good";
        case 4:
          return "Very Good";
        case 5:
          return "Excellent";
        default:
          return "";
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      if (!user) {
        toast({
          variant: "destructive",
          title:
            language === "de"
              ? "Authentifizierungsfehler"
              : "Authentication Error",
          description:
            language === "de"
              ? "Sie müssen angemeldet sein, um eine Bewertung abzugeben."
              : "You must be logged in to submit a review.",
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
            title: language === "de" ? "Bewertungsfehler" : "Review Error",
            description:
              language === "de"
                ? "Sie haben diesen Anbieter bereits bewertet."
                : "You have already reviewed this vendor.",
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
          visit_date: values.visit_date,
          is_verified: values.is_verified,
          verification_type: values.verification_type || null,
        };

        if (isEditing && reviewId) {
          await updateReview(reviewId, reviewData);
        } else {
          await createReview(reviewData);
        }

        toast({
          title: isEditing
            ? language === "de"
              ? "Bewertung aktualisiert"
              : "Review Updated"
            : language === "de"
              ? "Bewertung abgeschickt"
              : "Review Submitted",
          description: isEditing
            ? language === "de"
              ? "Ihre Bewertung wurde erfolgreich aktualisiert."
              : "Your review has been updated successfully."
            : language === "de"
              ? "Vielen Dank für Ihr Feedback!"
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
        title: language === "de" ? "Fehler" : "Error",
        description:
          language === "de"
            ? `Fehler beim ${isEditing ? "Aktualisieren" : "Absenden"} der Bewertung: ${error.message}`
            : `Failed to ${isEditing ? "update" : "submit"} review: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing
            ? language === "de"
              ? "Bewertung bearbeiten"
              : "Edit Review"
            : language === "de"
              ? "Bewertung schreiben"
              : "Write a Review"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? language === "de"
              ? "Aktualisieren Sie Ihre Bewertung und Bewertungspunkte"
              : "Update your review and rating"
            : language === "de"
              ? "Teilen Sie Ihre Erfahrung mit diesem Anbieter"
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
                  <FormLabel>
                    {language === "de" ? "Bewertung" : "Rating"}
                  </FormLabel>
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
                    {watchedRating > 0 && getRatingDescription(watchedRating)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visit_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "de" ? "Besuchsdatum" : "Visit Date"}
                  </FormLabel>
                  <FormControl>
                    <DatePickerField
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={
                        language === "de"
                          ? "Wann haben Sie den Anbieter besucht?"
                          : "When did you visit this vendor?"
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    {language === "de"
                      ? "Optional: Hilft anderen Paaren, die Aktualität Ihrer Bewertung einzuschätzen."
                      : "Optional: Helps other couples gauge the timeliness of your review."}
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
                  <FormLabel>
                    {language === "de" ? "Ihre Bewertung" : "Your Review"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        language === "de"
                          ? "Teilen Sie Details zu Ihrer Erfahrung mit diesem Anbieter..."
                          : "Share details of your experience with this vendor..."
                      }
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {language === "de"
                      ? "Ihr ehrliches Feedback hilft anderen Paaren, informierte Entscheidungen zu treffen."
                      : "Your honest feedback helps other couples make informed decisions."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {canBeVerified && (
              <div className="px-0 pt-4">
                <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-md border border-green-200">
                  <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      {language === "de"
                        ? "Ihre Bewertung wird als verifiziert markiert"
                        : "Your review will be marked as verified"}
                    </p>
                    <p className="text-xs text-green-700">
                      {language === "de"
                        ? `Wir haben bestätigt, dass Sie ${verificationType === "booking" ? "gebucht haben" : "gekauft haben von"} diesem Anbieter`
                        : `We've confirmed you've ${verificationType === "booking" ? "booked" : "purchased from"} this vendor`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <CardFooter className="px-0 pt-6 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                {language === "de" ? "Abbrechen" : "Cancel"}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting
                  ? language === "de"
                    ? "Speichern..."
                    : "Saving..."
                  : isEditing
                    ? language === "de"
                      ? "Bewertung aktualisieren"
                      : "Update Review"
                    : language === "de"
                      ? "Bewertung abschicken"
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

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X, Calendar, Clock, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/language";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { format, addHours, parse } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "Title must be at least 2 characters" }),
    description: z.string().optional(),
    start_date: z.string().min(1, { message: "Start date is required" }),
    start_time: z.string().min(1, { message: "Start time is required" }),
    end_date: z.string().min(1, { message: "End date is required" }),
    end_time: z.string().min(1, { message: "End time is required" }),
    location: z.string().optional(),
    status: z.enum(["scheduled", "completed", "cancelled", "rescheduled"], {
      required_error: "Please select a status",
    }),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const startDateTime = new Date(
        `${data.start_date}T${data.start_time}:00`,
      );
      const endDateTime = new Date(`${data.end_date}T${data.end_time}:00`);
      return endDateTime > startDateTime;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

interface AppointmentFormProps {
  vendorId: string;
  initialData?: Partial<FormValues>;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  vendorId,
  initialData = {},
  onSubmit = () => {},
  onCancel = () => {},
  isEditing = false,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // Set default dates and times
  const now = new Date();
  const oneHourLater = addHours(now, 1);
  const twoHoursLater = addHours(now, 2);

  // Format dates for form initialization
  const defaultStartDate = format(now, "yyyy-MM-dd");
  const defaultStartTime = format(oneHourLater, "HH:mm");
  const defaultEndDate = format(now, "yyyy-MM-dd");
  const defaultEndTime = format(twoHoursLater, "HH:mm");

  // Parse initial dates if provided
  let startDate = defaultStartDate;
  let startTime = defaultStartTime;
  let endDate = defaultEndDate;
  let endTime = defaultEndTime;

  if (initialData.start_date && initialData.start_time) {
    startDate = initialData.start_date;
    startTime = initialData.start_time;
  } else if (initialData.start_date) {
    startDate = initialData.start_date;
  } else if (initialData.start_time) {
    startTime = initialData.start_time;
  }

  if (initialData.end_date && initialData.end_time) {
    endDate = initialData.end_date;
    endTime = initialData.end_time;
  } else if (initialData.end_date) {
    endDate = initialData.end_date;
  } else if (initialData.end_time) {
    endTime = initialData.end_time;
  }

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime,
      location: initialData.location || "",
      status: initialData.status || "scheduled",
      notes: initialData.notes || "",
    },
  });

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    try {
      // Combine date and time into ISO strings
      const startDateTime = new Date(
        `${values.start_date}T${values.start_time}:00`,
      ).toISOString();
      const endDateTime = new Date(
        `${values.end_date}T${values.end_time}:00`,
      ).toISOString();

      // Create appointment data object
      const appointmentData = {
        vendor_id: vendorId,
        title: values.title,
        description: values.description,
        start_time: startDateTime,
        end_time: endDateTime,
        location: values.location,
        status: values.status,
        notes: values.notes,
      };

      onSubmit(appointmentData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} appointment: ${error.message}`,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Appointment" : "Schedule New Appointment"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update appointment details"
            : "Schedule a new appointment with this vendor"}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Venue Tour, Menu Tasting"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the appointment"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="time" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="time" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. Vendor's Office, Video Call"
                        className="pl-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes or meeting outcomes"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add any preparation notes or record meeting outcomes here
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
                {isEditing ? "Update Appointment" : "Schedule Appointment"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;

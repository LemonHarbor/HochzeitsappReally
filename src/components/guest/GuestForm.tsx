import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  Utensils,
} from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/lib/language";

// Form schema validation
const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  category: z.string(),
  dietaryRestrictions: z.string().optional(),
  plusOne: z.boolean().default(false),
  rsvpStatus: z.enum(["confirmed", "pending", "declined"]),
  notes: z.string().optional(),
});

type GuestFormValues = z.infer<typeof formSchema>;

interface GuestFormProps {
  initialData?: GuestFormValues;
  onSubmit?: (data: GuestFormValues) => void;
  isEditing?: boolean;
  onCancel?: () => void;
}

const GuestForm = ({
  initialData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    category: "friend",
    dietaryRestrictions: "",
    plusOne: false,
    rsvpStatus: "pending",
    notes: "",
  },
  onSubmit = (data) => {
    console.log(data);
    // In a real app, this would save the data to the backend
    // For now, we'll create a guest directly using the guestService
    try {
      import("@/services/guestService").then(({ createGuest }) => {
        createGuest(data).then(() => {
          console.log("Guest created successfully");
        });
      });
    } catch (error) {
      console.error("Error creating guest:", error);
    }
  },
  isEditing = false,
  onCancel = () => {},
}: GuestFormProps) => {
  const { t } = useLanguage();
  const form = useForm<GuestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: GuestFormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-lg bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {isEditing ? t("guests.editGuest") : t("guests.addGuest")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("guests.firstName")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="John" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("guests.lastName")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("guests.email")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("guests.phone")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder="+1 (555) 123-4567"
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("guests.category")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <div className="relative">
                          <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="family">
                          {t("guests.family")}
                        </SelectItem>
                        <SelectItem value="friend">
                          {t("guests.friends")}
                        </SelectItem>
                        <SelectItem value="colleague">
                          {t("guests.colleagues")}
                        </SelectItem>
                        <SelectItem value="other">
                          {t("guests.other")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="123 Wedding Lane, City"
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
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("guests.dietaryRestrictions")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Utensils className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        className="pl-9 min-h-[80px]"
                        placeholder="Vegetarian, allergies, etc."
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
              name="rsvpStatus"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t("guests.rsvpStatus")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="confirmed" id="confirmed" />
                        <label
                          htmlFor="confirmed"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t("guests.confirmed")}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pending" id="pending" />
                        <label
                          htmlFor="pending"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t("guests.pending")}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="declined" id="declined" />
                        <label
                          htmlFor="declined"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t("guests.declined")}
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plusOne"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{t("guests.plusOne")}</FormLabel>
                    <FormDescription>
                      Allow this guest to bring a companion
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("guests.notes")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information about this guest"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                {t("actions.cancel")}
              </Button>
              <Button type="submit">
                {isEditing ? t("actions.update") : t("actions.add")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GuestForm;

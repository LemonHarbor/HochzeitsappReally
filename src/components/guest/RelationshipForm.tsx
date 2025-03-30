import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Users, Heart, UserPlus, AlertTriangle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const formSchema = z
  .object({
    guest_id: z.string({
      required_error: "Please select a guest",
    }),
    related_guest_id: z.string({
      required_error: "Please select a related guest",
    }),
    relationship_type: z.enum(["family", "couple", "friend", "conflict"], {
      required_error: "Please select a relationship type",
    }),
    strength: z
      .number({
        required_error: "Please set a relationship strength",
      })
      .min(1)
      .max(10),
  })
  .refine((data) => data.guest_id !== data.related_guest_id, {
    message: "A guest cannot have a relationship with themselves",
    path: ["related_guest_id"],
  });

type FormValues = z.infer<typeof formSchema>;

interface Guest {
  id: string;
  name: string;
}

interface RelationshipFormProps {
  initialData?: Partial<FormValues>;
  guests: Guest[];
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const RelationshipForm: React.FC<RelationshipFormProps> = ({
  initialData = {},
  guests = [],
  onSubmit = () => {},
  onCancel = () => {},
  isEditing = false,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [strengthValue, setStrengthValue] = useState<number[]>([
    initialData.strength || 5,
  ]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guest_id: initialData.guest_id || "",
      related_guest_id: initialData.related_guest_id || "",
      relationship_type: initialData.relationship_type || "friend",
      strength: initialData.strength || 5,
    },
  });

  // Update form when slider changes
  useEffect(() => {
    form.setValue("strength", strengthValue[0]);
  }, [strengthValue, form]);

  const handleSubmit = (values: FormValues) => {
    try {
      onSubmit(values);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} relationship: ${error.message}`,
      });
    }
  };

  // Get relationship icon based on type
  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case "family":
        return <Users className="h-4 w-4" />;
      case "couple":
        return <Heart className="h-4 w-4" />;
      case "friend":
        return <UserPlus className="h-4 w-4" />;
      case "conflict":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  // Get strength label based on value
  const getStrengthLabel = (value: number) => {
    if (value <= 2) return "Weak";
    if (value <= 5) return "Moderate";
    if (value <= 8) return "Strong";
    return "Very Strong";
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Relationship" : "Create Relationship"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the relationship between these guests"
            : "Define how these guests are related to each other"}
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
              name="guest_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Guest</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a guest" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {guests.map((guest) => (
                        <SelectItem key={guest.id} value={guest.id}>
                          {guest.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the first guest in this relationship
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="related_guest_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Second Guest</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a guest" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {guests
                        .filter(
                          (guest) => guest.id !== form.getValues().guest_id,
                        )
                        .map((guest) => (
                          <SelectItem key={guest.id} value={guest.id}>
                            {guest.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the second guest in this relationship
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationship_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="family">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Family</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="couple">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <span>Couple</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="friend">
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          <span>Friend</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="conflict">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Conflict</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How these guests are related to each other
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="strength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Relationship Strength: {getStrengthLabel(field.value)}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      value={strengthValue}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => {
                        setStrengthValue(value);
                      }}
                      className="py-4"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Weak (1)</span>
                    <span>Moderate (5)</span>
                    <span>Strong (10)</span>
                  </div>
                  <FormDescription>
                    How strong is this relationship? This affects seating
                    arrangements.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Relationship" : "Create Relationship"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RelationshipForm;

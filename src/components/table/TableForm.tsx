import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Square, Circle, Table as TableIcon, Users } from "lucide-react";
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
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getAllGroups } from "@/services/tableService";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Table name must be at least 2 characters." }),
  shape: z.enum(["round", "rectangle", "custom"]),
  capacity: z.coerce
    .number()
    .min(1, { message: "Table must have at least 1 seat." })
    .max(20),
  location: z.string().optional(),
  notes: z.string().optional(),
  groupId: z.string().optional(),
});

type TableFormValues = z.infer<typeof formSchema>;

interface TableFormProps {
  onSubmit?: (values: TableFormValues) => void;
  initialData?: TableFormValues;
  isEditing?: boolean;
}

const TableForm = ({
  onSubmit = () => {},
  initialData = {
    name: "Table 1",
    shape: "round",
    capacity: 8,
    location: "Main Hall",
    notes: "",
    groupId: "",
  },
  isEditing = false,
}: TableFormProps) => {
  const { t } = useLanguage();
  const [groups, setGroups] = useState<
    Array<{ id: string; name: string; color: string; type: string }>
  >([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<TableFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Fetch available groups when component mounts
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const groupsData = await getAllGroups();
        setGroups(groupsData);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleSubmit = (values: TableFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full max-w-md bg-white">
      <CardHeader>
        <CardTitle>
          {isEditing ? t("tables.editTable") : t("tables.addTable")}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the properties of this table"
            : "Configure a new table for your seating arrangement"}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("tables.tableName")}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Family Table" {...field} />
                  </FormControl>
                  <FormDescription>
                    A unique name to identify this table
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("tables.shape")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a table shape" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="round">
                        <div className="flex items-center gap-2">
                          <Circle className="h-4 w-4" />
                          <span>{t("tables.round")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="rectangle">
                        <div className="flex items-center gap-2">
                          <Square className="h-4 w-4" />
                          <span>{t("tables.rectangle")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="custom">
                        <div className="flex items-center gap-2">
                          <TableIcon className="h-4 w-4" />
                          <span>{t("tables.custom")}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The shape affects how guests are arranged
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("tables.capacity")}</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="20" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum number of guests at this table
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign to a group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Group</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          <div className="flex items-center gap-2">
                            {group.type === "bestman" && (
                              <Users className="h-4 w-4" />
                            )}
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: group.color }}
                            />
                            <span>{group.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Assign this table to a specific group for filtering and
                    organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("tables.location")} (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Main Hall, Near Stage"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Where this table is located in the venue
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("guests.notes")} (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Any special considerations for this table"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional information about this table
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline">
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

export default TableForm;

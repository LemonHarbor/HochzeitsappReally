import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";
import { useRealtimeVendors } from "@/hooks/useRealtimeVendors";
import { useCurrency } from "@/lib/currency";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  category: z.string({
    required_error: "Please select a category",
  }),
  amount: z.coerce
    .number()
    .min(0.01, { message: "Amount must be greater than 0" }),
  date: z.date({
    required_error: "Please select a date",
  }),
  status: z.enum(["paid", "pending", "cancelled"], {
    required_error: "Please select a status",
  }),
  vendor_id: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  initialData?: Partial<FormValues>;
  categories?: string[];
  vendors?: { id: string; name: string }[];
  onSubmit?: (data: FormValues, receipt?: File) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  vendorId?: string;
}

const ExpenseForm = ({
  initialData = {},
  categories = [
    "Venue",
    "Catering",
    "Decoration",
    "Photography",
    "Videography",
    "Attire",
    "Beauty",
    "Transportation",
    "Entertainment",
    "Stationery",
    "Gifts",
    "Jewelry",
    "Other",
  ],
  vendors = [],
  vendorId,
  onSubmit = () => {},
  onCancel = () => {},
  isEditing = false,
}: ExpenseFormProps) => {
  const { t } = useLanguage();
  const { currencySymbol } = useCurrency();
  const [receipt, setReceipt] = useState<File | null>(null);
  const { vendors: dbVendors, loading: vendorsLoading } = useRealtimeVendors();

  // Combine provided vendors with those from the database
  const allVendors = [
    ...vendors,
    ...dbVendors.map((v) => ({ id: v.id, name: v.name })),
  ].filter((v, i, self) => self.findIndex((sv) => sv.id === v.id) === i);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || "",
      category: initialData.category || "",
      amount: initialData.amount || 0,
      date: initialData.date || new Date(),
      status: initialData.status || "pending",
      vendor_id: initialData.vendor_id || vendorId || "",
      notes: initialData.notes || "",
    },
  });

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    // If vendor is selected, ensure it's properly passed
    if (values.vendor_id === "none") {
      values.vendor_id = undefined;
    }
    onSubmit(values, receipt || undefined);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceipt(e.target.files[0]);
    }
  };

  // Remove uploaded file
  const removeFile = () => {
    setReceipt(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Expense" : "Add New Expense"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expense Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Venue Deposit" {...field} />
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
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">
                          {currencySymbol}
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="pl-7"
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a vendor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {allVendors.map((vendor) => (
                          <SelectItem
                            key={vendor.id}
                            value={vendor.id}
                            selected={vendorId === vendor.id}
                          >
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a vendor or leave blank
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional details about this expense"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Receipt/Invoice (Optional)</FormLabel>
              {receipt ? (
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <div className="bg-muted p-2 rounded-md mr-2">
                      <Upload className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{receipt.name}</p>
                      <p className="text-muted-foreground">
                        {(receipt.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <input
                    type="file"
                    id="receipt"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="receipt"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium mb-1">
                      Click to upload receipt or invoice
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG or GIF (max. 5MB)
                    </p>
                  </label>
                </div>
              )}
            </div>

            <CardFooter className="px-0 pt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Expense" : "Add Expense"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;

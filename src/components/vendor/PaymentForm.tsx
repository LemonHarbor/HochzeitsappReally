import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X } from "lucide-react";
import { useToast } from "../../../../src/components/ui/use-toast";
import { useLanguage } from "../../../../src/lib/language";
import { useCurrency } from "../../../../src/lib/currency";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../src/components/ui/form";
import { Input } from "../../../../src/components/ui/input";
import { Button } from "../../../../src/components/ui/button";
import { Textarea } from "../../../../src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../src/components/ui/card";
import { Calendar } from "../../../../src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../src/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../../../src/lib/utils";

const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, { message: "Amount must be greater than 0" }),
  payment_date: z.date().optional(),
  due_date: z.date({
    required_error: "Due date is required",
  }),
  status: z.enum(["paid", "pending", "cancelled"], {
    required_error: "Please select a status",
  }),
  payment_type: z.enum(["deposit", "installment", "final"], {
    required_error: "Please select a payment type",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentFormProps {
  vendorId: string;
  initialData?: Partial<FormValues>;
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  vendorId,
  initialData = {},
  onSubmit = () => {},
  onCancel = () => {},
  isEditing = false,
}) => {
  const { t } = useLanguage();
  const { formatCurrency, currencySymbol } = useCurrency();
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: initialData.amount || 0,
      payment_date: initialData.payment_date
        ? new Date(initialData.payment_date)
        : undefined,
      due_date: initialData.due_date
        ? new Date(initialData.due_date)
        : new Date(),
      status: initialData.status || "pending",
      payment_type: initialData.payment_type || "deposit",
      notes: initialData.notes || "",
    },
  });

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    try {
      // Add vendor_id to the data
      const paymentData = {
        ...values,
        vendor_id: vendorId,
      };
      onSubmit(paymentData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} payment: ${error.message}`,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Payment" : "Add New Payment"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update payment information"
            : "Add a new payment for this vendor"}
        </CardDescription>
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
                name="payment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="installment">Installment</SelectItem>
                        <SelectItem value="final">Final Payment</SelectItem>
                      </SelectContent>
                    </Select>
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
                name="payment_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Payment Date (if paid)</FormLabel>
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
                              <span>Select date</span>
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
                    <FormDescription>
                      Leave blank if payment is pending
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
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
                              <span>Select date</span>
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
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional details about this payment"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
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
                {isEditing ? "Update Payment" : "Add Payment"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DollarSign, Euro, Save, X } from "lucide-react";
import { useCurrency } from "@/lib/currency";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  amount: z.coerce
    .number()
    .min(0, { message: "Amount must be a positive number" }),
  percentage: z.coerce
    .number()
    .min(0, { message: "Percentage must be a positive number" })
    .max(100, { message: "Percentage cannot exceed 100%" }),
  color: z.string().regex(/^#([0-9A-F]{6})$/i, {
    message: "Please enter a valid hex color code",
  }),
  recommended: z.coerce
    .number()
    .min(0, { message: "Recommended percentage must be a positive number" })
    .max(100, { message: "Recommended percentage cannot exceed 100%" }),
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetFormProps {
  initialData?: Partial<FormValues>;
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  totalBudget?: number;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  initialData = {
    name: "",
    amount: 0,
    percentage: 0,
    color: "#4f46e5",
    recommended: 0,
  },
  onSubmit = () => {},
  onCancel = () => {},
  isEditing = false,
  totalBudget = 20000,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isCalculatingFromAmount, setIsCalculatingFromAmount] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Watch for changes to amount and percentage to keep them in sync
  const amount = form.watch("amount");
  const percentage = form.watch("percentage");

  // Update percentage when amount changes
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value) || 0;
    form.setValue("amount", newAmount);

    if (totalBudget > 0 && !isCalculatingFromAmount) {
      setIsCalculatingFromAmount(true);
      const newPercentage = (newAmount / totalBudget) * 100;
      form.setValue("percentage", parseFloat(newPercentage.toFixed(2)));
      setIsCalculatingFromAmount(false);
    }
  };

  // Update amount when percentage changes
  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = parseFloat(e.target.value) || 0;
    form.setValue("percentage", newPercentage);

    if (totalBudget > 0 && isCalculatingFromAmount === false) {
      const newAmount = (newPercentage / 100) * totalBudget;
      form.setValue("amount", parseFloat(newAmount.toFixed(2)));
    }
  };

  const handleSubmit = (values: FormValues) => {
    try {
      onSubmit(values);
      toast({
        title: isEditing ? "Category Updated" : "Category Added",
        description: `Budget category ${values.name} has been ${isEditing ? "updated" : "added"} successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} budget category: ${error.message}`,
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Budget Category" : "Add Budget Category"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the details of this budget category"
            : "Create a new category for your wedding budget"}
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
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Venue, Catering, Photography"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this budget category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allocated Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        {useCurrency().currency === "USD" ? (
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        ) : (
                          <span className="absolute left-3 top-2.5 text-muted-foreground">
                            €
                          </span>
                        )}
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="pl-9"
                          {...field}
                          onChange={handleAmountChange}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Amount allocated to this category
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentage of Budget</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0"
                          {...field}
                          onChange={handlePercentageChange}
                        />
                        <span className="absolute right-3 top-2.5 text-muted-foreground">
                          %
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Percentage of total budget (
                      {totalBudget
                        ? `$${totalBudget.toLocaleString()}`
                        : "total"}
                      )
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          {...field}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          placeholder="#RRGGBB"
                          {...field}
                          className="flex-1"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Color used for charts and visualizations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recommended"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recommended Percentage</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0"
                          {...field}
                        />
                        <span className="absolute right-3 top-2.5 text-muted-foreground">
                          %
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Typical percentage for this category
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0 pt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Category" : "Add Category"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BudgetForm;

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Save,
  Sparkles,
  RefreshCw,
  DollarSign,
  Euro,
} from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useCurrency } from "@/lib/currency";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  spent: number;
  color: string;
  recommended: number;
}

interface BudgetPlannerProps {
  totalBudget?: number;
  categories?: BudgetCategory[];
  onSaveBudget?: (totalBudget: number, categories: BudgetCategory[]) => void;
  onResetToRecommended?: () => void;
  onAddEditCategory?: (category: BudgetCategory) => void;
}

const BudgetPlanner = ({
  totalBudget: initialTotalBudget = 20000,
  categories: initialCategories = [
    {
      id: "venue",
      name: "Venue",
      percentage: 40,
      amount: 8000,
      spent: 7500,
      color: "#4f46e5",
      recommended: 40,
    },
    {
      id: "catering",
      name: "Catering",
      percentage: 25,
      amount: 5000,
      spent: 2800,
      color: "#0ea5e9",
      recommended: 25,
    },
    {
      id: "decoration",
      name: "Decoration",
      percentage: 10,
      amount: 2000,
      spent: 1200,
      color: "#10b981",
      recommended: 10,
    },
    {
      id: "photography",
      name: "Photography",
      percentage: 12.5,
      amount: 2500,
      spent: 500,
      color: "#f59e0b",
      recommended: 12.5,
    },
    {
      id: "attire",
      name: "Attire",
      percentage: 7.5,
      amount: 1500,
      spent: 350,
      color: "#ef4444",
      recommended: 7.5,
    },
    {
      id: "other",
      name: "Other",
      percentage: 5,
      amount: 1000,
      spent: 0,
      color: "#8b5cf6",
      recommended: 5,
    },
  ],
  onSaveBudget = () => {},
  onResetToRecommended = () => {},
  onAddEditCategory = () => {},
}: BudgetPlannerProps) => {
  const { t } = useLanguage();
  const { formatCurrency, currencySymbol } = useCurrency();
  const { toast } = useToast();
  const [totalBudget, setTotalBudget] = useState(initialTotalBudget);
  const [categories, setCategories] =
    useState<BudgetCategory[]>(initialCategories);
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(initialTotalBudget.toString());
  const draggedItem = useRef<string | null>(null);

  // Calculate total percentage (should be 100%)
  const totalPercentage = categories.reduce(
    (sum, category) => sum + category.percentage,
    0,
  );

  // Add a debug check for total percentage
  React.useEffect(() => {
    if (Math.abs(totalPercentage - 100) > 1) {
      console.warn(
        `Budget percentages don't add up to 100%. Current total: ${totalPercentage.toFixed(2)}%`,
      );
    }
  }, [totalPercentage]);

  // Check if any category is over budget
  const overBudgetCategories = categories.filter(
    (category) => category.spent > category.amount,
  );

  // Handle budget input change
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempBudget(e.target.value);
  };

  // Save new budget
  const saveBudget = () => {
    const newBudget = parseFloat(tempBudget);
    if (isNaN(newBudget) || newBudget <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid budget",
        description: "Please enter a valid budget amount greater than zero.",
      });
      return;
    }

    setTotalBudget(newBudget);
    setEditingBudget(false);

    // Update category amounts based on percentages
    const updatedCategories = categories.map((category) => ({
      ...category,
      amount: (category.percentage / 100) * newBudget,
    }));

    setCategories(updatedCategories);
  };

  // Handle slider change for a category
  const handleSliderChange = (id: string, newValue: number[]) => {
    const newPercentage = newValue[0];
    const oldCategory = categories.find((c) => c.id === id);
    const oldPercentage = oldCategory?.percentage || 0;
    const difference = newPercentage - oldPercentage;

    // Don't allow less than 1% for any category
    if (newPercentage < 1) return;

    // If we're trying to increase beyond what's available, cap it
    if (
      difference > 0 &&
      totalPercentage >= 100 &&
      newPercentage > oldPercentage
    ) {
      const availablePercentage = 100 - (totalPercentage - oldPercentage);
      if (newPercentage > availablePercentage) return;
    }

    // Adjust other categories proportionally
    const updatedCategories = categories.map((category) => {
      if (category.id === id) {
        return {
          ...category,
          percentage: newPercentage,
          amount: (newPercentage / 100) * totalBudget,
        };
      } else {
        // Only adjust other categories if we need to maintain 100% total
        if (Math.abs(totalPercentage - 100) < 0.1) {
          // Calculate how much to reduce this category by
          const otherCategoriesTotal = totalPercentage - oldPercentage;
          const reductionFactor = category.percentage / otherCategoriesTotal;
          const reduction = difference * reductionFactor;

          // Ensure no category goes below 1%
          const newCategoryPercentage = Math.max(
            1,
            category.percentage - reduction,
          );

          return {
            ...category,
            percentage: newCategoryPercentage,
            amount: (newCategoryPercentage / 100) * totalBudget,
          };
        }
        return category;
      }
    });

    // Normalize to ensure total is exactly 100%
    const newTotal = updatedCategories.reduce(
      (sum, category) => sum + category.percentage,
      0,
    );

    // Only normalize if we're significantly off from 100%
    if (Math.abs(newTotal - 100) > 0.1) {
      const normalizedCategories = updatedCategories.map((category) => {
        const normalizedPercentage = (category.percentage / newTotal) * 100;
        return {
          ...category,
          percentage: normalizedPercentage,
          amount: (normalizedPercentage / 100) * totalBudget,
        };
      });
      setCategories(normalizedCategories);
    } else {
      // If we're close enough to 100%, just use the updated categories
      setCategories(updatedCategories);
    }
  };

  // Reset to recommended percentages
  const resetToRecommended = () => {
    // First check if recommended percentages add up to 100%
    const totalRecommended = categories.reduce(
      (sum, category) => sum + category.recommended,
      0,
    );

    let updatedCategories;
    if (Math.abs(totalRecommended - 100) > 0.1) {
      // Normalize recommended values to ensure they add up to 100%
      updatedCategories = categories.map((category) => {
        const normalizedRecommended =
          (category.recommended / totalRecommended) * 100;
        return {
          ...category,
          percentage: normalizedRecommended,
          amount: (normalizedRecommended / 100) * totalBudget,
        };
      });
    } else {
      updatedCategories = categories.map((category) => ({
        ...category,
        percentage: category.recommended,
        amount: (category.recommended / 100) * totalBudget,
      }));
    }

    setCategories(updatedCategories);
    onResetToRecommended();

    toast({
      title: "Budget reset",
      description: "Your budget has been reset to recommended allocations.",
    });
  };

  // Save budget plan
  const saveBudgetPlan = () => {
    // Normalize categories before saving to ensure exactly 100%
    const normalizedCategories = [...categories];
    const total = normalizedCategories.reduce(
      (sum, category) => sum + category.percentage,
      0,
    );

    if (Math.abs(total - 100) > 0.1) {
      // Adjust categories to exactly 100%
      const adjustedCategories = normalizedCategories.map((category) => {
        const adjustedPercentage = (category.percentage / total) * 100;
        return {
          ...category,
          percentage: adjustedPercentage,
          amount: (adjustedPercentage / 100) * totalBudget,
        };
      });
      onSaveBudget(totalBudget, adjustedCategories);
    } else {
      onSaveBudget(totalBudget, categories);
    }

    toast({
      title: "Budget saved",
      description: "Your budget plan has been saved successfully.",
    });
  };

  // Drag and drop handlers
  const handleDragStart = (id: string) => {
    draggedItem.current = id;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedItem.current || draggedItem.current === targetId) return;

    const draggedIndex = categories.findIndex(
      (c) => c.id === draggedItem.current,
    );
    const targetIndex = categories.findIndex((c) => c.id === targetId);

    const newCategories = [...categories];
    const draggedItem2 = newCategories[draggedIndex];
    newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, draggedItem2);

    setCategories(newCategories);
    draggedItem.current = null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Budget Planner</h1>
          <p className="text-muted-foreground">
            Plan and allocate your wedding budget
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToRecommended}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Recommended
          </Button>
          <Button onClick={saveBudgetPlan}>
            <Save className="mr-2 h-4 w-4" />
            Save Budget Plan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Wedding Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {editingBudget ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                  {currencySymbol === "$" ? (
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Euro className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  )}
                  <Input
                    type="number"
                    value={tempBudget}
                    onChange={handleBudgetChange}
                    className="pl-9 w-[200px]"
                    placeholder="Enter budget amount"
                  />
                </div>
                <Button onClick={saveBudget}>Save</Button>
                <Button variant="ghost" onClick={() => setEditingBudget(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">
                  {formatCurrency(totalBudget)}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTempBudget(totalBudget.toString());
                    setEditingBudget(true);
                  }}
                >
                  Edit Budget
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-primary"
              onClick={() => {
                toast({
                  title: "Budget Recommendation",
                  description:
                    "Our AI suggests a budget of $20,000 - $25,000 for 100 guests in your area.",
                });
              }}
            >
              <Sparkles className="h-4 w-4" />
              Get AI Budget Recommendation
            </Button>
          </div>

          {overBudgetCategories.length > 0 && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Budget Warning</AlertTitle>
              <AlertDescription>
                {overBudgetCategories.length === 1
                  ? `Your ${overBudgetCategories[0].name} category is over budget by ${formatCurrency(overBudgetCategories[0].spent - overBudgetCategories[0].amount)}.`
                  : `${overBudgetCategories.length} categories are over budget. Consider adjusting your allocations.`}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 border rounded-lg hover:border-primary transition-colors"
                draggable
                onDragStart={() => handleDragStart(category.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(category.id)}
                onClick={() => onAddEditCategory(category)}
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <h3 className="font-medium">{category.name}</h3>
                    {category.spent > category.amount && (
                      <Badge variant="destructive" className="ml-2">
                        Over Budget
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Recommended: {category.recommended}%
                    </div>
                    <div className="font-medium">
                      {formatCurrency(category.amount)}
                    </div>
                    <div className="text-sm font-medium">
                      {Math.round(category.percentage)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[category.percentage]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) =>
                      handleSliderChange(category.id, value)
                    }
                  />

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Spent: {formatCurrency(category.spent)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Remaining:{" "}
                      {formatCurrency(
                        Math.max(0, category.amount - category.spent),
                      )}
                    </div>
                  </div>

                  <Progress
                    value={Math.min(
                      100,
                      (category.spent / category.amount) * 100,
                    )}
                    className="h-2"
                    style={{
                      backgroundColor: `${category.color}33`,
                      // @ts-ignore - Custom CSS property
                      "--progress-color":
                        category.spent > category.amount
                          ? "hsl(var(--destructive))"
                          : category.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            Drag and drop categories to reorder them. Adjust the sliders to
            reallocate your budget.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPlanner;

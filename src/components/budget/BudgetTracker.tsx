import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BudgetDashboard from "@/components/budget/BudgetDashboard";
import ExpenseList from "@/components/budget/ExpenseList";
import ExpenseForm from "@/components/budget/ExpenseForm";
import BudgetPlanner from "@/components/budget/BudgetPlanner";
import BudgetForm from "@/components/budget/BudgetForm";
import BudgetReports from "@/components/budget/BudgetReports";
import VendorManager from "@/components/vendor/VendorManager";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/language";
import {
  getExpenses,
  getBudgetCategories,
  createExpense,
  updateExpense,
  deleteExpense,
  createBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategory,
  updateTotalBudget,
  uploadReceipt,
} from "@/services/budgetService";
import { linkVendorToExpense } from "@/services/vendorService";
import { exportBudgetReportCSV } from "@/services/reportService";

interface Expense {
  id?: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "cancelled";
  vendor?: string;
  notes?: string;
  receipt_url?: string;
}

interface BudgetCategory {
  id?: string;
  name: string;
  percentage: number;
  amount: number;
  spent: number;
  color: string;
  recommended: number;
}

interface BudgetTrackerProps {
  initialTotalBudget?: number;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  initialTotalBudget = 20000,
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [currentCategory, setCurrentCategory] = useState<BudgetCategory | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // State for budget data
  const [totalBudget, setTotalBudget] = useState(initialTotalBudget);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch expenses and categories from the database
        const expensesData = await getExpenses();
        const categoriesData = await getBudgetCategories();

        setExpenses(expensesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching budget data:", error);
        toast({
          variant: "destructive",
          title: t("misc.error"),
          description: `Failed to load budget data: ${error.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast, t]);

  // Calculate total spent
  const totalSpent = expenses.reduce(
    (sum, expense) =>
      sum + (expense.status !== "cancelled" ? expense.amount : 0),
    0,
  );

  // Handle adding a new expense
  const handleAddExpense = () => {
    setIsEditing(false);
    setCurrentExpense(null);
    setShowExpenseForm(true);
  };

  // Handle editing an expense
  const handleEditExpense = (expense: Expense) => {
    setIsEditing(true);
    setCurrentExpense(expense);
    setShowExpenseForm(true);
  };

  // Handle deleting an expense
  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense.id !== id));

      // Update category spent amounts
      updateCategorySpentAmounts(
        expenses.filter((expense) => expense.id !== id),
      );

      toast({
        title: "Expense deleted",
        description: "The expense has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `Failed to delete expense: ${error.message}`,
      });
    }
  };

  // Update category spent amounts based on expenses
  const updateCategorySpentAmounts = (currentExpenses: Expense[]) => {
    const categorySpent = {};

    // Calculate total spent per category
    currentExpenses.forEach((expense) => {
      if (expense.status !== "cancelled") {
        categorySpent[expense.category] =
          (categorySpent[expense.category] || 0) + expense.amount;
      }
    });

    // Update categories with new spent amounts
    const updatedCategories = categories.map((category) => ({
      ...category,
      spent: categorySpent[category.name] || 0,
    }));

    setCategories(updatedCategories);
  };

  // Handle expense form submission
  const handleExpenseSubmit = async (data: any, receipt?: File) => {
    try {
      let expenseData: Expense = {
        name: data.name,
        category: data.category,
        amount: data.amount,
        date: data.date.toISOString().split("T")[0],
        status: data.status,
        vendor_id: data.vendor_id === "none" ? undefined : data.vendor_id,
        notes: data.notes,
      };

      // Store the vendor ID if it's selected
      const vendorId = data.vendor_id !== "none" ? data.vendor_id : null;

      let savedExpense;

      if (isEditing && currentExpense?.id) {
        // Update existing expense
        savedExpense = await updateExpense(currentExpense.id, expenseData);

        // Link to vendor if provided
        if (vendorId) {
          await linkVendorToExpense(currentExpense.id, vendorId);
        }

        // Update expenses list
        setExpenses(
          expenses.map((expense) =>
            expense.id === currentExpense.id ? savedExpense : expense,
          ),
        );

        toast({
          title: "Expense updated",
          description: "The expense has been updated successfully.",
        });
      } else {
        // Add new expense
        savedExpense = await createExpense(expenseData);

        // Link to vendor if provided
        if (vendorId) {
          await linkVendorToExpense(savedExpense.id, vendorId);
        }

        setExpenses([savedExpense, ...expenses]);

        toast({
          title: "Expense added",
          description: "The new expense has been added successfully.",
        });
      }

      // Handle receipt upload if provided
      if (receipt && savedExpense.id) {
        const receiptUrl = await uploadReceipt(receipt, savedExpense.id);

        // Update the expense with the receipt URL
        const updatedExpense = { ...savedExpense, receipt_url: receiptUrl };

        setExpenses(
          expenses.map((expense) =>
            expense.id === savedExpense.id ? updatedExpense : expense,
          ),
        );
      }

      // Update category spent amounts
      updateCategorySpentAmounts([...expenses, savedExpense]);

      setShowExpenseForm(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `Failed to save expense: ${error.message}`,
      });
    }
  };

  // Handle viewing a receipt
  const handleViewReceipt = (url: string) => {
    window.open(url, "_blank");
  };

  // Handle exporting budget
  const handleExportBudget = () => {
    // Generate a CSV of expenses
    const headers = [
      "Name",
      "Category",
      "Amount",
      "Date",
      "Status",
      "Vendor",
      "Notes",
    ];
    const csvContent = [
      headers.join(","),
      ...expenses.map((expense) =>
        [
          `"${expense.name}"`,
          `"${expense.category}"`,
          expense.amount,
          expense.date,
          `"${expense.status}"`,
          `"${expense.vendor || ""}"`,
          `"${expense.notes || ""}"`,
        ].join(","),
      ),
    ].join("\n");

    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `wedding_budget_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Budget exported",
      description: "Your budget report has been downloaded.",
    });
  };

  // Handle exporting detailed budget report
  const handleExportReport = async () => {
    try {
      const { filename, content } = await exportBudgetReportCSV();

      // Create a download link
      const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Report exported",
        description: "Your detailed budget report has been downloaded.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `Failed to export report: ${error.message}`,
      });
    }
  };

  // Handle adding/editing a budget category
  const handleAddEditCategory = (category: any) => {
    setIsEditing(!!category.id);
    setCurrentCategory(category);
    setShowBudgetForm(true);
  };

  // Handle budget form submission
  const handleBudgetFormSubmit = async (formData: any) => {
    try {
      if (isEditing && currentCategory?.id) {
        // Update existing category
        const updatedCategory = await updateBudgetCategory(currentCategory.id, {
          name: formData.name,
          percentage: formData.percentage,
          amount: formData.amount,
          color: formData.color,
          recommended: formData.recommended,
        });

        // Update categories state
        setCategories(
          categories.map((cat) =>
            cat.id === currentCategory.id
              ? { ...cat, ...updatedCategory }
              : cat,
          ),
        );

        toast({
          title: "Category updated",
          description: `Budget category ${formData.name} has been updated successfully.`,
        });
      } else {
        // Add new category
        const newCategory = await createBudgetCategory({
          name: formData.name,
          percentage: formData.percentage,
          amount: formData.amount,
          color: formData.color,
          recommended: formData.recommended,
          spent: 0,
        });

        // Update categories state
        setCategories([...categories, newCategory]);

        toast({
          title: "Category added",
          description: `Budget category ${formData.name} has been added successfully.`,
        });
      }

      setShowBudgetForm(false);
      setCurrentCategory(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `Failed to ${isEditing ? "update" : "add"} budget category: ${error.message}`,
      });
    }
  };

  // Handle saving budget plan
  const handleSaveBudgetPlan = async (
    newTotalBudget: number,
    newCategories: BudgetCategory[],
  ) => {
    try {
      // Update total budget
      await updateTotalBudget(newTotalBudget);
      setTotalBudget(newTotalBudget);

      // Update each category
      for (const category of newCategories) {
        if (category.id) {
          await updateBudgetCategory(category.id, {
            percentage: category.percentage,
            amount: category.amount,
          });
        }
      }

      setCategories(newCategories);

      toast({
        title: "Budget plan saved",
        description: "Your budget allocations have been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: `Failed to save budget plan: ${error.message}`,
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="planner">Budget Planner</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <BudgetDashboard
            totalBudget={totalBudget}
            totalSpent={totalSpent}
            categories={categories.map((cat) => ({
              name: cat.name,
              allocated: cat.amount,
              spent: cat.spent,
              color: cat.color,
            }))}
            recentExpenses={expenses.slice(0, 4)}
            onAddExpense={handleAddExpense}
            onViewAllExpenses={() => setActiveTab("expenses")}
            onExportBudget={handleExportBudget}
          />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <ExpenseList
            expenses={expenses}
            categories={categories.map((c) => c.name)}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onViewReceipt={handleViewReceipt}
          />
        </TabsContent>

        <TabsContent value="planner" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Budget Categories</h2>
            <Button
              onClick={() => {
                setIsEditing(false);
                setCurrentCategory(null);
                setShowBudgetForm(true);
              }}
            >
              Add Category
            </Button>
          </div>
          <BudgetPlanner
            totalBudget={totalBudget}
            categories={categories}
            onSaveBudget={handleSaveBudgetPlan}
            onAddEditCategory={handleAddEditCategory}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <BudgetReports
            expenses={expenses}
            categories={categories.map((cat) => ({
              name: cat.name,
              allocated: cat.amount,
              spent: cat.spent,
              color: cat.color,
            }))}
            totalBudget={totalBudget}
            totalSpent={totalSpent}
            onExportReport={handleExportReport}
          />
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <VendorManager
            onAddExpense={(vendorId) => {
              setSelectedVendorId(vendorId);
              setShowExpenseForm(true);
            }}
            onViewReceipt={handleViewReceipt}
          />
        </TabsContent>
      </Tabs>

      {/* Expense Form Dialog */}
      <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
        <DialogContent className="sm:max-w-[600px]">
          <ExpenseForm
            initialData={currentExpense || {}}
            categories={categories.map((c) => c.name)}
            onSubmit={handleExpenseSubmit}
            onCancel={() => setShowExpenseForm(false)}
            isEditing={isEditing}
            vendorId={selectedVendorId}
          />
        </DialogContent>
      </Dialog>

      {/* Budget Category Form Dialog */}
      <Dialog open={showBudgetForm} onOpenChange={setShowBudgetForm}>
        <DialogContent className="sm:max-w-[600px]">
          <BudgetForm
            initialData={currentCategory || {}}
            onSubmit={handleBudgetFormSubmit}
            onCancel={() => setShowBudgetForm(false)}
            isEditing={isEditing}
            totalBudget={totalBudget}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetTracker;

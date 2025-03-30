import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, Download, Filter, ArrowUpDown } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useCurrency } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";

interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "cancelled";
  vendor?: string;
}

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

interface BudgetDashboardProps {
  totalBudget?: number;
  totalSpent?: number;
  categories?: BudgetCategory[];
  recentExpenses?: Expense[];
  onAddExpense?: () => void;
  onViewAllExpenses?: () => void;
  onExportBudget?: () => void;
}

const BudgetDashboard = ({
  totalBudget = 20000,
  totalSpent = 12350,
  categories = [
    { name: "Venue", allocated: 8000, spent: 7500, color: "#4f46e5" },
    { name: "Catering", allocated: 5000, spent: 2800, color: "#0ea5e9" },
    { name: "Decoration", allocated: 2000, spent: 1200, color: "#10b981" },
    { name: "Photography", allocated: 2500, spent: 500, color: "#f59e0b" },
    { name: "Attire", allocated: 1500, spent: 350, color: "#ef4444" },
    { name: "Other", allocated: 1000, spent: 0, color: "#8b5cf6" },
  ],
  recentExpenses = [
    {
      id: "exp1",
      name: "Venue Deposit",
      category: "Venue",
      amount: 2500,
      date: "2024-06-01",
      status: "paid",
      vendor: "Grand Plaza Hotel",
    },
    {
      id: "exp2",
      name: "Catering Deposit",
      category: "Catering",
      amount: 1000,
      date: "2024-06-05",
      status: "paid",
      vendor: "Elite Catering",
    },
    {
      id: "exp3",
      name: "Photographer Booking",
      category: "Photography",
      amount: 500,
      date: "2024-06-10",
      status: "paid",
      vendor: "MemoryMakers Photography",
    },
    {
      id: "exp4",
      name: "Floral Arrangements",
      category: "Decoration",
      amount: 800,
      date: "2024-06-15",
      status: "pending",
      vendor: "Blooming Beauties",
    },
  ],
  onAddExpense = () => {},
  onViewAllExpenses = () => {},
  onExportBudget = () => {},
}: BudgetDashboardProps) => {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const percentSpent = Math.round((totalSpent / totalBudget) * 100);
  const remaining = totalBudget - totalSpent;

  // Prepare data for pie chart
  const chartData = categories.map((category) => ({
    name: category.name,
    value: category.spent,
    color: category.color,
  }));

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Budget Tracker</h1>
          <p className="text-muted-foreground">Manage your wedding expenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExportBudget}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={onAddExpense}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Budget Overview Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {percentSpent}% of budget spent
                </span>
                <span className="text-sm font-medium">
                  {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
                </span>
              </div>
              <Progress value={percentSpent} className="h-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Total Budget
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalBudget)}
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Remaining Budget
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(remaining)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Budget Allocation</h3>
              <div className="space-y-3">
                {categories.map((category) => {
                  const percentAllocated = Math.round(
                    (category.allocated / totalBudget) * 100,
                  );
                  const percentSpent = Math.round(
                    (category.spent / category.allocated) * 100,
                  );

                  return (
                    <div key={category.name} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="text-sm font-medium">
                            {category.name}
                          </span>
                        </div>
                        <div className="text-sm">
                          {formatCurrency(category.spent)} /{" "}
                          {formatCurrency(category.allocated)}
                        </div>
                      </div>
                      <Progress
                        value={percentSpent}
                        className="h-1.5"
                        style={{
                          backgroundColor: `${category.color}33`,
                          // @ts-ignore - Custom CSS property
                          "--progress-color": category.color,
                        }}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{percentSpent}% spent</span>
                        <span>{percentAllocated}% of total budget</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Distribution Card */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center text-sm">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="truncate">{category.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Recent Expenses</CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewAllExpenses}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 p-4 text-sm font-medium border-b">
              <div className="col-span-2">Expense</div>
              <div>Category</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Status</div>
            </div>
            <div className="divide-y">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="grid grid-cols-5 p-4 text-sm items-center hover:bg-muted/50 transition-colors"
                >
                  <div className="col-span-2">
                    <div className="font-medium">{expense.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(expense.date)}
                    </div>
                  </div>
                  <div>{expense.category}</div>
                  <div className="text-right font-medium">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusBadge(expense.status)}>
                      {expense.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetDashboard;

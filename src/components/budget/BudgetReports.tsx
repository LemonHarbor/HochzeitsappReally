import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/currency";
import { useLanguage } from "@/lib/language";
import {
  Download,
  Calendar,
  PieChart,
  BarChart,
  TrendingUp,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
} from "date-fns";

interface Expense {
  id: string;
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
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

interface BudgetReportsProps {
  expenses: Expense[];
  categories: BudgetCategory[];
  totalBudget: number;
  totalSpent: number;
  onExportReport?: () => void;
}

const BudgetReports: React.FC<BudgetReportsProps> = ({
  expenses,
  categories,
  totalBudget,
  totalSpent,
  onExportReport = () => {},
}) => {
  const { formatCurrency } = useCurrency();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("all");

  // Filter expenses based on time range
  const filteredExpenses = expenses.filter((expense) => {
    if (timeRange === "all") return true;

    const expenseDate = new Date(expense.date);
    const now = new Date();

    if (timeRange === "month") {
      return expenseDate >= startOfMonth(now) && expenseDate <= endOfMonth(now);
    } else if (timeRange === "3months") {
      return expenseDate >= subMonths(now, 3);
    } else if (timeRange === "6months") {
      return expenseDate >= subMonths(now, 6);
    }

    return true;
  });

  // Calculate spending by category
  const spendingByCategory = categories.map((category) => ({
    name: category.name,
    value: category.spent,
    color: category.color,
    allocated: category.allocated,
  }));

  // Calculate budget vs actual
  const budgetVsActual = categories.map((category) => ({
    name: category.name,
    budget: category.allocated,
    actual: category.spent,
    variance: category.allocated - category.spent,
  }));

  // Calculate monthly spending
  const getMonthlySpending = () => {
    // Get the last 6 months
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5); // 5 months ago to include current month

    const months = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(now),
    });

    // Initialize data structure with months
    const monthlyData = months.map((month) => ({
      month: format(month, "MMM yyyy"),
      total: 0,
    }));

    // Add expense amounts to corresponding months
    expenses.forEach((expense) => {
      if (expense.status !== "cancelled") {
        const expenseDate = new Date(expense.date);
        const monthKey = format(expenseDate, "MMM yyyy");

        const monthEntry = monthlyData.find(
          (entry) => entry.month === monthKey,
        );
        if (monthEntry) {
          monthEntry.total += expense.amount;
        }
      }
    });

    return monthlyData;
  };

  // Calculate spending trends by category over time
  const getCategoryTrends = () => {
    // Get the last 6 months
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);

    const months = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(now),
    });

    // Initialize data structure with months
    const trendData = months.map((month) => {
      const monthObj: any = {
        month: format(month, "MMM yyyy"),
      };

      // Initialize each category with 0
      categories.forEach((category) => {
        monthObj[category.name] = 0;
      });

      return monthObj;
    });

    // Add expense amounts to corresponding months and categories
    expenses.forEach((expense) => {
      if (expense.status !== "cancelled") {
        const expenseDate = new Date(expense.date);
        const monthKey = format(expenseDate, "MMM yyyy");

        const monthEntry = trendData.find((entry) => entry.month === monthKey);
        if (monthEntry && monthEntry[expense.category] !== undefined) {
          monthEntry[expense.category] += expense.amount;
        }
      }
    });

    return trendData;
  };

  // Get top expenses
  const getTopExpenses = () => {
    return [...filteredExpenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  // Generate random colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#8DD1E1",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Budget Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Analyze your wedding budget and spending patterns
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <PieChart className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="category">
              <BarChart className="mr-2 h-4 w-4" />
              By Category
            </TabsTrigger>
            <TabsTrigger value="trends">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="details">
              <Calendar className="mr-2 h-4 w-4" />
              Details
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-shrink-0">
          <select
            className="border rounded-md p-2 bg-background"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
          </select>
        </div>
      </div>

      <TabsContent
        value="overview"
        className="space-y-6"
        hidden={activeTab !== "overview"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: "Spent", value: totalSpent },
                        {
                          name: "Remaining",
                          value: Math.max(0, totalBudget - totalSpent),
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#4f46e5" />
                      <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalBudget)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(Math.max(0, totalBudget - totalSpent))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Percentage Used
                  </p>
                  <p className="text-2xl font-bold">
                    {Math.round((totalSpent / totalBudget) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={spendingByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {spendingByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getMonthlySpending()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      formatCurrency(value).split(".")[0]
                    }
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Monthly Spending"
                    stroke="#4f46e5"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getTopExpenses().map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{expense.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-2">{expense.category}</span>
                      <span>•</span>
                      <span className="ml-2">{formatDate(expense.date)}</span>
                    </div>
                  </div>
                  <p className="font-bold">{formatCurrency(expense.amount)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent
        value="category"
        className="space-y-6"
        hidden={activeTab !== "category"}
      >
        <Card>
          <CardHeader>
            <CardTitle>Budget vs. Actual by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={budgetVsActual}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) =>
                      formatCurrency(value).split(".")[0]
                    }
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar
                    dataKey="budget"
                    name="Allocated Budget"
                    fill="#4f46e5"
                  />
                  <Bar dataKey="actual" name="Actual Spending" fill="#ef4444" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Variance by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={budgetVsActual}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) =>
                      formatCurrency(value).split(".")[0]
                    }
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar
                    dataKey="variance"
                    name="Budget Variance"
                    // Use red for negative variance (over budget)
                    fill="#10b981"
                    fillOpacity={0.8}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                Positive values (green) indicate under budget. Negative values
                (red) indicate over budget.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Card key={category.name}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <CardTitle className="text-base">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Allocated:</span>
                    <span className="font-medium">
                      {formatCurrency(category.allocated)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Spent:</span>
                    <span className="font-medium">
                      {formatCurrency(category.spent)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Remaining:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        Math.max(0, category.allocated - category.spent),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Percentage Used:</span>
                    <span className="font-medium">
                      {category.allocated > 0
                        ? Math.round(
                            (category.spent / category.allocated) * 100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent
        value="trends"
        className="space-y-6"
        hidden={activeTab !== "trends"}
      >
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trends by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getCategoryTrends()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      formatCurrency(value).split(".")[0]
                    }
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  {categories.slice(0, 5).map((category, index) => (
                    <Line
                      key={category.name}
                      type="monotone"
                      dataKey={category.name}
                      stroke={category.color || COLORS[index % COLORS.length]}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            {categories.length > 5 && (
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  Showing top 5 categories for clarity. Other categories are not
                  displayed in the chart.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumulative Spending Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getMonthlySpending().map((entry, index, array) => ({
                    ...entry,
                    cumulative: array
                      .slice(0, index + 1)
                      .reduce((sum, item) => sum + item.total, 0),
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      formatCurrency(value).split(".")[0]
                    }
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    name="Cumulative Spending"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent
        value="details"
        className="space-y-6"
        hidden={activeTab !== "details"}
      >
        <Card>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Expense
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {formatDate(expense.date)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium">{expense.name}</div>
                          {expense.notes && (
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {expense.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {expense.category}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {expense.vendor || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${expense.status === "paid" ? "bg-green-100 text-green-800" : expense.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                          >
                            {expense.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-sm text-muted-foreground"
                      >
                        No expenses found for the selected time period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">{filteredExpenses.length}</p>
              </div>
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">Paid Expenses</p>
                <p className="text-2xl font-bold">
                  {filteredExpenses.filter((e) => e.status === "paid").length}
                </p>
              </div>
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">
                  Pending Expenses
                </p>
                <p className="text-2xl font-bold">
                  {
                    filteredExpenses.filter((e) => e.status === "pending")
                      .length
                  }
                </p>
              </div>
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
                  )}
                </p>
              </div>
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">Paid Amount</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    filteredExpenses
                      .filter((e) => e.status === "paid")
                      .reduce((sum, e) => sum + e.amount, 0),
                  )}
                </p>
              </div>
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    filteredExpenses
                      .filter((e) => e.status === "pending")
                      .reduce((sum, e) => sum + e.amount, 0),
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default BudgetReports;

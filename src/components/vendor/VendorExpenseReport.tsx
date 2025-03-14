import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Vendor } from "@/types/vendor";
import { useCurrency } from "@/lib/currency";
import { ArrowLeft, Receipt, Download, Filter, X } from "lucide-react";
import { getExpensesByVendor } from "@/services/vendorService";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface VendorExpenseReportProps {
  vendor: Vendor;
  onBack: () => void;
  onAddExpense?: () => void;
  onViewReceipt?: (url: string) => void;
  onExportReport?: (vendorId: string) => void;
}

const VendorExpenseReport: React.FC<VendorExpenseReportProps> = ({
  vendor,
  onBack,
  onAddExpense,
  onViewReceipt = () => {},
  onExportReport,
}) => {
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, [vendor.id]);

  // Fetch expenses from the API
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpensesByVendor(vendor.id);
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching vendor expenses:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load expenses: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Filter expenses based on search and filters
  const filteredExpenses = expenses.filter((expense) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.notes &&
        expense.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = !statusFilter || expense.status === statusFilter;

    // Category filter
    const matchesCategory =
      !categoryFilter || expense.category === categoryFilter;

    // Date filter
    let matchesDate = true;
    if (dateFilter) {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

      if (dateFilter === "this-month") {
        matchesDate = expenseDate >= firstDayOfMonth;
      } else if (dateFilter === "this-year") {
        matchesDate = expenseDate >= firstDayOfYear;
      } else if (dateFilter === "last-30") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        matchesDate = expenseDate >= thirtyDaysAgo;
      } else if (dateFilter === "last-90") {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(now.getDate() - 90);
        matchesDate = expenseDate >= ninetyDaysAgo;
      }
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  // Calculate total amount
  const totalAmount = filteredExpenses.reduce(
    (sum, expense) =>
      sum + (expense.status !== "cancelled" ? expense.amount : 0),
    0,
  );

  // Calculate paid amount
  const paidAmount = filteredExpenses.reduce(
    (sum, expense) => sum + (expense.status === "paid" ? expense.amount : 0),
    0,
  );

  // Calculate pending amount
  const pendingAmount = filteredExpenses.reduce(
    (sum, expense) => sum + (expense.status === "pending" ? expense.amount : 0),
    0,
  );

  // Get unique categories for filter
  const categories = [...new Set(expenses.map((expense) => expense.category))];

  // Calculate spending by category
  const spendingByCategory = categories
    .map((category) => {
      const categoryExpenses = filteredExpenses.filter(
        (expense) =>
          expense.category === category && expense.status !== "cancelled",
      );
      const total = categoryExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );
      return {
        name: category,
        value: total,
        paid: categoryExpenses
          .filter((expense) => expense.status === "paid")
          .reduce((sum, expense) => sum + expense.amount, 0),
        pending: categoryExpenses
          .filter((expense) => expense.status === "pending")
          .reduce((sum, expense) => sum + expense.amount, 0),
      };
    })
    .filter((item) => item.value > 0);

  // Calculate monthly spending
  const getMonthlySpending = () => {
    const monthlyData = {};

    filteredExpenses.forEach((expense) => {
      if (expense.status !== "cancelled") {
        const date = new Date(expense.date);
        const monthYear = format(date, "MMM yyyy");

        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            month: monthYear,
            total: 0,
            paid: 0,
            pending: 0,
          };
        }

        monthlyData[monthYear].total += expense.amount;

        if (expense.status === "paid") {
          monthlyData[monthYear].paid += expense.amount;
        } else if (expense.status === "pending") {
          monthlyData[monthYear].pending += expense.amount;
        }
      }
    });

    // Convert to array and sort by date
    return Object.values(monthlyData).sort((a: any, b: any) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });
  };

  // Handle export report
  const handleExportReport = () => {
    if (onExportReport) {
      onExportReport(vendor.id);
    } else {
      // Fallback export functionality
      const headers = [
        "Date",
        "Expense",
        "Category",
        "Amount",
        "Status",
        "Notes",
      ];

      const csvContent = [
        headers.join(","),
        ...filteredExpenses.map((expense) =>
          [
            expense.date,
            `"${expense.name.replace(/"/g, '""')}"`,
            expense.category,
            expense.amount,
            expense.status,
            expense.notes ? `"${expense.notes.replace(/"/g, '""')}"` : "",
          ].join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${vendor.name.replace(/\s+/g, "_")}_expenses_${format(
          new Date(),
          "yyyy-MM-dd",
        )}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setCategoryFilter(null);
    setDateFilter(null);
  };

  // Generate random colors for charts
  const COLORS = [
    "#4f46e5", // indigo
    "#0ea5e9", // sky
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#14b8a6", // teal
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{vendor.name}</h1>
          <p className="text-muted-foreground">Expense Report</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {filteredExpenses.length} expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-500">
              {formatCurrency(paidAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredExpenses.filter((e) => e.status === "paid").length} paid
              expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">
              {formatCurrency(pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredExpenses.filter((e) => e.status === "pending").length}{" "}
              pending expenses
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle>Expense Analysis</CardTitle>
            <div className="flex space-x-1">
              <Button
                variant={activeTab === "overview" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </Button>
              <Button
                variant={activeTab === "category" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("category")}
              >
                By Category
              </Button>
              <Button
                variant={activeTab === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("monthly")}
              >
                Monthly
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            {onAddExpense && (
              <Button onClick={onAddExpense}>Add Expense</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Paid", value: paidAmount },
                            { name: "Pending", value: pendingAmount },
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
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={spendingByCategory
                            .sort((a, b) => b.value - a.value)
                            .slice(0, 5)}
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
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "category" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Spending by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={spendingByCategory.sort(
                          (a, b) => b.value - a.value,
                        )}
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
                          dataKey="paid"
                          name="Paid"
                          stackId="a"
                          fill="#10b981"
                        />
                        <Bar
                          dataKey="pending"
                          name="Pending"
                          stackId="a"
                          fill="#f59e0b"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {spendingByCategory.map((category, index) => (
                  <Card key={category.name}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <CardTitle className="text-base">
                          {category.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total:</span>
                          <span className="font-medium">
                            {formatCurrency(category.value)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Paid:</span>
                          <span className="font-medium text-green-600 dark:text-green-500">
                            {formatCurrency(category.paid)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pending:</span>
                          <span className="font-medium text-amber-600 dark:text-amber-500">
                            {formatCurrency(category.pending)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Percentage of Total:</span>
                          <span className="font-medium">
                            {totalAmount > 0
                              ? Math.round((category.value / totalAmount) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "monthly" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Monthly Spending Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getMonthlySpending()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                        <Bar
                          dataKey="paid"
                          name="Paid"
                          stackId="a"
                          fill="#10b981"
                        />
                        <Bar
                          dataKey="pending"
                          name="Pending"
                          stackId="a"
                          fill="#f59e0b"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-9 w-9"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Select
                value={statusFilter || ""}
                onValueChange={(value) =>
                  setStatusFilter(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={categoryFilter || ""}
                onValueChange={(value) =>
                  setCategoryFilter(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={dateFilter || ""}
                onValueChange={(value) =>
                  setDateFilter(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="last-30">Last 30 Days</SelectItem>
                  <SelectItem value="last-90">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                title="Clear filters"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredExpenses.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expense</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <div className="font-medium">{expense.name}</div>
                        {expense.notes && (
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {expense.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatDateString(expense.date)}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(expense.status)}>
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {expense.receipt_url ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewReceipt(expense.receipt_url)}
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No expenses found for this vendor.</p>
              {onAddExpense && (
                <Button
                  variant="outline"
                  onClick={onAddExpense}
                  className="mt-4"
                >
                  Add First Expense
                </Button>
              )}
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Contact Information</h3>
              <div className="mt-2 space-y-2">
                {vendor.contact_name && (
                  <p className="text-sm">
                    <span className="font-medium">Contact:</span>{" "}
                    {vendor.contact_name}
                  </p>
                )}
                {vendor.email && (
                  <p className="text-sm">
                    <span className="font-medium">Email:</span>{" "}
                    <a
                      href={`mailto:${vendor.email}`}
                      className="text-primary hover:underline"
                    >
                      {vendor.email}
                    </a>
                  </p>
                )}
                {vendor.phone && (
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {vendor.phone}
                  </p>
                )}
                {vendor.website && (
                  <p className="text-sm">
                    <span className="font-medium">Website:</span>{" "}
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      {vendor.website}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1 h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium">Additional Information</h3>
              <div className="mt-2 space-y-2">
                {vendor.address && (
                  <p className="text-sm">
                    <span className="font-medium">Address:</span>{" "}
                    {vendor.address}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium">Category:</span>{" "}
                  <Badge variant="outline">{vendor.category}</Badge>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{" "}
                  <Badge variant={getStatusBadge(vendor.status)}>
                    {vendor.status.charAt(0).toUpperCase() +
                      vendor.status.slice(1)}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
          {vendor.notes && (
            <div className="mt-4">
              <h3 className="text-sm font-medium">Notes</h3>
              <p className="mt-2 text-sm whitespace-pre-line">{vendor.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorExpenseReport;

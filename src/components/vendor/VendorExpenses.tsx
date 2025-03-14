import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Vendor } from "@/types/vendor";
import { useCurrency } from "@/lib/currency";
import {
  ArrowLeft,
  Receipt,
  ExternalLink,
  Download,
  BarChart,
} from "lucide-react";
import { useRealtimeVendorExpenses } from "@/hooks/useRealtimeVendorExpenses";

interface VendorExpensesProps {
  vendor: Vendor;
  expenses?: any[];
  loading?: boolean;
  onBack: () => void;
  onAddExpense?: () => void;
  onViewReceipt?: (url: string) => void;
  onViewDetailedReport?: (vendor: Vendor) => void;
}

const VendorExpenses: React.FC<VendorExpensesProps> = ({
  vendor,
  expenses: propExpenses,
  loading: propLoading,
  onBack,
  onAddExpense,
  onViewReceipt = () => {},
  onViewDetailedReport,
}) => {
  // Use real-time expenses if no expenses are provided as props
  const { expenses: realtimeExpenses, loading: realtimeLoading } =
    useRealtimeVendorExpenses(vendor.id);

  // Use either provided expenses or real-time expenses
  const expenses = propExpenses || realtimeExpenses;
  const loading = propLoading !== undefined ? propLoading : realtimeLoading;
  const { formatCurrency } = useCurrency();

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

  // Calculate total amount
  const totalAmount = expenses.reduce(
    (sum, expense) =>
      sum + (expense.status !== "cancelled" ? expense.amount : 0),
    0,
  );

  // Calculate paid amount
  const paidAmount = expenses.reduce(
    (sum, expense) => sum + (expense.status === "paid" ? expense.amount : 0),
    0,
  );

  // Calculate pending amount
  const pendingAmount = expenses.reduce(
    (sum, expense) => sum + (expense.status === "pending" ? expense.amount : 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{vendor.name}</h1>
          <p className="text-muted-foreground">Expenses for this vendor</p>
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
              Across {expenses.length} expenses
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
              {expenses.filter((e) => e.status === "paid").length} paid expenses
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
              {expenses.filter((e) => e.status === "pending").length} pending
              expenses
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expense History</CardTitle>
          <div className="flex gap-2">
            {onViewDetailedReport && (
              <Button
                variant="outline"
                onClick={() => onViewDetailedReport(vendor)}
              >
                <BarChart className="mr-2 h-4 w-4" />
                Detailed Report
              </Button>
            )}
            {onAddExpense && (
              <Button onClick={onAddExpense}>Add Expense</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : expenses.length > 0 ? (
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
                  {expenses.map((expense) => (
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
                      <ExternalLink className="ml-1 h-3 w-3" />
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
                    {vendor.status}
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

export default VendorExpenses;

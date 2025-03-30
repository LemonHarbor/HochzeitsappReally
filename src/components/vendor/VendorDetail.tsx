import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Badge } from "../../../../src/components/ui/badge";
import VendorStatusBadge from "./VendorStatusBadge";
import VendorStatusSelect from "./VendorStatusSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/components/ui/table";
import { format } from "date-fns";
import { Vendor } from "../../../../src/types/vendor";
import { useCurrency } from "../../../../src/lib/currency";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  Building,
  DollarSign,
  Receipt,
  BarChart,
  Download,
  Contact,
  CreditCard,
  FileText,
  Star,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useRealtimeVendorExpenses } from "../../../../src/hooks/useRealtimeVendorExpenses";
import {
  downloadVendorAsVCard,
  downloadVendorAsCSV,
} from "../../../../src/services/exportService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../src/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../src/components/ui/dropdown-menu";
import RatingStars from "./RatingStars";
import { getVendorAverageRating } from "../../../../src/services/reviewService";

interface VendorDetailProps {
  vendor: Vendor;
  onBack: () => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
  onAddExpense?: () => void;
  onViewExpenses?: () => void;
  onViewDetailedReport?: () => void;
  onViewReceipt?: (url: string) => void;
  onViewPayments?: () => void;
  onViewContracts?: () => void;
  onViewReviews?: () => void;
  onViewAppointments?: () => void;
}

const VendorDetail: React.FC<VendorDetailProps> = ({
  vendor,
  onBack,
  onEdit,
  onDelete,
  onAddExpense,
  onViewExpenses,
  onViewDetailedReport,
  onViewReceipt = () => {},
  onViewPayments,
  onViewContracts,
  onViewReviews,
  onViewAppointments,
}) => {
  const { formatCurrency } = useCurrency();
  const { expenses, loading } = useRealtimeVendorExpenses(vendor.id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch average rating when component mounts
  React.useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const rating = await getVendorAverageRating(vendor.id);
        setAverageRating(rating);
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    fetchAverageRating();
  }, [vendor.id]);

  // Format date
  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
      case "cancelled":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Get category display name
  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case "venue":
        return "Venue";
      case "catering":
        return "Catering";
      case "photography":
        return "Photography";
      case "videography":
        return "Videography";
      case "florist":
        return "Florist";
      case "music":
        return "Music/Entertainment";
      case "cake":
        return "Cake/Bakery";
      case "attire":
        return "Attire/Clothing";
      case "transportation":
        return "Transportation";
      case "decor":
        return "Decor/Rentals";
      case "beauty":
        return "Hair/Makeup";
      case "stationery":
        return "Stationery";
      case "jewelry":
        return "Jewelry";
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
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

  // Handle delete confirmation
  const confirmDelete = () => {
    onDelete(vendor.id);
    setShowDeleteDialog(false);
  };

  // Get recent expenses (last 5)
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{vendor.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">
                {getCategoryDisplay(vendor.category)}
              </Badge>
              <div className="flex items-center gap-2">
                <VendorStatusBadge status={vendor.status} />
                <VendorStatusSelect
                  vendor={vendor}
                  onStatusChange={(newStatus) => {
                    // Update the vendor object in the component state
                    const updatedVendor = {
                      ...vendor,
                      status: newStatus as "active" | "pending" | "inactive",
                    };
                    // This will trigger a re-render with the updated status
                    onEdit(updatedVendor);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Contact className="mr-2 h-4 w-4" />
                Export Contact
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => downloadVendorAsVCard(vendor)}>
                <Download className="mr-2 h-4 w-4" />
                Export as vCard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadVendorAsCSV(vendor)}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={() => onEdit(vendor)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Vendor
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                {averageRating.toFixed(1)}
              </div>
              <RatingStars rating={averageRating} size="sm" />
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-muted-foreground mt-1"
              onClick={onViewReviews}
            >
              <Star className="h-3 w-3 mr-1" />
              View all reviews
            </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendor.contact_name && (
                <div className="flex items-start">
                  <div className="w-32 font-medium">Contact Person:</div>
                  <div>{vendor.contact_name}</div>
                </div>
              )}
              {vendor.email && (
                <div className="flex items-start">
                  <div className="w-32 font-medium">Email:</div>
                  <div>
                    <a
                      href={`mailto:${vendor.email}`}
                      className="text-primary hover:underline flex items-center"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      {vendor.email}
                    </a>
                  </div>
                </div>
              )}
              {vendor.phone && (
                <div className="flex items-start">
                  <div className="w-32 font-medium">Phone:</div>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    {vendor.phone}
                  </div>
                </div>
              )}
              {vendor.website && (
                <div className="flex items-start">
                  <div className="w-32 font-medium">Website:</div>
                  <div>
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {vendor.website}
                    </a>
                  </div>
                </div>
              )}
              {vendor.address && (
                <div className="flex items-start">
                  <div className="w-32 font-medium">Address:</div>
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    {vendor.address}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-32 font-medium">Created:</div>
                <div>{formatDateString(vendor.created_at)}</div>
              </div>
              {vendor.updated_at && (
                <div className="flex items-start">
                  <div className="w-32 font-medium">Last Updated:</div>
                  <div>{formatDateString(vendor.updated_at)}</div>
                </div>
              )}
              {vendor.notes && (
                <div>
                  <div className="font-medium mb-2">Notes:</div>
                  <div className="p-3 bg-muted/20 rounded-md whitespace-pre-line">
                    {vendor.notes}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Expenses</CardTitle>
          <div className="flex gap-2">
            {onViewDetailedReport && (
              <Button variant="outline" onClick={onViewDetailedReport}>
                <BarChart className="mr-2 h-4 w-4" />
                Detailed Report
              </Button>
            )}
            {onViewExpenses && (
              <Button variant="outline" onClick={onViewExpenses}>
                <DollarSign className="mr-2 h-4 w-4" />
                View All Expenses
              </Button>
            )}
            {onViewPayments && (
              <Button variant="outline" onClick={onViewPayments}>
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Schedule
              </Button>
            )}
            {onViewContracts && (
              <Button variant="outline" onClick={onViewContracts}>
                <FileText className="mr-2 h-4 w-4" />
                Contracts
              </Button>
            )}
            {onViewReviews && (
              <Button variant="outline" onClick={onViewReviews}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Reviews
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = `/vendor-management?vendorId=${vendor.id}&section=recommendations`)
              }
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Similar Vendors
            </Button>
            {onViewAppointments && (
              <Button variant="outline" onClick={onViewAppointments}>
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
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
          ) : recentExpenses.length > 0 ? (
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
                  {recentExpenses.map((expense) => (
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
                  <DollarSign className="mr-2 h-4 w-4" />
                  Add First Expense
                </Button>
              )}
            </div>
          )}

          {expenses.length > 5 && (
            <div className="mt-4 text-center">
              {onViewExpenses && (
                <Button variant="link" onClick={onViewExpenses}>
                  View all {expenses.length} expenses
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              vendor and remove it from our servers.
              {expenses.length > 0 && (
                <p className="mt-2 font-medium text-destructive">
                  Warning: This vendor has {expenses.length} associated
                  expenses. Deleting this vendor will affect those records.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VendorDetail;

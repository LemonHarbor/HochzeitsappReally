import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Badge } from "../../../../src/components/ui/badge";
import { Progress } from "../../../../src/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/components/ui/table";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { Vendor } from "../../../../src/types/vendor";
import { Payment } from "../../../../src/types/payment";
import { useCurrency } from "../../../../src/lib/currency";
import {
  ArrowLeft,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  AlertCircle,
} from "lucide-react";
import { useRealtimeVendorPayments } from "../../../../src/hooks/useRealtimeVendorPayments";
import { Dialog, DialogContent } from "../../../../src/components/ui/dialog";
import PaymentForm from "./PaymentForm";
import { useToast } from "../../../../src/components/ui/use-toast";
import {
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentSummaryByVendor,
} from "../../../../src/services/paymentService";
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

interface VendorPaymentsProps {
  vendor: Vendor;
  onBack: () => void;
}

const VendorPayments: React.FC<VendorPaymentsProps> = ({ vendor, onBack }) => {
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const { payments, loading } = useRealtimeVendorPayments(vendor.id);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Fetch payment summary when payments change
  React.useEffect(() => {
    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);
        const summary = await getPaymentSummaryByVendor(vendor.id);
        setPaymentSummary(summary);
      } catch (error) {
        console.error("Error fetching payment summary:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load payment summary: ${error.message}`,
        });
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
  }, [vendor.id, payments, toast]);

  // Format date
  const formatDateString = (dateString: string) => {
    if (!dateString) return "Not set";
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy");
  };

  // Get status badge variant
  const getStatusBadge = (status: string, dueDate?: string) => {
    if (status === "paid") return "success";
    if (status === "cancelled") return "secondary";

    // Check if payment is overdue
    if (status === "pending" && dueDate) {
      const now = new Date();
      const due = parseISO(dueDate);
      if (isBefore(due, now)) {
        return "destructive";
      }
    }

    return "warning";
  };

  // Get payment type display
  const getPaymentTypeDisplay = (type: string) => {
    switch (type) {
      case "deposit":
        return "Deposit";
      case "installment":
        return "Installment";
      case "final":
        return "Final Payment";
      default:
        return type;
    }
  };

  // Handle adding a new payment
  const handleAddPayment = () => {
    setIsEditing(false);
    setSelectedPayment(null);
    setShowPaymentForm(true);
  };

  // Handle editing a payment
  const handleEditPayment = (payment: Payment) => {
    setIsEditing(true);
    setSelectedPayment(payment);
    setShowPaymentForm(true);
  };

  // Handle payment form submission
  const handlePaymentSubmit = async (data: any) => {
    try {
      if (isEditing && selectedPayment) {
        // Update existing payment
        await updatePayment(selectedPayment.id, {
          amount: data.amount,
          payment_date: data.payment_date
            ? format(data.payment_date, "yyyy-MM-dd")
            : null,
          due_date: format(data.due_date, "yyyy-MM-dd"),
          status: data.status,
          payment_type: data.payment_type,
          notes: data.notes,
        });

        toast({
          title: "Payment Updated",
          description: "The payment has been updated successfully.",
        });
      } else {
        // Add new payment
        await createPayment({
          vendor_id: vendor.id,
          amount: data.amount,
          payment_date: data.payment_date
            ? format(data.payment_date, "yyyy-MM-dd")
            : null,
          due_date: format(data.due_date, "yyyy-MM-dd"),
          status: data.status,
          payment_type: data.payment_type,
          notes: data.notes,
        });

        toast({
          title: "Payment Added",
          description: "The new payment has been added successfully.",
        });
      }

      setShowPaymentForm(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} payment: ${error.message}`,
      });
    }
  };

  // Handle deleting a payment
  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;

    try {
      await deletePayment(paymentToDelete);
      toast({
        title: "Payment Deleted",
        description: "The payment has been deleted successfully.",
      });
      setPaymentToDelete(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete payment: ${error.message}`,
      });
    }
  };

  // Check if a payment is overdue
  const isPaymentOverdue = (payment: Payment) => {
    if (payment.status !== "pending") return false;
    const now = new Date();
    const dueDate = parseISO(payment.due_date);
    return isBefore(dueDate, now);
  };

  // Get days until due or days overdue
  const getDaysMessage = (dueDate: string) => {
    const now = new Date();
    const due = parseISO(dueDate);
    const diffTime = Math.abs(due.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isBefore(due, now)) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} overdue`;
    } else {
      return `Due in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{vendor.name}</h1>
          <p className="text-muted-foreground">Payment Schedule</p>
        </div>
      </div>

      {summaryLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : paymentSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Contract Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(paymentSummary.totalContractValue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total of all scheduled payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                {formatCurrency(paymentSummary.paidAmount)}
              </div>
              <div className="mt-2">
                <Progress
                  value={paymentSummary.paymentProgress}
                  className="h-2"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {paymentSummary.paymentProgress.toFixed(0)}% of total paid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Remaining Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                {formatCurrency(paymentSummary.remainingBalance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {paymentSummary.isOverdue ? (
                  <span className="flex items-center text-destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Overdue payments
                  </span>
                ) : paymentSummary.nextPayment ? (
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Next payment:{" "}
                    {formatDateString(paymentSummary.nextPayment.due_date)}
                  </span>
                ) : (
                  "No pending payments"
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment Schedule</CardTitle>
          <Button onClick={handleAddPayment}>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : payments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="font-medium">
                          {getPaymentTypeDisplay(payment.payment_type)}
                        </div>
                        {payment.notes && (
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {payment.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDateString(payment.due_date)}</span>
                          {payment.status === "pending" && (
                            <span
                              className={`text-xs ${isPaymentOverdue(payment) ? "text-destructive" : "text-muted-foreground"}`}
                            >
                              {getDaysMessage(payment.due_date)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadge(
                            payment.status,
                            payment.due_date,
                          )}
                        >
                          {payment.status === "pending" &&
                          isPaymentOverdue(payment)
                            ? "Overdue"
                            : payment.status.charAt(0).toUpperCase() +
                              payment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.payment_date
                          ? formatDateString(payment.payment_date)
                          : payment.status === "paid"
                            ? "Date not recorded"
                            : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPayment(payment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPaymentToDelete(payment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No payments scheduled for this vendor.</p>
              <Button
                variant="outline"
                onClick={handleAddPayment}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Schedule First Payment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {paymentSummary?.overduePayments?.length > 0 && (
        <Card className="border-destructive">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              <CardTitle className="text-destructive">
                Overdue Payments
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentSummary.overduePayments.map((payment: Payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-3 border border-destructive rounded-md bg-destructive/5"
                >
                  <div>
                    <div className="font-medium">
                      {getPaymentTypeDisplay(payment.payment_type)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Due: {formatDateString(payment.due_date)} (
                      {getDaysMessage(payment.due_date)})
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-bold">
                      {formatCurrency(payment.amount)}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleEditPayment(payment)}
                    >
                      Mark as Paid
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {paymentSummary?.upcomingPayments?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-2" />
              <CardTitle>Upcoming Payments</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentSummary.upcomingPayments
                .slice(0, 3)
                .map((payment: Payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <div className="font-medium">
                        {getPaymentTypeDisplay(payment.payment_type)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Due: {formatDateString(payment.due_date)} (
                        {getDaysMessage(payment.due_date)})
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-bold">
                        {formatCurrency(payment.amount)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPayment(payment)}
                      >
                        Mark as Paid
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Form Dialog */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="sm:max-w-2xl">
          <PaymentForm
            vendorId={vendor.id}
            isEditing={isEditing}
            initialData={selectedPayment || {}}
            onSubmit={handlePaymentSubmit}
            onCancel={() => setShowPaymentForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!paymentToDelete}
        onOpenChange={(open) => !open && setPaymentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              payment record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePayment}
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

export default VendorPayments;

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Input } from "../../../../src/components/ui/input";
import { Badge } from "../../../../src/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../src/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../src/components/ui/alert-dialog";
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Download,
  X,
} from "lucide-react";
import { useLanguage } from "../../../../src/lib/language";
import { useCurrency } from "../../../../src/lib/currency";

interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "cancelled";
  vendor?: string;
  notes?: string;
  receiptUrl?: string;
}

interface ExpenseListProps {
  expenses?: Expense[];
  categories?: string[];
  onAddExpense?: () => void;
  onEditExpense?: (expense: Expense) => void;
  onDeleteExpense?: (id: string) => void;
  onViewReceipt?: (url: string) => void;
}

const ExpenseList = ({
  expenses = [
    {
      id: "exp1",
      name: "Venue Deposit",
      category: "Venue",
      amount: 2500,
      date: "2024-06-01",
      status: "paid",
      vendor: "Grand Plaza Hotel",
      notes: "Initial 25% deposit for wedding venue",
      receiptUrl: "/receipts/venue-deposit.pdf",
    },
    {
      id: "exp2",
      name: "Catering Deposit",
      category: "Catering",
      amount: 1000,
      date: "2024-06-05",
      status: "paid",
      vendor: "Elite Catering",
      notes: "Deposit for 100 guests, includes appetizers and main course",
    },
    {
      id: "exp3",
      name: "Photographer Booking",
      category: "Photography",
      amount: 500,
      date: "2024-06-10",
      status: "paid",
      vendor: "MemoryMakers Photography",
      receiptUrl: "/receipts/photo-deposit.pdf",
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
    {
      id: "exp5",
      name: "Wedding Dress",
      category: "Attire",
      amount: 1200,
      date: "2024-06-20",
      status: "paid",
      vendor: "Elegant Bridal",
      receiptUrl: "/receipts/dress.pdf",
    },
    {
      id: "exp6",
      name: "DJ Services",
      category: "Entertainment",
      amount: 800,
      date: "2024-06-25",
      status: "pending",
      vendor: "Rhythm Masters",
    },
    {
      id: "exp7",
      name: "Wedding Cake",
      category: "Catering",
      amount: 400,
      date: "2024-07-01",
      status: "pending",
      vendor: "Sweet Delights Bakery",
    },
    {
      id: "exp8",
      name: "Wedding Rings",
      category: "Jewelry",
      amount: 1500,
      date: "2024-07-05",
      status: "paid",
      vendor: "Forever Jewelers",
      receiptUrl: "/receipts/rings.pdf",
    },
  ],
  categories = [
    "Venue",
    "Catering",
    "Decoration",
    "Photography",
    "Videography",
    "Attire",
    "Beauty",
    "Transportation",
    "Entertainment",
    "Stationery",
    "Gifts",
    "Jewelry",
    "Other",
  ],
  onAddExpense = () => {},
  onEditExpense = () => {},
  onDeleteExpense = () => {},
  onViewReceipt = () => {},
}: ExpenseListProps) => {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter((expense) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.vendor &&
          expense.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (expense.notes &&
          expense.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory =
        !categoryFilter || expense.category === categoryFilter;

      // Status filter
      const matchesStatus = !statusFilter || expense.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField)
        return new Date(b.date).getTime() - new Date(a.date).getTime(); // Default sort by date desc

      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "vendor":
          comparison = (a.vendor || "").localeCompare(b.vendor || "");
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Handle sort toggle
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
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

  // Handle delete confirmation
  const confirmDelete = () => {
    if (expenseToDelete) {
      onDeleteExpense(expenseToDelete);
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">
            Manage and track all your wedding expenses
          </p>
        </div>
        <Button onClick={onAddExpense}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
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

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter(null);
                  setStatusFilter(null);
                }}
                title="Clear filters"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Expense
                      {sortField === "name" && (
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      {sortField === "category" && (
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center justify-end">
                      Amount
                      {sortField === "amount" && (
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center">
                      Date
                      {sortField === "date" && (
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortField === "status" && (
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("vendor")}
                  >
                    <div className="flex items-center">
                      Vendor
                      {sortField === "vendor" && (
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <div className="font-medium">{expense.name}</div>
                        {expense.notes && (
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {expense.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>{formatDate(expense.date)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(expense.status)}>
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{expense.vendor || "-"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onEditExpense(expense)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {expense.receiptUrl && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onViewReceipt(expense.receiptUrl!)
                                }
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View Receipt
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setExpenseToDelete(expense.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No expenses found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!expenseToDelete}
        onOpenChange={(open) => !open && setExpenseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              expense and remove it from our servers.
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

export default ExpenseList;

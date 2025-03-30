import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Input } from "../../../../src/components/ui/input";
import { Badge } from "../../../../src/components/ui/badge";
import VendorStatusBadge from "./VendorStatusBadge";
import VendorStatusSelect from "./VendorStatusSelect";
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
} from "../../../../src/components/ui/alert-dialog";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  X,
  Building,
  DollarSign,
  Info,
  Download,
  Contact,
  CreditCard,
  BarChart2,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../../../../src/lib/language";
import { Vendor } from "../../../../src/types/vendor";
import { useCurrency } from "../../../../src/lib/currency";
import {
  downloadVendorAsVCard,
  downloadVendorAsCSV,
  downloadVendorsAsCSV,
} from "../../../../src/services/exportService";

interface VendorListProps {
  vendors?: Vendor[];
  loading?: boolean;
  onAddVendor?: () => void;
  onEditVendor?: (vendor: Vendor) => void;
  onDeleteVendor?: (id: string) => void;
  onViewExpenses?: (vendor: Vendor) => void;
  onViewVendorDetail?: (vendor: Vendor) => void;
  onCompareVendors?: () => void;
}

const VendorList: React.FC<VendorListProps> = ({
  vendors = [],
  loading = false,
  onAddVendor = () => {},
  onEditVendor = () => {},
  onDeleteVendor = () => {},
  onViewExpenses = () => {},
  onViewVendorDetail = () => {},
  onCompareVendors = () => {},
}) => {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);

  // Filter vendors based on search and filters
  const filteredVendors = vendors.filter((vendor) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.contact_name &&
        vendor.contact_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vendor.email &&
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filters - match if no filters are selected or if vendor category is in the selected filters
    const matchesCategory =
      categoryFilters.length === 0 || categoryFilters.includes(vendor.category);

    // Status filter
    const matchesStatus = !statusFilter || vendor.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
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

  // Handle delete confirmation
  const confirmDelete = () => {
    if (vendorToDelete) {
      onDeleteVendor(vendorToDelete);
      setVendorToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vendor Management</h1>
          <p className="text-muted-foreground">
            Manage your wedding vendors and service providers
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Contact className="mr-2 h-4 w-4" />
                Export Contacts
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => downloadVendorsAsCSV(filteredVendors)}
              >
                <Download className="mr-2 h-4 w-4" />
                Export All as CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                Export filtered vendors ({filteredVendors.length})
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => downloadVendorsAsCSV(filteredVendors)}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Filtered as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={onCompareVendors}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Compare Vendors
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              (window.location.href =
                "/vendor-management?section=recommendations")
            }
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Get Recommendations
          </Button>
          <Button onClick={onAddVendor}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-between"
                  >
                    <span>
                      {categoryFilters.length === 0
                        ? "All Categories"
                        : `${categoryFilters.length} selected`}
                    </span>
                    <Filter className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[180px]">
                  <DropdownMenuLabel>Filter Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[
                    "venue",
                    "catering",
                    "photography",
                    "videography",
                    "florist",
                    "music",
                    "cake",
                    "attire",
                    "transportation",
                    "decor",
                    "beauty",
                    "stationery",
                    "jewelry",
                    "other",
                  ].map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={(e) => {
                        e.preventDefault();
                        setCategoryFilters((prev) =>
                          prev.includes(category)
                            ? prev.filter((c) => c !== category)
                            : [...prev, category],
                        );
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 border rounded flex items-center justify-center ${categoryFilters.includes(category) ? "bg-primary border-primary" : "border-input"}`}
                        >
                          {categoryFilters.includes(category) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3 w-3 text-primary-foreground"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span>{getCategoryDisplay(category)}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {categoryFilters.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setCategoryFilters([])}
                        className="justify-center text-center"
                      >
                        Clear filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilters([]);
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
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <TableRow
                      key={vendor.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onViewVendorDetail(vendor)}
                    >
                      <TableCell>
                        <div className="font-medium">{vendor.name}</div>
                        {vendor.address && (
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <Building className="h-3 w-3 mr-1" />
                            {vendor.address}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCategoryDisplay(vendor.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {vendor.contact_name && (
                          <div className="text-sm">{vendor.contact_name}</div>
                        )}
                        {vendor.email && (
                          <div className="text-xs flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            <a
                              href={`mailto:${vendor.email}`}
                              className="text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {vendor.email}
                            </a>
                          </div>
                        )}
                        {vendor.phone && (
                          <div className="text-xs flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {vendor.phone}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-between">
                          <VendorStatusBadge status={vendor.status} size="sm" />
                          <div onClick={(e) => e.stopPropagation()}>
                            <VendorStatusSelect
                              vendor={vendor}
                              className="ml-2"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {vendor.total_expenses !== undefined && (
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {formatCurrency(vendor.total_expenses || 0)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {vendor.paid_expenses !== undefined && (
                                <span className="text-green-600 dark:text-green-500">
                                  {formatCurrency(vendor.paid_expenses || 0)}{" "}
                                  paid
                                </span>
                              )}
                              {vendor.pending_expenses !== undefined &&
                                vendor.pending_expenses > 0 && (
                                  <span className="text-amber-600 dark:text-amber-500 ml-2">
                                    {formatCurrency(vendor.pending_expenses)}{" "}
                                    pending
                                  </span>
                                )}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewVendorDetail(vendor);
                              }}
                            >
                              <Info className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditVendor(vendor);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewExpenses(vendor);
                              }}
                            >
                              <DollarSign className="mr-2 h-4 w-4" />
                              View Expenses
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewVendorDetail(vendor);
                              }}
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              Payment Schedule
                            </DropdownMenuItem>
                            {vendor.website && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(vendor.website, "_blank");
                                }}
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Visit Website
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadVendorAsVCard(vendor);
                              }}
                            >
                              <Contact className="mr-2 h-4 w-4" />
                              Export as vCard
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadVendorAsCSV(vendor);
                              }}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Export as CSV
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVendorToDelete(vendor.id);
                              }}
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
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No vendors found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredVendors.length} of {vendors.length} vendors
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!vendorToDelete}
        onOpenChange={(open) => !open && setVendorToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              vendor and remove it from our servers.
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

export default VendorList;

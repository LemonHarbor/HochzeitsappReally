import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Badge } from "../../../../src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/components/ui/table";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { Contract } from "../../../../src/types/contract";
import {
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Download,
  ExternalLink,
  Search,
  X,
  Plus,
} from "lucide-react";
import { Input } from "../../../../src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../src/components/ui/dropdown-menu";
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

interface ContractListProps {
  contracts: Contract[];
  loading?: boolean;
  onAddContract?: () => void;
  onEditContract?: (contract: Contract) => void;
  onDeleteContract?: (id: string) => void;
  onViewContract?: (url: string) => void;
}

const ContractList: React.FC<ContractListProps> = ({
  contracts,
  loading = false,
  onAddContract = () => {},
  onEditContract = () => {},
  onDeleteContract = () => {},
  onViewContract = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);

  // Filter contracts based on search and filters
  const filteredContracts = contracts.filter((contract) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contract.notes &&
        contract.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = !statusFilter || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDateString = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy");
  };

  // Get status badge variant
  const getStatusBadge = (status: string, expirationDate?: string) => {
    if (status === "active") {
      // Check if contract is about to expire
      if (expirationDate) {
        const now = new Date();
        const expiration = parseISO(expirationDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        if (isBefore(expiration, now)) {
          return "destructive"; // Already expired
        } else if (isBefore(expiration, thirtyDaysFromNow)) {
          return "warning"; // Expires within 30 days
        }
      }
      return "success";
    } else if (status === "pending") {
      return "warning";
    } else if (status === "expired" || status === "cancelled") {
      return "destructive";
    } else {
      return "secondary"; // draft
    }
  };

  // Get status display text
  const getStatusDisplay = (status: string, expirationDate?: string) => {
    if (status === "active" && expirationDate) {
      const now = new Date();
      const expiration = parseISO(expirationDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      if (isBefore(expiration, now)) {
        return "Expired";
      } else if (isBefore(expiration, thirtyDaysFromNow)) {
        return "Expiring Soon";
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get file type icon
  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    } else if (fileType.includes("text")) {
      return <FileText className="h-4 w-4 text-gray-500" />;
    } else {
      return <FileText className="h-4 w-4" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (contractToDelete) {
      onDeleteContract(contractToDelete);
      setContractToDelete(null);
    }
  };

  // Get days until expiration
  const getDaysUntilExpiration = (expirationDate?: string) => {
    if (!expirationDate) return null;

    const now = new Date();
    const expiration = parseISO(expirationDate);

    if (isBefore(expiration, now)) {
      const diffTime = Math.abs(now.getTime() - expiration.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Expired ${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      const diffTime = Math.abs(expiration.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Expires in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Contracts</h2>
          <p className="text-muted-foreground">
            Manage vendor contracts and agreements
          </p>
        </div>
        <Button onClick={onAddContract}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contract
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contracts..."
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

        <Select
          value={statusFilter || ""}
          onValueChange={(value) =>
            setStatusFilter(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredContracts.length > 0 ? (
            <div className="rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div className="font-medium">{contract.name}</div>
                        {contract.notes && (
                          <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                            {contract.notes}
                          </div>
                        )}
                        {contract.key_terms &&
                          Object.keys(contract.key_terms).length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {Object.entries(contract.key_terms)
                                .slice(0, 2)
                                .map(([key, value]) => (
                                  <Badge
                                    key={key}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {key}: {value}
                                  </Badge>
                                ))}
                              {Object.keys(contract.key_terms).length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{Object.keys(contract.key_terms).length - 2}{" "}
                                  more
                                </Badge>
                              )}
                            </div>
                          )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span className="font-medium">Signed:</span>{" "}
                            <span className="ml-1">
                              {contract.signed_date
                                ? formatDateString(contract.signed_date)
                                : "Not signed"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span className="font-medium">Expires:</span>{" "}
                            <span className="ml-1">
                              {contract.expiration_date
                                ? formatDateString(contract.expiration_date)
                                : "No expiration"}
                            </span>
                          </div>
                          {contract.expiration_date && (
                            <div className="text-xs text-muted-foreground">
                              {getDaysUntilExpiration(contract.expiration_date)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadge(
                            contract.status,
                            contract.expiration_date,
                          )}
                        >
                          {getStatusDisplay(
                            contract.status,
                            contract.expiration_date,
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getFileTypeIcon(contract.file_type)}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {formatFileSize(contract.file_size)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onViewContract(contract.file_url)}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Contract
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // Create a temporary link to download the file
                                const link = document.createElement("a");
                                link.href = contract.file_url;
                                link.download = contract.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onEditContract(contract)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setContractToDelete(contract.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No contracts found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={onAddContract}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Contract
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!contractToDelete}
        onOpenChange={(open) => !open && setContractToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contract and remove the associated file.
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

export default ContractList;

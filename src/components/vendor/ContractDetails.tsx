import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Badge } from "../../../../src/components/ui/badge";
import { format, parseISO, isBefore } from "date-fns";
import { Contract } from "../../../../src/types/contract";
import {
  FileText,
  Calendar,
  Download,
  Edit,
  ExternalLink,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";

interface ContractDetailsProps {
  contract: Contract;
  onEdit: () => void;
  onViewContract: (url: string) => void;
}

const ContractDetails: React.FC<ContractDetailsProps> = ({
  contract,
  onEdit,
  onViewContract,
}) => {
  // Format date
  const formatDateString = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = parseISO(dateString);
    return format(date, "MMMM d, yyyy");
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
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes("text")) {
      return <FileText className="h-5 w-5 text-gray-500" />;
    } else {
      return <FileText className="h-5 w-5" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
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

  // Get status icon
  const getStatusIcon = (status: string, expirationDate?: string) => {
    if (status === "active") {
      if (expirationDate) {
        const now = new Date();
        const expiration = parseISO(expirationDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        if (isBefore(expiration, now)) {
          return <AlertTriangle className="h-5 w-5 text-destructive" />;
        } else if (isBefore(expiration, thirtyDaysFromNow)) {
          return <Clock className="h-5 w-5 text-warning" />;
        }
      }
      return <CheckCircle className="h-5 w-5 text-success" />;
    } else if (status === "pending") {
      return <Clock className="h-5 w-5 text-warning" />;
    } else if (status === "expired" || status === "cancelled") {
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    } else {
      return <FileText className="h-5 w-5 text-muted-foreground" />; // draft
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{contract.name}</h2>
          <div className="flex items-center mt-1">
            <Badge
              variant={getStatusBadge(
                contract.status,
                contract.expiration_date,
              )}
              className="mr-2"
            >
              {getStatusDisplay(contract.status, contract.expiration_date)}
            </Badge>
            {contract.expiration_date && (
              <span className="text-sm text-muted-foreground">
                {getDaysUntilExpiration(contract.expiration_date)}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
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
          </Button>
          <Button
            variant="outline"
            onClick={() => onViewContract(contract.file_url)}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Contract
          </Button>
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <div className="flex items-center">
                  {getStatusIcon(contract.status, contract.expiration_date)}
                  <span className="ml-2">
                    {getStatusDisplay(
                      contract.status,
                      contract.expiration_date,
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Signed Date:</span>
                <span>
                  {contract.signed_date
                    ? formatDateString(contract.signed_date)
                    : "Not signed"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Expiration Date:</span>
                <span>
                  {contract.expiration_date
                    ? formatDateString(contract.expiration_date)
                    : "No expiration"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">File Type:</span>
                <div className="flex items-center">
                  {getFileTypeIcon(contract.file_type)}
                  <span className="ml-2">
                    {contract.file_type.split("/").pop()?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">File Size:</span>
                <span>{formatFileSize(contract.file_size)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Created:</span>
                <span>
                  {contract.created_at
                    ? formatDateString(contract.created_at)
                    : "Unknown"}
                </span>
              </div>
              {contract.updated_at && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Last Updated:</span>
                  <span>{formatDateString(contract.updated_at)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Terms</CardTitle>
          </CardHeader>
          <CardContent>
            {contract.key_terms &&
            Object.keys(contract.key_terms).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(contract.key_terms).map(([key, value]) => (
                  <div key={key} className="border-b pb-2 last:border-0">
                    <div className="font-medium">{key}</div>
                    <div className="text-sm text-muted-foreground">{value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No key terms have been added for this contract.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {contract.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line">{contract.notes}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractDetails;

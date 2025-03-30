import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Badge } from "../../../../src/components/ui/badge";
import { Input } from "../../../../src/components/ui/input";
import { Button } from "../../../../src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/components/ui/table";
import { format } from "date-fns";
import { Search, X, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { getEmailLogs, EmailLog } from "../../../../src/services/emailService";

interface EmailLogsProps {
  recipientEmail?: string;
}

const EmailLogs: React.FC<EmailLogsProps> = ({ recipientEmail }) => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(recipientEmail || "");
  const [filteredLogs, setFilteredLogs] = useState<EmailLog[]>([]);

  // Fetch email logs on component mount
  useEffect(() => {
    fetchLogs();
  }, [recipientEmail]);

  // Filter logs when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLogs(logs);
      return;
    }

    const filtered = logs.filter((log) =>
      log.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredLogs(filtered);
  }, [logs, searchTerm]);

  // Fetch logs from the API
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getEmailLogs(recipientEmail);
      setLogs(data);
      setFilteredLogs(data);
    } catch (error) {
      console.error("Error fetching email logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  // Get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return "success";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Get email type display name
  const getEmailTypeDisplay = (type: string) => {
    switch (type) {
      case "rsvp_reminder":
        return "RSVP Reminder";
      case "seating_update":
        return "Seating Update";
      case "invitation":
        return "Invitation";
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notification Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email address..."
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

          {/* Logs table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredLogs.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.recipient_email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getEmailTypeDisplay(log.email_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(log.sent_at)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(log.status)}>
                          {log.status === "sent" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <AlertCircle className="mr-1 h-3 w-3" />
                          )}
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {log.error_message || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>No email logs found.</p>
              {searchTerm && (
                <p className="text-sm">
                  Try adjusting your search or clear the filter.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailLogs;

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Badge } from "../../../../src/components/ui/badge";
import { Input } from "../../../../src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/components/ui/table";
import { format, parseISO, isAfter, isBefore, isToday } from "date-fns";
import { Appointment } from "../../../../src/types/appointment";
import {
  Calendar,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  X,
  Search,
  Plus,
  Filter,
  CalendarDays,
} from "lucide-react";
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
import { downloadAppointmentAsICal } from "../../../../src/services/appointmentService";

interface AppointmentListProps {
  appointments: Appointment[];
  loading?: boolean;
  onAddAppointment?: () => void;
  onEditAppointment?: (appointment: Appointment) => void;
  onDeleteAppointment?: (id: string) => void;
  onCompleteAppointment?: (id: string) => void;
  onViewAppointmentDetails?: (appointment: Appointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  loading = false,
  onAddAppointment = () => {},
  onEditAppointment = () => {},
  onDeleteAppointment = () => {},
  onCompleteAppointment = () => {},
  onViewAppointmentDetails = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null,
  );

  // Filter appointments based on search and filters
  const filteredAppointments = appointments.filter((appointment) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.description &&
        appointment.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (appointment.location &&
        appointment.location.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = !statusFilter || appointment.status === statusFilter;

    // Time filter
    let matchesTime = true;
    if (timeFilter) {
      const now = new Date();
      const appointmentDate = parseISO(appointment.start_time);

      if (timeFilter === "today") {
        matchesTime = isToday(appointmentDate);
      } else if (timeFilter === "upcoming") {
        matchesTime = isAfter(appointmentDate, now);
      } else if (timeFilter === "past") {
        matchesTime = isBefore(appointmentDate, now);
      }
    }

    return matchesSearch && matchesStatus && matchesTime;
  });

  // Format date
  const formatDateString = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy");
  };

  // Format time
  const formatTimeString = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "h:mm a");
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default";
      case "completed":
        return "success";
      case "cancelled":
        return "destructive";
      case "rescheduled":
        return "warning";
      default:
        return "secondary";
    }
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (appointmentToDelete) {
      onDeleteAppointment(appointmentToDelete);
      setAppointmentToDelete(null);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setTimeFilter(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Appointments</h2>
          <p className="text-muted-foreground">
            Schedule and manage vendor appointments
          </p>
        </div>
        <Button onClick={onAddAppointment}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
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
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={timeFilter || ""}
            onValueChange={(value) =>
              setTimeFilter(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
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

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow
                      key={appointment.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onViewAppointmentDetails(appointment)}
                    >
                      <TableCell>
                        <div className="font-medium">{appointment.title}</div>
                        {appointment.description && (
                          <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                            {appointment.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>
                              {formatDateString(appointment.start_time)}
                            </span>
                          </div>
                          <div className="flex items-center text-muted-foreground text-xs mt-1">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>
                              {formatTimeString(appointment.start_time)} -{" "}
                              {formatTimeString(appointment.end_time)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {appointment.location ? (
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            <span>{appointment.location}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            Not specified
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
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
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewAppointmentDetails(appointment);
                              }}
                            >
                              <CalendarDays className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditAppointment(appointment);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {appointment.status !== "completed" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCompleteAppointment(appointment.id);
                                }}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Completed
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadAppointmentAsICal(appointment);
                              }}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Export to Calendar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAppointmentToDelete(appointment.id);
                              }}
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
              <p>No appointments found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={onAddAppointment}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Schedule First Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!appointmentToDelete}
        onOpenChange={(open) => !open && setAppointmentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              appointment from your calendar.
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

export default AppointmentList;

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "@/types/appointment";
import { Vendor } from "@/types/vendor";
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  differenceInDays,
} from "date-fns";
import { Calendar, Clock, MapPin, CalendarDays, Plus } from "lucide-react";
import { useRealtimeUpcomingAppointments } from "@/hooks/useRealtimeAppointments";

interface UpcomingAppointmentsProps {
  vendors?: Vendor[];
  days?: number;
  limit?: number;
  onAddAppointment?: () => void;
  onViewAppointment?: (appointment: Appointment) => void;
  onViewAllAppointments?: () => void;
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  vendors = [],
  days = 7,
  limit = 3,
  onAddAppointment = () => {},
  onViewAppointment = () => {},
  onViewAllAppointments = () => {},
}) => {
  const { appointments, loading } = useRealtimeUpcomingAppointments(days);

  // Format date relative to today
  const formatRelativeDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      const daysUntil = differenceInDays(date, new Date());
      if (daysUntil < 7) {
        return format(date, "EEEE"); // Day name
      } else {
        return format(date, "MMM d"); // Month and day
      }
    }
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

  // Get vendor name by ID
  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    return vendor ? vendor.name : "Unknown Vendor";
  };

  // Limit the number of appointments shown
  const limitedAppointments = appointments.slice(0, limit);

  return (
    <Card className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 pb-1 sm:pb-2">
        <CardTitle className="text-base sm:text-lg font-semibold">
          Upcoming Appointments
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary h-8 px-2 sm:px-3"
          onClick={onAddAppointment}
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Schedule</span>
        </Button>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-2">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : limitedAppointments.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {limitedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-2 sm:p-3 border rounded-md hover:border-primary cursor-pointer transition-colors"
                onClick={() => onViewAppointment(appointment)}
              >
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <div className="font-medium text-sm sm:text-base">
                    {appointment.title}
                  </div>
                  <Badge
                    variant={getStatusBadge(appointment.status)}
                    className="text-xs"
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {getVendorName(appointment.vendor_id)}
                </div>
                <div className="flex flex-wrap items-center text-xs sm:text-sm mt-2 gap-y-1">
                  <div className="flex items-center mr-3">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span className="font-medium">
                      {formatRelativeDate(appointment.start_time)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{formatTimeString(appointment.start_time)}</span>
                  </div>
                </div>
                {appointment.location && (
                  <div className="flex items-center text-xs sm:text-sm mt-1 truncate">
                    <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{appointment.location}</span>
                  </div>
                )}
              </div>
            ))}

            {appointments.length > limit && (
              <Button
                variant="outline"
                className="w-full text-xs sm:text-sm h-8 sm:h-9"
                onClick={onViewAllAppointments}
              >
                <CalendarDays className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                View All {appointments.length} Appointments
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-4 sm:py-6 text-muted-foreground">
            <CalendarDays className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-muted-foreground/50" />
            <p className="mt-2 text-sm">
              No upcoming appointments in the next {days} days.
            </p>
            <Button
              variant="outline"
              onClick={onAddAppointment}
              className="mt-3 sm:mt-4 text-xs sm:text-sm h-8 sm:h-9"
            >
              Schedule Appointment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;

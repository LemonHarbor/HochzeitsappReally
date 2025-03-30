import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Badge } from "../../../../src/components/ui/badge";
import { Appointment } from "../../../../src/types/appointment";
import { Vendor } from "../../../../src/types/vendor";
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  differenceInDays,
} from "date-fns";
import { Calendar, Clock, MapPin, CalendarDays, Plus } from "lucide-react";
import { useRealtimeUpcomingAppointments } from "../../../../src/hooks/useRealtimeAppointments";

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
  limit = 5,
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Upcoming Appointments</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={onAddAppointment}
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : limitedAppointments.length > 0 ? (
          <div className="space-y-3">
            {limitedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-3 border rounded-md hover:border-primary cursor-pointer transition-colors"
                onClick={() => onViewAppointment(appointment)}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">{appointment.title}</div>
                  <Badge variant={getStatusBadge(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {getVendorName(appointment.vendor_id)}
                </div>
                <div className="flex items-center text-sm mt-2">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span className="font-medium">
                    {formatRelativeDate(appointment.start_time)}
                  </span>
                  <span className="mx-1">•</span>
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{formatTimeString(appointment.start_time)}</span>
                </div>
                {appointment.location && (
                  <div className="flex items-center text-sm mt-1">
                    <MapPin className="mr-1 h-3 w-3" />
                    <span>{appointment.location}</span>
                  </div>
                )}
              </div>
            ))}

            {appointments.length > limit && (
              <Button
                variant="outline"
                className="w-full"
                onClick={onViewAllAppointments}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                View All {appointments.length} Appointments
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <p className="mt-2">
              No upcoming appointments in the next {days} days.
            </p>
            <Button
              variant="outline"
              onClick={onAddAppointment}
              className="mt-4"
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

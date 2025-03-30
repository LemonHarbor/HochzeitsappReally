import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "@/types/appointment";
import { Vendor } from "@/types/vendor";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  addMonths,
  subMonths,
  getDay,
  isToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Plus,
} from "lucide-react";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  vendors?: Vendor[];
  onAddAppointment?: () => void;
  onViewAppointment?: (appointment: Appointment) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  vendors = [],
  onAddAppointment = () => {},
  onViewAppointment = () => {},
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get days in current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(monthStart);

  // Get appointments for selected date
  const selectedDateAppointments = appointments.filter((appointment) => {
    const appointmentDate = parseISO(appointment.start_time);
    return isSameDay(appointmentDate, selectedDate);
  });

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

  // Check if a day has appointments
  const dayHasAppointments = (day: Date) => {
    return appointments.some((appointment) => {
      const appointmentDate = parseISO(appointment.start_time);
      return isSameDay(appointmentDate, day);
    });
  };

  // Get appointment count for a day
  const getAppointmentCount = (day: Date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.start_time);
      return isSameDay(appointmentDate, day);
    }).length;
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Appointment Calendar</h2>
          <p className="text-muted-foreground">
            View and manage your vendor appointments
          </p>
        </div>
        <Button onClick={onAddAppointment}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevMonth}
                title="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                title="Today"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                title="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
              <div className="py-2">Sun</div>
              <div className="py-2">Mon</div>
              <div className="py-2">Tue</div>
              <div className="py-2">Wed</div>
              <div className="py-2">Thu</div>
              <div className="py-2">Fri</div>
              <div className="py-2">Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm">
              {/* Empty cells for days before the first of the month */}
              {Array.from({ length: startDay }).map((_, index) => (
                <div key={`empty-${index}`} className="h-24 p-1"></div>
              ))}

              {/* Calendar days */}
              {monthDays.map((day) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = isSameDay(day, selectedDate);
                const hasAppointments = dayHasAppointments(day);
                const appointmentCount = getAppointmentCount(day);
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={day.toString()}
                    className={`h-24 p-1 border rounded-md ${isCurrentMonth ? "" : "opacity-40"} ${
                      isSelected ? "border-primary" : ""
                    } ${
                      isCurrentDay ? "bg-muted/30" : ""
                    } hover:border-primary cursor-pointer transition-colors`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={`inline-block w-6 h-6 text-center ${isSelected ? "bg-primary text-primary-foreground rounded-full" : ""}`}
                      >
                        {format(day, "d")}
                      </span>
                      {hasAppointments && (
                        <Badge variant="default" className="text-xs">
                          {appointmentCount}
                        </Badge>
                      )}
                    </div>
                    {hasAppointments && (
                      <div className="mt-1 space-y-1">
                        {appointments
                          .filter((appointment) => {
                            const appointmentDate = parseISO(
                              appointment.start_time,
                            );
                            return isSameDay(appointmentDate, day);
                          })
                          .slice(0, 2)
                          .map((appointment) => (
                            <div
                              key={appointment.id}
                              className="text-xs truncate px-1 py-0.5 rounded bg-muted"
                              title={appointment.title}
                            >
                              {formatTimeString(appointment.start_time)}:{" "}
                              {appointment.title}
                            </div>
                          ))}
                        {appointmentCount > 2 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{appointmentCount - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{format(selectedDate, "EEEE, MMMM d, yyyy")}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateAppointments.length > 0 ? (
              <div className="space-y-4">
                {selectedDateAppointments.map((appointment) => (
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
                      <Clock className="mr-1 h-3 w-3" />
                      <span>
                        {formatTimeString(appointment.start_time)} -{" "}
                        {formatTimeString(appointment.end_time)}
                      </span>
                    </div>
                    {appointment.location && (
                      <div className="flex items-center text-sm mt-1">
                        <MapPin className="mr-1 h-3 w-3" />
                        <span>{appointment.location}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="mt-2">No appointments scheduled for this day.</p>
                <Button
                  variant="outline"
                  onClick={onAddAppointment}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentCalendar;

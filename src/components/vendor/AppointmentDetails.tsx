import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Appointment } from "@/types/appointment";
import {
  Calendar,
  Clock,
  MapPin,
  Edit,
  Download,
  CheckCircle,
  FileText,
  CalendarDays,
} from "lucide-react";
import { downloadAppointmentAsICal } from "@/services/appointmentService";
import { Textarea } from "@/components/ui/textarea";

interface AppointmentDetailsProps {
  appointment: Appointment;
  onEdit: () => void;
  onComplete: (notes?: string) => void;
  onBack: () => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  onEdit,
  onComplete,
  onBack,
}) => {
  const [meetingNotes, setMeetingNotes] = React.useState(
    appointment.notes || "",
  );

  // Format date
  const formatDateString = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "EEEE, MMMM d, yyyy");
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

  // Calculate duration in hours and minutes
  const calculateDuration = () => {
    const start = parseISO(appointment.start_time);
    const end = parseISO(appointment.end_time);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHrs === 0) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""}`;
    } else if (diffMins === 0) {
      return `${diffHrs} hour${diffHrs !== 1 ? "s" : ""}`;
    } else {
      return `${diffHrs} hour${diffHrs !== 1 ? "s" : ""} ${diffMins} minute${diffMins !== 1 ? "s" : ""}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{appointment.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusBadge(appointment.status)}>
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => downloadAppointmentAsICal(appointment)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to Calendar
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {appointment.status !== "completed" && (
            <Button onClick={() => onComplete(meetingNotes)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Completed
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Date</div>
                  <div>{formatDateString(appointment.start_time)}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Time</div>
                  <div>
                    {formatTimeString(appointment.start_time)} to{" "}
                    {formatTimeString(appointment.end_time)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duration: {calculateDuration()}
                  </div>
                </div>
              </div>

              {appointment.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div>{appointment.location}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Created</div>
                  <div>
                    {appointment.created_at
                      ? format(parseISO(appointment.created_at), "PPP")
                      : "Unknown"}
                  </div>
                </div>
              </div>

              {appointment.updated_at && (
                <div className="flex items-center gap-2">
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
                    className="h-5 w-5 text-muted-foreground"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <div>
                    <div className="font-medium">Last Updated</div>
                    <div>{format(parseISO(appointment.updated_at), "PPP")}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description & Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointment.description && (
                <div>
                  <div className="font-medium mb-2">Description</div>
                  <div className="p-3 bg-muted/20 rounded-md">
                    {appointment.description}
                  </div>
                </div>
              )}

              <div>
                <div className="font-medium mb-2">
                  {appointment.status === "completed"
                    ? "Meeting Notes"
                    : "Preparation Notes / Meeting Outcomes"}
                </div>
                {appointment.status === "completed" ? (
                  appointment.notes ? (
                    <div className="p-3 bg-muted/20 rounded-md whitespace-pre-line">
                      {appointment.notes}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      No notes were recorded for this appointment.
                    </div>
                  )
                ) : (
                  <div>
                    <Textarea
                      placeholder="Add notes about this appointment..."
                      className="min-h-[150px]"
                      value={meetingNotes}
                      onChange={(e) => setMeetingNotes(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      These notes will be saved when you mark the appointment as
                      completed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentDetails;

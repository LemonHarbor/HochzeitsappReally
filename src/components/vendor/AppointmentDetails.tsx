import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  format,
  parseISO,
  addDays,
  addHours,
  addMinutes,
  isBefore,
} from "date-fns";
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
  Bell,
  BellOff,
} from "lucide-react";
import {
  downloadAppointmentAsICal,
  setAppointmentReminder,
  cancelAppointmentReminder,
} from "@/services/appointmentService";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface AppointmentDetailsProps {
  appointment: Appointment;
  onEdit: () => void;
  onComplete: (notes?: string) => void;
  onBack: () => void;
  onReminderSet?: (appointment: Appointment) => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  onEdit,
  onComplete,
  onBack,
  onReminderSet,
}) => {
  const [meetingNotes, setMeetingNotes] = useState(appointment.notes || "");
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [reminderTime, setReminderTime] = useState<string>("1hour");
  const [reminderType, setReminderType] = useState<"email" | "sms" | "both">(
    "email",
  );
  const [isSettingReminder, setIsSettingReminder] = useState(false);

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

  // Handle setting a reminder
  const handleSetReminder = async () => {
    if (!appointment) return;

    setIsSettingReminder(true);
    try {
      // Calculate the reminder time based on the selection
      const appointmentDate = parseISO(appointment.start_time);
      let reminderDate: Date;

      switch (reminderTime) {
        case "15min":
          reminderDate = addMinutes(appointmentDate, -15);
          break;
        case "30min":
          reminderDate = addMinutes(appointmentDate, -30);
          break;
        case "1hour":
          reminderDate = addHours(appointmentDate, -1);
          break;
        case "2hours":
          reminderDate = addHours(appointmentDate, -2);
          break;
        case "1day":
          reminderDate = addDays(appointmentDate, -1);
          break;
        default:
          reminderDate = addHours(appointmentDate, -1);
      }

      // Don't allow setting reminders in the past
      if (isBefore(reminderDate, new Date())) {
        toast({
          title: "Cannot set reminder",
          description:
            "The reminder time is in the past. Please choose a different time.",
          variant: "destructive",
        });
        setIsSettingReminder(false);
        return;
      }

      const updatedAppointment = await setAppointmentReminder(
        appointment.id,
        reminderDate.toISOString(),
        reminderType,
      );

      toast({
        title: "Reminder set",
        description: `You will receive a ${reminderType} reminder ${reminderTime.replace(/([0-9]+)([a-z]+)/, "$1 $2")} before the appointment.`,
      });

      setReminderDialogOpen(false);

      // Call the callback if provided
      if (onReminderSet) {
        onReminderSet(updatedAppointment);
      }
    } catch (error) {
      console.error("Error setting reminder:", error);
      toast({
        title: "Error",
        description: "Failed to set reminder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSettingReminder(false);
    }
  };

  // Handle canceling a reminder
  const handleCancelReminder = async () => {
    if (!appointment) return;

    try {
      await cancelAppointmentReminder(appointment.id);

      toast({
        title: "Reminder canceled",
        description: "The appointment reminder has been canceled.",
      });

      // Call the callback if provided
      if (onReminderSet) {
        const updatedAppointment = {
          ...appointment,
          reminder_time: undefined,
          reminder_type: undefined,
        };
        onReminderSet(updatedAppointment);
      }
    } catch (error) {
      console.error("Error canceling reminder:", error);
      toast({
        title: "Error",
        description: "Failed to cancel reminder. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format reminder time for display
  const formatReminderTime = () => {
    if (!appointment.reminder_time) return null;

    const reminderDate = parseISO(appointment.reminder_time);
    const appointmentDate = parseISO(appointment.start_time);
    const diffMs = appointmentDate.getTime() - reminderDate.getTime();

    // Convert to appropriate unit
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} before`;
    } else if (diffMins < 24 * 60) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours !== 1 ? "s" : ""} before`;
    } else {
      const days = Math.floor(diffMins / (24 * 60));
      return `${days} day${days !== 1 ? "s" : ""} before`;
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
              {appointment.reminder_time && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  {formatReminderTime()}
                </Badge>
              )}
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
          {appointment.status === "scheduled" && (
            <>
              {appointment.reminder_time ? (
                <Button variant="outline" onClick={handleCancelReminder}>
                  <BellOff className="mr-2 h-4 w-4" />
                  Cancel Reminder
                </Button>
              ) : (
                <Dialog
                  open={reminderDialogOpen}
                  onOpenChange={setReminderDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Bell className="mr-2 h-4 w-4" />
                      Set Reminder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Set Appointment Reminder</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="reminder-time">Remind me</Label>
                        <Select
                          value={reminderTime}
                          onValueChange={(value) => setReminderTime(value)}
                        >
                          <SelectTrigger id="reminder-time">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15min">
                              15 minutes before
                            </SelectItem>
                            <SelectItem value="30min">
                              30 minutes before
                            </SelectItem>
                            <SelectItem value="1hour">1 hour before</SelectItem>
                            <SelectItem value="2hours">
                              2 hours before
                            </SelectItem>
                            <SelectItem value="1day">1 day before</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Notification method</Label>
                        <RadioGroup
                          value={reminderType}
                          onValueChange={(value) =>
                            setReminderType(value as "email" | "sms" | "both")
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="email" />
                            <Label htmlFor="email">Email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sms" id="sms" />
                            <Label htmlFor="sms">SMS</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both" />
                            <Label htmlFor="both">Both</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setReminderDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSetReminder}
                        disabled={isSettingReminder}
                      >
                        {isSettingReminder ? "Setting..." : "Set Reminder"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
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

              {appointment.reminder_time && (
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Reminder</div>
                    <div>
                      {format(
                        parseISO(appointment.reminder_time),
                        "PPP 'at' h:mm a",
                      )}
                      {appointment.reminder_type && (
                        <span className="text-sm text-muted-foreground block">
                          Via:{" "}
                          {appointment.reminder_type === "both"
                            ? "Email and SMS"
                            : appointment.reminder_type
                                .charAt(0)
                                .toUpperCase() +
                              appointment.reminder_type.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

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

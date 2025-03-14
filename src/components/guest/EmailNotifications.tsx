import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Mail, Send, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  sendRsvpReminder,
  sendBulkRsvpReminders,
  sendInvitation,
} from "@/services/emailService";

interface Guest {
  id: string;
  name: string;
  email: string;
  rsvpStatus: "confirmed" | "pending" | "declined";
}

interface EmailNotificationsProps {
  guests: Guest[];
}

const EmailNotifications: React.FC<EmailNotificationsProps> = ({ guests }) => {
  const { toast } = useToast();
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState("rsvp-reminders");
  const [rsvpDeadline, setRsvpDeadline] = useState<Date | undefined>(undefined);
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventDetails, setEventDetails] = useState({
    eventName: "Our Wedding",
    eventTime: "4:00 PM",
    eventLocation: "Grand Plaza Hotel",
    accessCode: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  // Filter guests based on active tab
  const filteredGuests = guests.filter((guest) => {
    if (activeTab === "rsvp-reminders") {
      return guest.rsvpStatus === "pending";
    }
    return true;
  });

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedGuests(filteredGuests.map((guest) => guest.id));
    } else {
      setSelectedGuests([]);
    }
  };

  // Handle individual guest selection
  const handleGuestSelect = (guestId: string, checked: boolean) => {
    if (checked) {
      setSelectedGuests([...selectedGuests, guestId]);
    } else {
      setSelectedGuests(selectedGuests.filter((id) => id !== guestId));
    }
  };

  // Handle sending RSVP reminders
  const handleSendRsvpReminders = async () => {
    if (!rsvpDeadline) {
      toast({
        variant: "destructive",
        title: "Missing RSVP Deadline",
        description: "Please select an RSVP deadline date.",
      });
      return;
    }

    if (selectedGuests.length === 0) {
      toast({
        variant: "destructive",
        title: "No Guests Selected",
        description: "Please select at least one guest to send reminders to.",
      });
      return;
    }

    setIsSending(true);

    try {
      const selectedGuestData = filteredGuests.filter((guest) =>
        selectedGuests.includes(guest.id),
      );

      const result = await sendBulkRsvpReminders(
        selectedGuestData.map((guest) => ({
          email: guest.email,
          name: guest.name,
        })),
        eventDetails.eventName,
        format(rsvpDeadline, "MMMM d, yyyy"),
      );

      if (result.success) {
        toast({
          title: "RSVP Reminders Sent",
          description: `Successfully sent ${result.sent} RSVP reminders.`,
        });
        setSelectedGuests([]);
        setSelectAll(false);
      } else {
        toast({
          variant: "destructive",
          title: "Some Reminders Failed",
          description: `Sent: ${result.sent}, Failed: ${result.failed}. Please check the logs for details.`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Sending Reminders",
        description: error.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handle sending invitations
  const handleSendInvitations = async () => {
    if (!eventDate || !rsvpDeadline) {
      toast({
        variant: "destructive",
        title: "Missing Event Details",
        description: "Please select both event date and RSVP deadline.",
      });
      return;
    }

    if (selectedGuests.length === 0) {
      toast({
        variant: "destructive",
        title: "No Guests Selected",
        description: "Please select at least one guest to send invitations to.",
      });
      return;
    }

    if (!eventDetails.accessCode) {
      toast({
        variant: "destructive",
        title: "Missing Access Code",
        description: "Please provide an access code for guests.",
      });
      return;
    }

    setIsSending(true);

    try {
      const selectedGuestData = filteredGuests.filter((guest) =>
        selectedGuests.includes(guest.id),
      );

      let sent = 0;
      let failed = 0;

      for (const guest of selectedGuestData) {
        try {
          const result = await sendInvitation(
            {
              email: guest.email,
              name: guest.name,
            },
            {
              ...eventDetails,
              eventDate: format(eventDate, "MMMM d, yyyy"),
              rsvpDeadline: format(rsvpDeadline, "MMMM d, yyyy"),
            },
          );

          if (result.success) {
            sent++;
          } else {
            failed++;
          }
        } catch (error) {
          failed++;
        }
      }

      if (failed === 0) {
        toast({
          title: "Invitations Sent",
          description: `Successfully sent ${sent} invitations.`,
        });
        setSelectedGuests([]);
        setSelectAll(false);
      } else {
        toast({
          variant: "destructive",
          title: "Some Invitations Failed",
          description: `Sent: ${sent}, Failed: ${failed}. Please check the logs for details.`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Sending Invitations",
        description: error.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  // Generate a random access code
  const generateAccessCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setEventDetails({ ...eventDetails, accessCode: code });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="rsvp-reminders"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rsvp-reminders">
              <Clock className="mr-2 h-4 w-4" /> RSVP Reminders
            </TabsTrigger>
            <TabsTrigger value="invitations">
              <Mail className="mr-2 h-4 w-4" /> Invitations
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-6">
            {/* Guest Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Select Guests</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all">Select All</Label>
                </div>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-4 p-3 border-b bg-muted/50 font-medium text-sm">
                  <div className="col-span-2">Guest</div>
                  <div>Email</div>
                  <div>Status</div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredGuests.length > 0 ? (
                    filteredGuests.map((guest) => (
                      <div
                        key={guest.id}
                        className="grid grid-cols-4 p-3 border-b last:border-0 items-center hover:bg-muted/20"
                      >
                        <div className="col-span-2 flex items-center space-x-2">
                          <Checkbox
                            id={`guest-${guest.id}`}
                            checked={selectedGuests.includes(guest.id)}
                            onCheckedChange={(checked) =>
                              handleGuestSelect(guest.id, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`guest-${guest.id}`}
                            className="cursor-pointer"
                          >
                            {guest.name}
                          </Label>
                        </div>
                        <div className="text-sm truncate">{guest.email}</div>
                        <div>
                          <Badge
                            variant={
                              guest.rsvpStatus === "confirmed"
                                ? "default"
                                : guest.rsvpStatus === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {guest.rsvpStatus}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      <Users className="mx-auto h-8 w-8 opacity-50 mb-2" />
                      <p>No guests available for this notification type.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <TabsContent value="rsvp-reminders" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-name">Event Name</Label>
                  <Input
                    id="event-name"
                    value={eventDetails.eventName}
                    onChange={(e) =>
                      setEventDetails({
                        ...eventDetails,
                        eventName: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>RSVP Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal",
                          !rsvpDeadline && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {rsvpDeadline ? (
                          format(rsvpDeadline, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={rsvpDeadline}
                        onSelect={setRsvpDeadline}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="custom-message">
                    Custom Message (Optional)
                  </Label>
                  <Textarea
                    id="custom-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Add a personal message to the reminder email"
                    className="mt-1"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleSendRsvpReminders}
                  disabled={isSending || selectedGuests.length === 0}
                >
                  {isSending ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send RSVP Reminders
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="invitations" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invitation-event-name">Event Name</Label>
                    <Input
                      id="invitation-event-name"
                      value={eventDetails.eventName}
                      onChange={(e) =>
                        setEventDetails({
                          ...eventDetails,
                          eventName: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-time">Event Time</Label>
                    <Input
                      id="event-time"
                      value={eventDetails.eventTime}
                      onChange={(e) =>
                        setEventDetails({
                          ...eventDetails,
                          eventTime: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="event-location">Event Location</Label>
                  <Input
                    id="event-location"
                    value={eventDetails.eventLocation}
                    onChange={(e) =>
                      setEventDetails({
                        ...eventDetails,
                        eventLocation: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Event Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full mt-1 justify-start text-left font-normal",
                            !eventDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {eventDate ? (
                            format(eventDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={eventDate}
                          onSelect={setEventDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>RSVP Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full mt-1 justify-start text-left font-normal",
                            !rsvpDeadline && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {rsvpDeadline ? (
                            format(rsvpDeadline, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={rsvpDeadline}
                          onSelect={setRsvpDeadline}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Label htmlFor="access-code">Guest Access Code</Label>
                    <div className="flex mt-1">
                      <Input
                        id="access-code"
                        value={eventDetails.accessCode}
                        onChange={(e) =>
                          setEventDetails({
                            ...eventDetails,
                            accessCode: e.target.value,
                          })
                        }
                        className="rounded-r-none"
                      />
                      <Button
                        variant="secondary"
                        className="rounded-l-none"
                        onClick={generateAccessCode}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="invitation-message">
                    Custom Message (Optional)
                  </Label>
                  <Textarea
                    id="invitation-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Add a personal message to the invitation email"
                    className="mt-1"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleSendInvitations}
                  disabled={
                    isSending ||
                    selectedGuests.length === 0 ||
                    !eventDate ||
                    !rsvpDeadline
                  }
                >
                  {isSending ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Invitations
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailNotifications;

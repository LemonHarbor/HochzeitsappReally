import React, { useState } from "react";
import { Button } from "../../../../src/components/ui/button";
import { Dialog, DialogContent } from "../../../../src/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../src/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Vendor } from "../../../../src/types/vendor";
import { Appointment } from "../../../../src/types/appointment";
import { useRealtimeAppointments } from "../../../../src/hooks/useRealtimeAppointments";
import { useToast } from "../../../../src/components/ui/use-toast";
import AppointmentList from "./AppointmentList";
import AppointmentForm from "./AppointmentForm";
import AppointmentDetails from "./AppointmentDetails";
import AppointmentCalendar from "./AppointmentCalendar";
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  completeAppointment,
} from "../../../../src/services/appointmentService";

interface VendorAppointmentsProps {
  vendor: Vendor;
  onBack: () => void;
}

const VendorAppointments: React.FC<VendorAppointmentsProps> = ({
  vendor,
  onBack,
}) => {
  const { toast } = useToast();
  const { appointments, loading } = useRealtimeAppointments(vendor.id);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [viewingAppointmentDetails, setViewingAppointmentDetails] =
    useState(false);
  const [activeTab, setActiveTab] = useState("list");

  // Handle adding a new appointment
  const handleAddAppointment = () => {
    setIsEditing(false);
    setSelectedAppointment(null);
    setShowAppointmentForm(true);
  };

  // Handle editing an appointment
  const handleEditAppointment = (appointment: Appointment) => {
    setIsEditing(true);
    setSelectedAppointment(appointment);
    setShowAppointmentForm(true);
  };

  // Handle deleting an appointment
  const handleDeleteAppointment = async (id: string) => {
    try {
      await deleteAppointment(id);
      toast({
        title: "Appointment Deleted",
        description: "The appointment has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete appointment: ${error.message}`,
      });
    }
  };

  // Handle completing an appointment
  const handleCompleteAppointment = async (id: string, notes?: string) => {
    try {
      await completeAppointment(id, notes);
      toast({
        title: "Appointment Completed",
        description: "The appointment has been marked as completed.",
      });
      setViewingAppointmentDetails(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to complete appointment: ${error.message}`,
      });
    }
  };

  // Handle appointment form submission
  const handleAppointmentFormSubmit = async (data: any) => {
    try {
      if (isEditing && selectedAppointment) {
        // Update existing appointment
        await updateAppointment(selectedAppointment.id, data);
        toast({
          title: "Appointment Updated",
          description: "The appointment has been updated successfully.",
        });
      } else {
        // Add new appointment
        await createAppointment(data);
        toast({
          title: "Appointment Scheduled",
          description: "The new appointment has been scheduled successfully.",
        });
      }

      setShowAppointmentForm(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "schedule"} appointment: ${error.message}`,
      });
    }
  };

  // Handle viewing appointment details
  const handleViewAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setViewingAppointmentDetails(true);
  };

  // Parse appointment dates for form
  const parseAppointmentDates = (appointment: Appointment) => {
    if (!appointment) return {};

    const startDate = new Date(appointment.start_time);
    const endDate = new Date(appointment.end_time);

    return {
      title: appointment.title,
      description: appointment.description,
      start_date: startDate.toISOString().split("T")[0],
      start_time: startDate.toISOString().split("T")[1].substring(0, 5),
      end_date: endDate.toISOString().split("T")[0],
      end_time: endDate.toISOString().split("T")[1].substring(0, 5),
      location: appointment.location,
      status: appointment.status,
      notes: appointment.notes,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{vendor.name}</h1>
          <p className="text-muted-foreground">Appointments & Scheduling</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {viewingAppointmentDetails && selectedAppointment ? (
            <AppointmentDetails
              appointment={selectedAppointment}
              onEdit={() => {
                setViewingAppointmentDetails(false);
                handleEditAppointment(selectedAppointment);
              }}
              onComplete={(notes) =>
                handleCompleteAppointment(selectedAppointment.id, notes)
              }
              onBack={() => setViewingAppointmentDetails(false)}
            />
          ) : (
            <AppointmentList
              appointments={appointments}
              loading={loading}
              onAddAppointment={handleAddAppointment}
              onEditAppointment={handleEditAppointment}
              onDeleteAppointment={handleDeleteAppointment}
              onCompleteAppointment={(id) => handleCompleteAppointment(id)}
              onViewAppointmentDetails={handleViewAppointmentDetails}
            />
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <AppointmentCalendar
            appointments={appointments}
            vendors={[vendor]}
            onAddAppointment={handleAddAppointment}
            onViewAppointment={handleViewAppointmentDetails}
          />
        </TabsContent>
      </Tabs>

      {/* Appointment Form Dialog */}
      <Dialog open={showAppointmentForm} onOpenChange={setShowAppointmentForm}>
        <DialogContent className="sm:max-w-2xl">
          <AppointmentForm
            vendorId={vendor.id}
            isEditing={isEditing}
            initialData={
              selectedAppointment
                ? parseAppointmentDates(selectedAppointment)
                : {}
            }
            onSubmit={handleAppointmentFormSubmit}
            onCancel={() => setShowAppointmentForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorAppointments;

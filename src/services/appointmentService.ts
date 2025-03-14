import { supabase } from "@/lib/supabase";
import { Appointment, AppointmentFormData } from "@/types/appointment";
import { format, addDays, startOfDay, endOfDay } from "date-fns";

// Get all appointments
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from("vendor_appointments")
      .select("*")
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// Get appointments by vendor ID
export const getAppointmentsByVendor = async (
  vendorId: string,
): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from("vendor_appointments")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching vendor appointments:", error);
    throw error;
  }
};

// Get appointments by date range
export const getAppointmentsByDateRange = async (
  startDate: Date,
  endDate: Date,
): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from("vendor_appointments")
      .select("*")
      .gte("start_time", startOfDay(startDate).toISOString())
      .lte("start_time", endOfDay(endDate).toISOString())
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching appointments by date range:", error);
    throw error;
  }
};

// Get upcoming appointments
export const getUpcomingAppointments = async (
  days: number = 7,
): Promise<Appointment[]> => {
  try {
    const now = new Date();
    const future = addDays(now, days);

    const { data, error } = await supabase
      .from("vendor_appointments")
      .select("*")
      .gte("start_time", now.toISOString())
      .lte("start_time", future.toISOString())
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    throw error;
  }
};

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  try {
    const { data, error } = await supabase
      .from("vendor_appointments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (
  appointmentData: AppointmentFormData,
): Promise<Appointment> => {
  try {
    const { data, error } = await supabase
      .from("vendor_appointments")
      .insert([appointmentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// Update an appointment
export const updateAppointment = async (
  id: string,
  appointmentData: Partial<AppointmentFormData>,
): Promise<Appointment> => {
  try {
    const { data, error } = await supabase
      .from("vendor_appointments")
      .update({
        ...appointmentData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("vendor_appointments")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};

// Mark appointment as completed
export const completeAppointment = async (
  id: string,
  notes?: string,
): Promise<Appointment> => {
  try {
    const updateData: Partial<AppointmentFormData> = {
      status: "completed",
      updated_at: new Date().toISOString(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    const { data, error } = await supabase
      .from("vendor_appointments")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error completing appointment:", error);
    throw error;
  }
};

// Mark appointment reminder as sent
export const markReminderSent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("vendor_appointments")
      .update({
        reminder_sent: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking reminder as sent:", error);
    throw error;
  }
};

// Export appointment to iCalendar format
export const exportAppointmentToICal = (appointment: Appointment): string => {
  const formatICalDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toISOString()
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace(/\.\d+/g, "");
  };

  const startDate = formatICalDate(appointment.start_time);
  const endDate = formatICalDate(appointment.end_time);

  const icalContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Planner//Vendor Appointment//EN",
    "BEGIN:VEVENT",
    `UID:${appointment.id}@weddingplanner.app`,
    `DTSTAMP:${formatICalDate(new Date().toISOString())}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${appointment.title}`,
    appointment.description ? `DESCRIPTION:${appointment.description}` : "",
    appointment.location ? `LOCATION:${appointment.location}` : "",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter((line) => line !== "")
    .join("\r\n");

  return icalContent;
};

// Download appointment as iCalendar file
export const downloadAppointmentAsICal = (appointment: Appointment): void => {
  const icalContent = exportAppointmentToICal(appointment);
  const blob = new Blob([icalContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `appointment_${appointment.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

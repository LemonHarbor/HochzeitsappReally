export interface Appointment {
  id: string;
  vendor_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
  reminder_sent: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AppointmentFormData {
  vendor_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
  reminder_sent?: boolean;
}

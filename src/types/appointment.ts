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
  reminder_time?: string; // When to send the reminder
  reminder_type?: "email" | "sms" | "both";
  created_at?: string;
  updated_at?: string;
}

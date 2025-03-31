export interface Appointment {
  id: string;
  vendor_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  status: string;
  notes: string;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed';

export interface AppointmentFormData {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  status: AppointmentStatus;
  notes: string;
  vendor_id?: string;
}

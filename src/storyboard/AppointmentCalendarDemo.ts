import { Appointment, Vendor } from "../types/appointment";
import { defineComponent, ref, computed, onMounted } from "vue";
import { addDays, subDays } from "date-fns";

export default defineComponent({
  name: "AppointmentCalendarDemo",
  
  setup() {
    // Current date for reference
    const now = new Date();

    // Sample vendor data
    const sampleVendors = ref<Vendor[]>([
      {
        id: "vendor-1",
        name: "Grand Plaza Hotel",
        category: "venue",
        status: "active",
        created_at: new Date().toISOString(),
      },
      {
        id: "vendor-2",
        name: "Elegant Catering",
        category: "catering",
        status: "active",
        created_at: new Date().toISOString(),
      },
      {
        id: "vendor-3",
        name: "Perfect Moments Photography",
        category: "photography",
        status: "active",
        created_at: new Date().toISOString(),
      },
    ]);

    // Sample appointment data
    const sampleAppointments = ref<Appointment[]>([
      {
        id: "appointment-1",
        vendor_id: "vendor-1",
        title: "Venue Tour",
        description: "Initial tour of the wedding venue",
        start_time: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          10,
          0,
        ).toISOString(),
        end_time: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          11,
          30,
        ).toISOString(),
        location: "Grand Plaza Hotel, Main Entrance",
        status: "scheduled",
        notes: "Ask about outdoor ceremony options and rain contingency plans",
        reminder_sent: false,
        created_at: subDays(now, 10).toISOString(),
      },
      {
        id: "appointment-2",
        vendor_id: "vendor-2",
        title: "Menu Tasting",
        description: "Sample the wedding menu options",
        start_time: addDays(now, 2).toISOString(),
        end_time: new Date(addDays(now, 2).setHours(14, 0)).toISOString(),
        location: "Elegant Catering Studio",
        status: "scheduled",
        notes: "Bring dietary restriction information for guests",
        reminder_sent: false,
        created_at: subDays(now, 5).toISOString(),
      },
      {
        id: "appointment-3",
        vendor_id: "vendor-3",
        title: "Photography Consultation",
        description: "Discuss photography style and important shots",
        start_time: addDays(now, 5).toISOString(),
        end_time: new Date(addDays(now, 5).setHours(16, 0)).toISOString(),
        location: "Video Call",
        status: "scheduled",
        notes: "Prepare list of must-have photos",
        reminder_sent: false,
        created_at: subDays(now, 3).toISOString(),
      },
      {
        id: "appointment-4",
        vendor_id: "vendor-1",
        title: "Contract Signing",
        description: "Review and sign venue contract",
        start_time: addDays(now, 7).toISOString(),
        end_time: new Date(addDays(now, 7).setHours(11, 0)).toISOString(),
        location: "Grand Plaza Hotel, Business Center",
        status: "scheduled",
        notes: "Bring payment for deposit",
        reminder_sent: false,
        created_at: subDays(now, 2).toISOString(),
      },
      {
        id: "appointment-5",
        vendor_id: "vendor-2",
        title: "Final Menu Selection",
        description: "Finalize wedding menu choices",
        start_time: addDays(now, 14).toISOString(),
        end_time: new Date(addDays(now, 14).setHours(15, 30)).toISOString(),
        location: "Elegant Catering Studio",
        status: "scheduled",
        notes: "Confirm final guest count and dietary restrictions",
        reminder_sent: false,
        created_at: subDays(now, 1).toISOString(),
      },
    ]);

    // Methoden für Event-Handling
    const handleAddAppointment = () => {
      console.log("Add appointment clicked");
    };

    const handleViewAppointment = (appointment: Appointment) => {
      console.log("View appointment", appointment);
    };

    return {
      sampleVendors,
      sampleAppointments,
      handleAddAppointment,
      handleViewAppointment
    };
  },
  
  // WeWeb-spezifische Konfiguration
  wwElement: {
    type: 'appointment-calendar-demo',
    uiSchema: {}
  },
  
  wwConfig: {
    general: {
      label: 'Terminkalender Demo',
      icon: 'calendar'
    }
  }
});

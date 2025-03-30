import React from "react";
import { ThemeProvider } from "../../../src/lib/theme";
import { LanguageProvider } from "../../../src/lib/language";
import { CurrencyProvider } from "../../../src/lib/currency";
import AppointmentCalendar from "../../../src/components/vendor/AppointmentCalendar";
import { addDays, subDays } from "date-fns";

const AppointmentCalendarDemo = () => {
  // Current date for reference
  const now = new Date();

  // Sample vendor data
  const sampleVendors = [
    {
      id: "vendor-1",
      name: "Grand Plaza Hotel",
      category: "venue",
      status: "active" as "active" | "inactive" | "pending",
      created_at: new Date().toISOString(),
    },
    {
      id: "vendor-2",
      name: "Elegant Catering",
      category: "catering",
      status: "active" as "active" | "inactive" | "pending",
      created_at: new Date().toISOString(),
    },
    {
      id: "vendor-3",
      name: "Perfect Moments Photography",
      category: "photography",
      status: "active" as "active" | "inactive" | "pending",
      created_at: new Date().toISOString(),
    },
  ];

  // Sample appointment data
  const sampleAppointments = [
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
      status: "scheduled" as "scheduled" | "completed" | "cancelled" | "rescheduled",
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
      status: "scheduled" as "scheduled" | "completed" | "cancelled" | "rescheduled",
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
      status: "scheduled" as "scheduled" | "completed" | "cancelled" | "rescheduled",
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
      status: "scheduled" as "scheduled" | "completed" | "cancelled" | "rescheduled",
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
      status: "scheduled" as "scheduled" | "completed" | "cancelled" | "rescheduled",
      notes: "Confirm final guest count and dietary restrictions",
      reminder_sent: false,
      created_at: subDays(now, 1).toISOString(),
    },
  ];

  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <div className="p-8 bg-background">
            <AppointmentCalendar
              appointments={sampleAppointments}
              vendors={sampleVendors}
              onAddAppointment={() => console.log("Add appointment clicked")}
              onViewAppointment={(appointment) =>
                console.log("View appointment", appointment)
              }
            />
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppointmentCalendarDemo;

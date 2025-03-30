import React from "react";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { CurrencyProvider } from "@/lib/currency";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import { addDays, subDays } from "date-fns";

const UpcomingAppointmentsDemo = () => {
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
  ];

  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <div className="p-8 bg-background">
            <UpcomingAppointments
              vendors={sampleVendors}
              onViewAppointment={(appointment) =>
                console.log("View appointment", appointment)
              }
              onViewAllAppointments={() => console.log("View all appointments")}
              onAddAppointment={() => console.log("Add appointment")}
            />
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default UpcomingAppointmentsDemo;

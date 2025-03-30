import React from "react";
import { useLanguage } from "@/lib/language";

export function GuestManager() {
  const { t } = useLanguage();
  
  // Dummy guest data for demonstration
  const guests = [
    { id: 1, name: "Anna & Thomas Schmidt", email: "schmidt@example.com", phone: "+49 123 456789", rsvpStatus: "confirmed", mealPreference: "vegetarian", group: "Familie" },
    { id: 2, name: "Julia Müller", email: "mueller@example.com", phone: "+49 987 654321", rsvpStatus: "pending", mealPreference: "standard", group: "Freunde" },
    { id: 3, name: "Michael Weber", email: "weber@example.com", phone: "+49 555 123456", rsvpStatus: "declined", mealPreference: "vegan", group: "Arbeit" },
  ];
  
  // RSVP status options
  const rsvpStatusOptions = [
    { value: "confirmed", label: t("guests.confirmed"), color: "bg-green-100 text-green-800" },
    { value: "pending", label: t("guests.pending"), color: "bg-yellow-100 text-yellow-800" },
    { value: "declined", label: t("guests.declined"), color: "bg-red-100 text-red-800" },
  ];
  
  // Get color for RSVP status
  const getRsvpStatusColor = (status) => {
    const option = rsvpStatusOptions.find(opt => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-800";
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("guests.title")}</h1>
        <p className="text-muted-foreground">{t("admin.sections.guests.description")}</p>
      </header>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <span className="mr-2">+</span> {t("guests.addGuest")}
        </button>
        <button className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
          <span className="mr-2">↓</span> {t("guests.importGuests")}
        </button>
        <button className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
          <span className="mr-2">↑</span> {t("guests.exportGuests")}
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <input 
              type="text" 
              placeholder={t("guests.searchGuests")} 
              className="px-3 py-2 border rounded-md w-full max-w-md"
            />
            <button className="ml-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
              {t("common.search")}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">{t("guests.name")}</th>
                <th className="px-4 py-3 text-left">{t("guests.email")}</th>
                <th className="px-4 py-3 text-left">{t("guests.phone")}</th>
                <th className="px-4 py-3 text-left">{t("guests.rsvpStatus")}</th>
                <th className="px-4 py-3 text-left">{t("guests.mealPreference")}</th>
                <th className="px-4 py-3 text-left">{t("guests.group")}</th>
                <th className="px-4 py-3 text-left">{t("guests.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">{guest.name}</td>
                  <td className="px-4 py-3">{guest.email}</td>
                  <td className="px-4 py-3">{guest.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRsvpStatusColor(guest.rsvpStatus)}`}>
                      {t(`guests.${guest.rsvpStatus}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{guest.mealPreference}</td>
                  <td className="px-4 py-3">{guest.group}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {t("guests.edit")}
                      </button>
                      <button className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        {t("guests.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">{t("guests.confirmedGuests")}</h3>
          <p className="text-4xl font-bold">1</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">{t("guests.pendingGuests")}</h3>
          <p className="text-4xl font-bold">1</p>
        </div>
        <div className="bg-red-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">{t("guests.declinedGuests")}</h3>
          <p className="text-4xl font-bold">1</p>
        </div>
      </div>
    </div>
  );
}

export default GuestManager;

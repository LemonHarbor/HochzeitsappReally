import React from "react";
import { useLanguage } from "../../../../src/lib/language";

export function AdminDashboard() {
  const { t } = useLanguage();
  
  // Dashboard sections
  const sections = [
    { id: "guests", icon: "👥", color: "bg-blue-100" },
    { id: "tables", icon: "🪑", color: "bg-green-100" },
    { id: "budget", icon: "💰", color: "bg-yellow-100" },
    { id: "timeline", icon: "📅", color: "bg-purple-100" },
    { id: "vendors", icon: "🏢", color: "bg-pink-100" },
    { id: "settings", icon: "⚙️", color: "bg-gray-100" },
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("app.title")} - {t("common.admin")}</h1>
        <p className="text-muted-foreground">{t("admin.dashboard.description")}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div 
            key={section.id}
            className={`${section.color} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{section.icon}</span>
              <h2 className="text-xl font-semibold">{t(`navigation.${section.id}`)}</h2>
            </div>
            <p className="text-muted-foreground mb-4">{t(`admin.sections.${section.id}.description`)}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t(`admin.sections.${section.id}.itemCount`, { count: 0 })}</span>
              <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm">
                {t("common.manage")}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{t("admin.quickActions")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-md">
            <span className="mr-2">👤</span> {t("guests.addGuest")}
          </button>
          <button className="flex items-center justify-center p-3 bg-green-50 hover:bg-green-100 rounded-md">
            <span className="mr-2">💸</span> {t("budget.addExpense")}
          </button>
          <button className="flex items-center justify-center p-3 bg-purple-50 hover:bg-purple-100 rounded-md">
            <span className="mr-2">📝</span> {t("timeline.addEvent")}
          </button>
        </div>
      </div>

      <div className="mt-10 bg-card rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{t("admin.weddingOverview")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">{t("settings.weddingDetails")}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("settings.weddingDate")}:</span>
                <span className="font-medium">--.--.----</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("settings.weddingLocation")}:</span>
                <span className="font-medium">---</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("settings.partnerNames")}:</span>
                <span className="font-medium">--- & ---</span>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm w-full">
              {t("common.edit")}
            </button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">{t("admin.statistics")}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("guests.totalGuests")}:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("budget.totalBudget")}:</span>
                <span className="font-medium">0 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("admin.daysUntilWedding")}:</span>
                <span className="font-medium">---</span>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm w-full">
              {t("admin.viewAllStatistics")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

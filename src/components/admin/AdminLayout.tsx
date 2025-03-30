import React from "react";
import { useLanguage } from "../../../../src/lib/language";

export function AdminLayout({ children }) {
  const { t } = useLanguage();
  
  // Navigation items
  const navItems = [
    { id: "dashboard", icon: "🏠", label: "common.dashboard" },
    { id: "guests", icon: "👥", label: "navigation.guests" },
    { id: "tables", icon: "🪑", label: "navigation.tables" },
    { id: "budget", icon: "💰", label: "navigation.budget" },
    { id: "timeline", icon: "📅", label: "navigation.timeline" },
    { id: "vendors", icon: "🏢", label: "navigation.vendors" },
    { id: "settings", icon: "⚙️", label: "navigation.settings" },
  ];
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">{t("app.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("common.admin")}</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a 
                  href={`#${item.id}`}
                  className="flex items-center p-3 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span>{t(item.label)}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <span>👤</span>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-muted-foreground">admin@example.com</p>
              </div>
            </div>
            <button className="text-sm text-muted-foreground hover:text-foreground">
              {t("navigation.logout")}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-10 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t("app.title")}</h1>
        <button className="p-2">
          <span className="text-xl">☰</span>
        </button>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="md:p-6 p-4 md:pt-6 pt-20 pb-20">
          {children}
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t border-t">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              className="p-3 flex flex-col items-center"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{t(item.label)}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

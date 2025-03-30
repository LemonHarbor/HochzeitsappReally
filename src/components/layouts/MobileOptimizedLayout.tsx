import React from "react";
import { useLanguage } from "@/lib/language";

export function MobileOptimizedLayout({ children }) {
  const { t } = useLanguage();
  
  // Navigation items
  const navItems = [
    { id: "dashboard", icon: "🏠", label: "common.dashboard" },
    { id: "guests", icon: "👥", label: "navigation.guests" },
    { id: "tables", icon: "🪑", label: "navigation.tables" },
    { id: "budget", icon: "💰", label: "navigation.budget" },
    { id: "timeline", icon: "📅", label: "navigation.timeline" },
  ];
  
  // More menu items
  const moreItems = [
    { id: "vendors", icon: "🏢", label: "navigation.vendors" },
    { id: "settings", icon: "⚙️", label: "navigation.settings" },
    { id: "guestArea", icon: "🎭", label: "navigation.guestArea" },
    { id: "help", icon: "❓", label: "common.help" },
    { id: "logout", icon: "🚪", label: "navigation.logout" },
  ];
  
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top header - visible on all devices */}
      <header className="bg-white shadow-sm z-10 p-4 flex items-center justify-between sticky top-0">
        <div className="flex items-center">
          <button 
            className="md:hidden p-2 mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="text-xl">☰</span>
          </button>
          <h1 className="text-xl font-bold">{t("app.title")}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <span className="text-xl">🔔</span>
          </button>
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            >
              <span className="text-xl">⋮</span>
            </button>
            
            {/* More menu dropdown */}
            {moreMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <div className="py-1">
                  {moreItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setMoreMenuOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{t(item.label)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile sidebar - only visible when menu is open on mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold">{t("app.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("common.admin")}</p>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-2">
                {[...navItems, ...moreItems].map((item) => (
                  <li key={item.id}>
                    <a 
                      href={`#${item.id}`}
                      className="flex items-center p-3 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mr-3 text-xl">{item.icon}</span>
                      <span>{t(item.label)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
      
      {/* Desktop sidebar - only visible on md and larger screens */}
      <div className="hidden md:flex flex-grow">
        <div className="w-64 bg-white shadow-md hidden md:block">
          <nav className="p-4">
            <ul className="space-y-2">
              {[...navItems, ...moreItems.slice(0, 3)].map((item) => (
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
        
        {/* Main content area for desktop */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
      
      {/* Main content area for mobile */}
      <div className="md:hidden flex-1 overflow-auto">
        <div className="p-4 pb-20">
          {children}
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t border-t z-10">
        <div className="flex justify-around">
          {navItems.map((item) => (
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

export default MobileOptimizedLayout;

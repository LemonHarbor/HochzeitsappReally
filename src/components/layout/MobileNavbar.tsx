import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  Calendar,
  Home,
  Settings,
  Grid3X3,
  CreditCard,
  Store,
} from "lucide-react";
import { useLanguage } from "@/lib/language";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export const MobileNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [navItems, setNavItems] = useState<NavItem[]>(getNavItems(language));

  // Update nav items when language changes
  useEffect(() => {
    setNavItems(getNavItems(language));

    // Listen for language changes
    const handleLanguageChange = () => {
      setNavItems(getNavItems(language));
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, [language]);

  function getNavItems(lang: string): NavItem[] {
    return [
      {
        icon: <Home className="h-5 w-5" />,
        label: lang === "de" ? "Start" : "Home",
        path: "/",
      },
      {
        icon: <Users className="h-5 w-5" />,
        label: lang === "de" ? "Gäste" : "Guests",
        path: "/guest-management",
      },
      {
        icon: <Grid3X3 className="h-5 w-5" />,
        label: lang === "de" ? "Tische" : "Tables",
        path: "/table-planner",
      },
      {
        icon: <CreditCard className="h-5 w-5" />,
        label: lang === "de" ? "Budget" : "Budget",
        path: "/budget-tracker",
      },
      {
        icon: <Calendar className="h-5 w-5" />,
        label: lang === "de" ? "Zeitplan" : "Timeline",
        path: "/timeline",
      },
      {
        icon: <Store className="h-5 w-5" />,
        label: lang === "de" ? "Dienstleister" : "Vendors",
        path: "/vendor-management",
      },
    ];
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden safe-area-padding bottom-nav-padding">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`flex flex-col items-center justify-center w-full h-full touch-active ${isActive ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

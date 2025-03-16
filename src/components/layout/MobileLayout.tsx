import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Grid3X3,
  CreditCard,
  Calendar,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isGuest = user?.role === "guest";

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
    {
      name: "Gäste",
      path: "/guest-management",
      icon: <Users className="h-5 w-5" />,
      permission: "canViewGuests",
    },
    {
      name: "Tischplan",
      path: "/table-planner",
      icon: <Grid3X3 className="h-5 w-5" />,
      permission: "canViewTables",
    },
    {
      name: "Budget",
      path: "/budget-tracker",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Zeitplan",
      path: "/timeline",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Dienstleister",
      path: "/vendor-management",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Einstellungen",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.permission) return true;
    if (
      item.permission === "canViewGuests" &&
      !user?.permissions?.canViewGuests
    )
      return false;
    if (
      item.permission === "canViewTables" &&
      !user?.permissions?.canViewTables
    )
      return false;
    return true;
  });

  // If user is a guest, only show guest area
  const guestMenuItems = [
    {
      name: "Gast-Bereich",
      path: "/guest-area",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const activeItems = isGuest ? guestMenuItems : filteredMenuItems;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-lg font-semibold">Hochzeitsplaner</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-2 mt-6">
                  {activeItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={
                        location.pathname === item.path ? "default" : "ghost"
                      }
                      className="justify-start"
                      onClick={() => navigate(item.path)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">{children}</main>

      {/* Mobile Navigation */}
      <nav className="sticky bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex justify-around items-center h-16">
          {activeItems.slice(0, 5).map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="icon"
              onClick={() => navigate(item.path)}
              className={
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }
            >
              {item.icon}
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;

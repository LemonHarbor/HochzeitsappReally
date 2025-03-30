import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  TableProperties,
  Settings,
  Calendar,
  Heart,
  LogOut,
  DollarSign,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/lib/language";
import { PermissionGuard } from "@/components/ui/permission-guard";

interface SidebarProps {
  userName?: string;
  userRole?: "Couple" | "Best Man" | "Maid of Honor" | "Guest";
  weddingName?: string;
  weddingDate?: Date;
  avatarUrl?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({
  userName,
  userRole,
  weddingName = "Smith-Johnson Wedding",
  weddingDate = new Date("2024-06-15"),
  avatarUrl,
  collapsed = false,
  onToggle,
}: SidebarProps) => {
  // Get user info from auth context
  const auth = useAuth();
  const user = auth?.user || null;
  const logout = auth?.logout || (() => {});
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggle) onToggle();
  };

  // Use provided values or fall back to auth context values
  const displayName = userName || (user ? user.name : "Guest");
  const displayRole =
    userRole ||
    (user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Guest");
  const displayAvatar =
    avatarUrl ||
    (user
      ? user.avatar
      : "https://api.dicebear.com/7.x/avataaars/svg?seed=wedding");
  // Format the wedding date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(weddingDate);

  // Calculate days until wedding
  const today = new Date();
  const timeDiff = weddingDate.getTime() - today.getTime();
  const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const navItems = [
    {
      name: t("nav.dashboard"),
      path: "/",
      icon: <Home className="h-5 w-5" />,
      permission: null, // Always visible
    },
    {
      name: t("nav.guestManagement"),
      path: "/guest-management",
      icon: <Users className="h-5 w-5" />,
      permission: "canViewGuests" as const,
    },
    {
      name: t("nav.tablePlanner"),
      path: "/table-planner",
      icon: <TableProperties className="h-5 w-5" />,
      permission: "canViewTables" as const,
    },
    {
      name: "Budget Tracker",
      path: "/budget-tracker",
      icon: <DollarSign className="h-5 w-5" />,
      permission: null, // Always visible
    },
    {
      name: t("timeline.title"),
      path: "/timeline",
      icon: <Calendar className="h-5 w-5" />,
      permission: null, // Always visible
    },
    {
      name: t("nav.guestArea"),
      path: "/guest-area",
      icon: <Heart className="h-5 w-5" />,
      permission: null, // Always visible for guests
      role: "guest" as const,
    },
    {
      name: t("nav.settings"),
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
      permission: null, // Always visible
    },
  ];

  return (
    <div
      className={cn(
        "h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Toggle button */}
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User profile section */}
      <div
        className={cn(
          "flex flex-col items-center",
          isCollapsed ? "p-2" : "p-4",
        )}
      >
        <Avatar className={cn("mb-2", isCollapsed ? "h-10 w-10" : "h-16 w-16")}>
          <AvatarImage src={displayAvatar} alt={displayName} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {displayName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <>
            <h2 className="text-lg font-semibold text-center">{displayName}</h2>
            <span className="text-sm text-muted-foreground">{displayRole}</span>
          </>
        )}
      </div>

      <Separator />

      {/* Wedding info */}
      {!isCollapsed && (
        <>
          <div className="p-4 bg-muted/50">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-1">
                <Heart className="h-4 w-4 text-rose-500" />
                <h3 className="font-medium">{weddingName}</h3>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formattedDate}</span>
              </div>
              <div className="mt-2 text-sm font-medium">
                {daysUntil > 0 ? (
                  <span className="text-primary">
                    {t("misc.daysUntilWedding", { days: daysUntil })}
                  </span>
                ) : daysUntil === 0 ? (
                  <span className="text-primary font-bold">
                    {t("misc.weddingToday")}
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    {t("misc.weddingCompleted")}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              {item.permission ? (
                <PermissionGuard requiredPermission={item.permission}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isCollapsed ? "justify-center" : "",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                      )
                    }
                    title={isCollapsed ? item.name : undefined}
                  >
                    {item.icon}
                    {!isCollapsed && item.name}
                  </NavLink>
                </PermissionGuard>
              ) : item.role ? (
                // Only show for specific role
                user?.role === item.role && (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isCollapsed ? "justify-center" : "",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                      )
                    }
                    title={isCollapsed ? item.name : undefined}
                  >
                    {item.icon}
                    {!isCollapsed && item.name}
                  </NavLink>
                )
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isCollapsed ? "justify-center" : "",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  {item.icon}
                  {!isCollapsed && item.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className={cn("p-4 mt-auto", isCollapsed && "p-2")}>
        <Button
          variant="outline"
          className={cn(
            "w-full",
            isCollapsed ? "justify-center" : "justify-start",
          )}
          size="sm"
          onClick={() => logout()}
          title={isCollapsed ? t("nav.logout") : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">{t("nav.logout")}</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

import React from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  TableProperties,
  Mail,
  Calendar,
  Settings,
  Users,
  PlusCircle,
  Send,
  Download,
  Store,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";
import { useAuth } from "@/context/AuthContext";
import { PermissionGuard } from "@/components/ui/permission-guard";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  variant: "default" | "secondary" | "outline" | "ghost";
  permission?: keyof typeof permissionMap;
  onClick?: () => void;
}

// Map of permission keys to actual permission names in the auth context
const permissionMap = {
  viewGuests: "canViewGuests",
  editGuests: "canEditGuests",
  viewTables: "canViewTables",
  editTables: "canEditTables",
  sendInvites: "canSendInvites",
  exportData: "canExportData",
} as const;

interface QuickActionsProps {
  className?: string;
}

const QuickActions = ({ className }: QuickActionsProps) => {
  const { t } = useLanguage();

  // Default actions with their permission requirements
  const defaultActions: QuickAction[] = [
    {
      id: "add-guest",
      label: t("guests.addGuest"),
      icon: <UserPlus className="h-4 w-4 mr-2" />,
      href: "/guest-management?action=add",
      variant: "default",
      permission: "editGuests",
    },
    {
      id: "create-table",
      label: t("tables.addTable"),
      icon: <TableProperties className="h-4 w-4 mr-2" />,
      href: "/table-planner?action=add-table",
      variant: "secondary",
      permission: "editTables",
    },
    {
      id: "send-invites",
      label: t("guests.sendInvites"),
      icon: <Mail className="h-4 w-4 mr-2" />,
      href: "/guest-management?action=send-invites",
      variant: "outline",
      permission: "sendInvites",
    },
    {
      id: "manage-vendors",
      label: t("vendors.manageVendors") || "Manage Vendors",
      icon: <Store className="h-4 w-4 mr-2" />,
      href: "/vendor-management",
      variant: "outline",
    },
    {
      id: "manage-timeline",
      label: t("timeline.title"),
      icon: <Calendar className="h-4 w-4 mr-2" />,
      href: "/timeline",
      variant: "outline",
    },
    {
      id: "budget-tracker",
      label: t("budget.title") || "Budget Tracker",
      icon: <DollarSign className="h-4 w-4 mr-2" />,
      href: "/budget-tracker",
      variant: "outline",
    },
    {
      id: "settings",
      label: t("settings.title"),
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: "/settings",
      variant: "ghost",
    },
  ];

  return (
    <div
      className={cn(
        "w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t("dashboard.quickActions")}</h2>
        <Button variant="ghost" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" /> {t("actions.moreActions")}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {defaultActions.map((action) =>
          action.permission ? (
            <PermissionGuard
              key={action.id}
              requiredPermission={permissionMap[action.permission]}
              fallback={null}
            >
              <Button
                variant={action.variant}
                className="w-full justify-start h-auto py-3"
                asChild
                onClick={action.onClick}
              >
                <Link to={action.href}>
                  {action.icon}
                  {action.label}
                </Link>
              </Button>
            </PermissionGuard>
          ) : (
            <Button
              key={action.id}
              variant={action.variant}
              className="w-full justify-start h-auto py-3"
              asChild
              onClick={action.onClick}
            >
              <Link to={action.href}>
                {action.icon}
                {action.label}
              </Link>
            </Button>
          ),
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
        <PermissionGuard requiredPermission="canSendInvites">
          <Button variant="link" size="sm" className="h-auto p-0">
            <Send className="h-3.5 w-3.5 mr-1" />{" "}
            {t("actions.shareWithPartner")}
          </Button>
        </PermissionGuard>

        <PermissionGuard requiredPermission="canExportData">
          <Button variant="link" size="sm" className="h-auto p-0">
            <Download className="h-3.5 w-3.5 mr-1" /> {t("actions.exportData")}
          </Button>
        </PermissionGuard>

        <PermissionGuard requiredPermission="canManagePermissions">
          <Button variant="link" size="sm" className="h-auto p-0">
            <Users className="h-3.5 w-3.5 mr-1" />{" "}
            {t("actions.managePermissions")}
          </Button>
        </PermissionGuard>
      </div>
    </div>
  );
};

export default QuickActions;

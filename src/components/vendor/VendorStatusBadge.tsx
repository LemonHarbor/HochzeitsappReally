import React from "react";
import { Badge } from "@/components/ui/badge";

interface VendorStatusBadgeProps {
  status: "active" | "pending" | "inactive";
  showIndicator?: boolean;
  size?: "sm" | "md" | "lg";
}

const VendorStatusBadge: React.FC<VendorStatusBadgeProps> = ({
  status,
  showIndicator = true,
  size = "md",
}) => {
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Get indicator color
  const getIndicatorColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get size classes
  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return { indicator: "w-1.5 h-1.5", text: "text-xs" };
      case "lg":
        return { indicator: "w-3 h-3", text: "text-base" };
      default: // md
        return { indicator: "w-2 h-2", text: "text-sm" };
    }
  };

  const sizeClasses = getSizeClasses(size);

  return (
    <div className="flex items-center gap-2">
      {showIndicator && (
        <div
          className={`${sizeClasses.indicator} rounded-full ${getIndicatorColor(
            status,
          )}`}
        ></div>
      )}
      <Badge variant={getStatusBadge(status)} className={sizeClasses.text}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    </div>
  );
};

export default VendorStatusBadge;

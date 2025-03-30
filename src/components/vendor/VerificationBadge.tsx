import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, ShieldCheck, FileCheck, Award } from "lucide-react";
import { VerificationType } from "@/types/review";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  type?: VerificationType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type = "admin",
  size = "md",
  showLabel = true,
  className,
}) => {
  // Get icon based on verification type
  const getIcon = () => {
    const iconProps = {
      className: cn(
        "flex-shrink-0",
        size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4",
      ),
    };

    switch (type) {
      case "purchase":
        return <CheckCircle {...iconProps} />;
      case "booking":
        return <ShieldCheck {...iconProps} />;
      case "contract":
        return <FileCheck {...iconProps} />;
      case "admin":
        return <Award {...iconProps} />;
      default:
        return <CheckCircle {...iconProps} />;
    }
  };

  // Get label based on verification type
  const getLabel = () => {
    switch (type) {
      case "purchase":
        return "Verified Purchase";
      case "booking":
        return "Verified Booking";
      case "contract":
        return "Verified Contract";
      case "admin":
        return "Verified by Admin";
      default:
        return "Verified";
    }
  };

  // Get tooltip text based on verification type
  const getTooltipText = () => {
    switch (type) {
      case "purchase":
        return "This review is from a verified purchase";
      case "booking":
        return "This reviewer has booked this vendor";
      case "contract":
        return "This reviewer has a contract with this vendor";
      case "admin":
        return "This review has been verified by an administrator";
      default:
        return "This review has been verified";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "bg-green-50 text-green-700 border-green-200 flex items-center gap-1",
              size === "sm" ? "px-1.5 py-0 text-xs" : "",
              size === "lg" ? "px-3 py-1 text-sm" : "",
              className,
            )}
          >
            {getIcon()}
            {showLabel && <span className="ml-1">{getLabel()}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { VerificationBadge, type VerificationType };
export default VerificationBadge;

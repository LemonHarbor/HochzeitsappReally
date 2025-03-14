import React from "react";
import { Button } from "@/components/ui/button";
import { Code, Code2 } from "lucide-react";
import { useDeveloperMode } from "@/lib/developer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DeveloperToggle({ className }: { className?: string }) {
  const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDeveloperMode}
            className={`${isDeveloperMode ? "text-green-500" : ""} ${className || ""}`}
          >
            {isDeveloperMode ? (
              <Code2 className="h-5 w-5" />
            ) : (
              <Code className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle Developer Mode</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isDeveloperMode
              ? "Deaktiviere Entwicklermodus"
              : "Aktiviere Entwicklermodus"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

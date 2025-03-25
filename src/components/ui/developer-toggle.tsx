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
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

interface DeveloperToggleProps {
  className?: string;
}

export function DeveloperToggle({ className }: DeveloperToggleProps) {
  const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();
  const { language } = useLanguage();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDeveloperMode}
            className={cn(isDeveloperMode ? "text-green-500" : "", className)}
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
            {language === "de"
              ? isDeveloperMode
                ? "Entwicklermodus deaktivieren"
                : "Entwicklermodus aktivieren"
              : isDeveloperMode
                ? "Disable Developer Mode"
                : "Enable Developer Mode"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

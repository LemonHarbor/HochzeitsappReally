import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../../../../src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../src/components/ui/tooltip";
import { useTheme } from "../../../../src/lib/theme";
import { cn } from "../../../../src/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn("relative", className)}
          >
            <Sun
              className={cn(
                "h-5 w-5 transition-all",
                isDarkMode ? "scale-0 opacity-0" : "scale-100 opacity-100",
              )}
            />
            <Moon
              className={cn(
                "absolute h-5 w-5 transition-all",
                isDarkMode ? "scale-100 opacity-100" : "scale-0 opacity-0",
              )}
            />
            <span className="sr-only">
              {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isDarkMode ? "Switch to light mode" : "Switch to dark mode"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

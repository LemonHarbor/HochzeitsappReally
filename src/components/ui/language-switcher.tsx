import React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: "en" | "de") => {
    setLanguage(lang);
  };

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("relative", className)}
              >
                <Globe className="h-5 w-5" />
                <span className="absolute bottom-1 right-1 text-[10px] font-bold">
                  {language.toUpperCase()}
                </span>
                <span className="sr-only">
                  {language === "en" ? "Change language" : "Sprache ändern"}
                </span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{language === "en" ? "Change language" : "Sprache ändern"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {language === "en" ? "Select Language" : "Sprache auswählen"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={language === "en" ? "bg-accent" : ""}
        >
          {language === "en" ? "English" : "Englisch"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("de")}
          className={language === "de" ? "bg-accent" : ""}
        >
          {language === "en" ? "German" : "Deutsch"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import React from "react";
import { DollarSign, Euro } from "lucide-react";
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
import { useCurrency } from "@/lib/currency";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

interface CurrencySwitcherProps {
  className?: string;
}

export function CurrencySwitcher({ className }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency();
  const { language } = useLanguage();

  const handleCurrencyChange = (newCurrency: "USD" | "EUR") => {
    setCurrency(newCurrency);
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
                {currency === "USD" ? (
                  <DollarSign className="h-5 w-5" />
                ) : (
                  <Euro className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {language === "de" ? "Währung wechseln" : "Switch currency"}
                </span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{language === "de" ? "Währung wechseln" : "Switch currency"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {language === "de" ? "Währung auswählen" : "Select currency"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleCurrencyChange("USD")}
          className={currency === "USD" ? "bg-accent" : ""}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          USD - {language === "de" ? "US-Dollar" : "US Dollar"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleCurrencyChange("EUR")}
          className={currency === "EUR" ? "bg-accent" : ""}
        >
          <Euro className="h-4 w-4 mr-2" />
          EUR - Euro
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

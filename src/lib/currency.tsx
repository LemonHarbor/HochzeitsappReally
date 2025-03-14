import React, { createContext, useContext, useState, useEffect } from "react";

type CurrencyType = "USD" | "EUR";

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  formatCurrency: (amount: number) => string;
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  formatCurrency: () => "",
  currencySymbol: "$",
});

export const useCurrency = () => useContext(CurrencyContext);

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<CurrencyType>("USD");
  const [currencySymbol, setCurrencySymbol] = useState("$");

  useEffect(() => {
    // Update currency symbol when currency changes
    setCurrencySymbol(currency === "USD" ? "$" : "€");
  }, [currency]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(currency === "USD" ? "en-US" : "de-DE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, formatCurrency, currencySymbol }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "./i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Create a global event for language changes
export const LANGUAGE_CHANGE_EVENT = "languageChanged";

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

// Export the hook separately
export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: React.ReactNode;
}

// Define the component as a function declaration
export function LanguageProvider({ children }: LanguageProviderProps) {
  // Check if user has a language preference in localStorage
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage === "de" ? "de" : "en") as Language;
  });

  // Custom setLanguage function that also dispatches an event
  const setLanguage = (newLanguage: Language) => {
    // Save to localStorage
    localStorage.setItem("language", newLanguage);

    // Update state
    setLanguageState(newLanguage);

    // Dispatch global event for other components
    window.dispatchEvent(
      new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: newLanguage }),
    );
  };

  // Listen for language change events from other components
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setLanguageState(event.detail);
    };

    window.addEventListener(
      LANGUAGE_CHANGE_EVENT,
      handleLanguageChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        LANGUAGE_CHANGE_EVENT,
        handleLanguageChange as EventListener,
      );
    };
  }, []);

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Split the key by dots to navigate nested objects
    const keys = key.split(".");
    let value: any = translations[language];

    // Navigate through the nested keys
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        let fallbackValue = translations["en"];
        for (const fk of keys) {
          if (
            fallbackValue &&
            typeof fallbackValue === "object" &&
            fk in fallbackValue
          ) {
            fallbackValue = fallbackValue[fk];
          } else {
            return key; // Return the key itself if not found in fallback
          }
        }
        value = fallbackValue;
        break;
      }
    }

    // If the value is not a string (e.g., it's an object), return the key
    if (typeof value !== "string") {
      return key;
    }

    // Replace parameters in the string if provided
    if (params) {
      return Object.entries(params).reduce((result, [param, paramValue]) => {
        return result.replace(`{${param}}`, String(paramValue));
      }, value);
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, Translations } from "./i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Create a global event for language changes
export const LANGUAGE_CHANGE_EVENT = "app-language-change";

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

// Export the hook separately to fix Fast Refresh issues
export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: React.ReactNode;
}

// Define the provider component separately and then export it
function LanguageProviderComponent({ children }: LanguageProviderProps) {
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
    const translation = translations[language][key] || key;

    if (!params) return translation;

    // Replace parameters in the translation string
    return Object.entries(params).reduce((result, [param, value]) => {
      return result.replace(`{${param}}`, String(value));
    }, translation);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Export the provider as a named export
export const LanguageProvider = LanguageProviderComponent;

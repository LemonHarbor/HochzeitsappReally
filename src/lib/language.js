import React, { useState, useEffect, createContext, useContext } from "react";

// Import language files
import de from "./i18n/de.json";
import en from "./i18n/en.json";

// Define available languages
const languages = {
  de,
  en,
};

// Create context
const LanguageContext = createContext();

// Language provider component
export function LanguageProvider({ children }) {
  // Get saved language from localStorage or use browser language or default to German
  const getBrowserLanguage = () => {
    const browserLang = navigator.language.split("-")[0];
    return browserLang && languages[browserLang] ? browserLang : "de";
  };

  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage || getBrowserLanguage();
  });

  const [translations, setTranslations] = useState(languages[language] || languages.de);

  // Update translations when language changes
  useEffect(() => {
    setTranslations(languages[language] || languages.de);
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key) => {
    if (!key) return "";
    
    // Split the key by dots to access nested properties
    const keys = key.split(".");
    let result = translations;
    
    // Navigate through the nested properties
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // Return the key if translation not found
        return key;
      }
    }
    
    return result;
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t, languages: Object.keys(languages) } },
    children
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

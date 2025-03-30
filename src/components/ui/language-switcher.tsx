import React from "react";
import { useLanguage } from "../../../../src/lib/language";

export function LanguageSwitcher() {
  const { language, setLanguage, languages } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-2 py-1 text-sm rounded ${
            language === lang
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          aria-label={`Switch to ${lang === 'de' ? 'German' : 'English'}`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

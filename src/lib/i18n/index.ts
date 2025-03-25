import { en } from "./en";
import { de } from "./de";

export type Language = "en" | "de";

export const languages: Record<Language, string> = {
  en: "English",
  de: "Deutsch",
};

export const translations = {
  en,
  de,
};

export type Translations = typeof en;

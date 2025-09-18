"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Define types for better type safety
type Language = "en" | "fr";
type Translations = { [key: string]: string | Translations }; // Allows for nested objects

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Helper function to get a nested property from an object using a dot-notation string
const getNestedTranslation = (
  translations: Translations,
  key: string
): string => {
  const keys = key.split(".");
  let result: string | Translations | undefined = translations;

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k] as Translations;
    } else {
      // If the key is not found, return the key itself as a fallback
      return key;
    }
  }

  return typeof result === "string" ? result : key;
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr"); // Default to French
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    // On initial load, check for saved language preference in localStorage
    const savedLanguage = localStorage.getItem("akili-language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Dynamically load the dictionary file whenever the language changes
    const loadTranslations = async () => {
      try {
        const dictionary = await import(`@/dictionaries/${language}.json`);
        setTranslations(dictionary.default || {});
      } catch (error) {
        console.error(
          `Could not load translations for language: ${language}`,
          error
        );
        setTranslations({}); // Fallback to an empty object on error
      }
    };

    loadTranslations();
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("akili-language", lang);
  };

  const t = useCallback(
    (key: string): string => {
      if (!Object.keys(translations).length) {
        return key; // Return key if translations are not loaded yet
      }
      return getNestedTranslation(translations, key);
    },
    [translations]
  );

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

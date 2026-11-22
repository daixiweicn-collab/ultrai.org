"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "zh";
export type Theme = "dark" | "light";

interface AppContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (en: string, zh: string) => string;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("ultrai_locale") as Locale | null;
    if (savedLocale === "en" || savedLocale === "zh") {
      setLocaleState(savedLocale);
    }
    const savedTheme = window.localStorage.getItem("ultrai_theme") as Theme | null;
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("light", savedTheme === "light");
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("ultrai_locale", next);
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "zh" : "en");
  };

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("ultrai_theme", next);
    document.documentElement.classList.toggle("light", next === "light");
  };

  const t = (en: string, zh: string) => (locale === "en" ? en : zh);

  return (
    <AppContext.Provider
      value={{ locale, setLocale, toggleLocale, theme, toggleTheme, t }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}

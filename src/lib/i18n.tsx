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

function safeGetStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // 隐私模式或禁用存储时优雅忽略
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedLocale = safeGetStorage("ultrai_locale") as Locale | null;
    if (savedLocale === "en" || savedLocale === "zh") {
      setLocaleState(savedLocale);
      document.documentElement.lang = savedLocale === "zh" ? "zh-CN" : "en";
    }
    const savedTheme = safeGetStorage("ultrai_theme") as Theme | null;
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("light", savedTheme === "light");
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    safeSetStorage("ultrai_locale", next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "zh" : "en");
  };

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    safeSetStorage("ultrai_theme", next);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("light", next === "light");
    }
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

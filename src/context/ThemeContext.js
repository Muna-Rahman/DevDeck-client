"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext();

const THEME_KEY = "devdeck_theme";

const applyThemeToRoot = (theme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }
};

export function ThemeProvider({ children }) {

  const [theme, setThemeState] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("light") ? "light" : "dark";
    }
    return "dark";
  });

  // Keep in sync if the class is ever changed by something else (defensive).
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      const next = root.classList.contains("light") ? "light" : "dark";
      setThemeState((prev) => (prev !== next ? next : prev));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    applyThemeToRoot(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (err) {
      // localStorage unavailable (e.g. private browsing) — theme just won't persist
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === "dark", setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
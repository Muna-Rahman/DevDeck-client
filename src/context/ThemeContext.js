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

  // IMPORTANT: always start from the same value the server used ("dark"),
  // even though layout.js's inline script may have already applied the
  // real theme class to <html> before hydration. Reading the live DOM
  // class here would make the client's first render diverge from the
  // server-rendered HTML and trigger a hydration mismatch (e.g. Navbar's
  // Sun/Moon icon flipping). The real theme is picked up right after
  // mount in the effect below instead.
  const [theme, setThemeState] = useState("dark");

  // Sync state to whatever theme is actually on <html> (set by the
  // pre-hydration inline script in layout.js) once we're mounted on the
  // client. This runs after hydration, so it can't cause a mismatch —
  // it just corrects the icon/state on the very next paint.
  useEffect(() => {
    const root = document.documentElement;
    const actual = root.classList.contains("light") ? "light" : "dark";
    setThemeState((prev) => (prev !== actual ? actual : prev));
  }, []);

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
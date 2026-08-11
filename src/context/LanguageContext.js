"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const FontSizeContext = createContext();

const applyFontSizeToRoot = (size) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  switch (size) {
    case "small":
      root.style.fontSize = "14px";
      break;
    case "large":
      root.style.fontSize = "18px";
      break;
    case "medium":
    default:
      root.style.fontSize = "16px";
      break;
  }
};

export function LanguageProvider({ children }) {
  const [fontSize, setFontSizeState] = useState("medium");
  const { data: session } = authClient.useSession();

  useEffect(() => {
    async function loadBackendSettings() {
      if (session?.user) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/user/settings`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
          if (res.ok) {
            const data = await res.json();
            const nextFontSize =
              data.fontSize || localStorage.getItem("devdeck_fontsize") || "medium";

            setFontSizeState(nextFontSize);
            localStorage.setItem("devdeck_fontsize", nextFontSize);
            applyFontSizeToRoot(nextFontSize);
            return;
          }
        } catch (err) {
          console.error("Failed to load settings from server:", err);
        }
      }

      // Local fallback
      const savedFontSize =
        localStorage.getItem("devdeck_fontsize") || "medium";
      setFontSizeState(savedFontSize);
      applyFontSizeToRoot(savedFontSize);
    }

    loadBackendSettings();
  }, [session]);

  const setFontSize = (size) => {
    setFontSizeState(size);
    localStorage.setItem("devdeck_fontsize", size);
    applyFontSizeToRoot(size);
  };

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        setFontSize,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
}

export function useLanguage() {
  return useContext(FontSizeContext);
}
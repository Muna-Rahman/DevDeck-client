"use client";

import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
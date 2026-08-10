"use client";

import React from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function Providers({ children }) {
  return (
    <SidebarProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SidebarProvider>
  );
}
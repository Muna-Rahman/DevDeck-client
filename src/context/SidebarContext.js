"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();
const STORAGE_KEY = "devdeck:sidebarCollapsed";

export function SidebarProvider({ children }) {

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved !== null) setIsSidebarCollapsed(saved === "true");
    } catch (err) {
      console.error("SidebarContext: failed to read saved state.", err);
    } finally {
      setHasHydrated(true);
    }
  }, []);


  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(isSidebarCollapsed));
    } catch (err) {
      console.error("SidebarContext: failed to save state.", err);
    }
  }, [isSidebarCollapsed, hasHydrated]);

  return (
    <SidebarContext.Provider value={{ isSidebarCollapsed, setIsSidebarCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
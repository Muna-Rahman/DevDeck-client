"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const SidebarContext = createContext();

// The sidebar is now a slide-in drawer. It always starts closed (nothing is
// persisted), and opens when the hamburger button in the navbar is pressed.
export function SidebarProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen((v) => !v), []);

  const value = useMemo(
    () => ({
      isSidebarOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar,
      // Backwards-compatible aliases for older code.
      isSidebarCollapsed: !isSidebarOpen,
      setIsSidebarCollapsed: (collapsed) => setIsSidebarOpen(!collapsed),
    }),
    [isSidebarOpen, openSidebar, closeSidebar, toggleSidebar]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  return useContext(SidebarContext);
}
"use client";

import React from 'react';
import { SidebarProvider } from "@/context/SidebarContext";
import Navbar from "@/components/Navbar";
import SidebarContainer from "@/components/SidebarContainer";

export default function Providers({ children }) {
  return (
    <SidebarProvider>
      {/* Navbar sits safely at the top */}
      <Navbar />
      
      <div className="flex min-h-screen">
        {/* Transparent Frosted Glass Sidebar */}
        <SidebarContainer />
        
        {/* Main Content Workspace viewport */}
        <main className="flex-1 transition-all duration-300 bg-transparent min-w-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
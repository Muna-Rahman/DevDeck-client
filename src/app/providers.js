"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/context/SidebarContext";
import Navbar from "@/components/Navbar";
import SidebarContainer from "@/components/SidebarContainer";

export default function Providers({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Safely sync client rendering status to prevent hydration mismatch flashes
  useEffect(() => {
    setMounted(true);
  }, []);

  // Identify auth views to selectively exclude general dashboard controls
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <SidebarProvider>
      {/* The context provider wraps everything unconditionally so 'useSidebar()' 
        never throws an undefined error down the component tree.
      */}
      {!isAuthPage && mounted && <Navbar />}
      
      <div className="flex min-h-screen">
        {/* Only mount the Sidebar when not on auth pages and after client hydration */}
        {!isAuthPage && mounted && <SidebarContainer />}
        
        {/* Main Content Workspace viewport */}
        <main className="flex-1 transition-all duration-300 bg-transparent min-w-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
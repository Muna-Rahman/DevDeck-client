'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SidebarContainer from './SidebarContainer';
import Navbar from './Navbar';

export default function LayoutClientWrapper({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Standard clean matching for the home, login, and registration screens
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/register';

  if (!mounted) {
    return <div className="w-full min-h-screen bg-[#0B0E14]">{children}</div>;
  }

  // If public route, completely bypass internal dashboard frame wrappers
  if (isPublicRoute) {
    return <div className="w-full min-h-screen bg-[#0B0E14]">{children}</div>;
  }

  // Render dashboard layout strictly on workspace internal screens
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0E14]">
      <SidebarContainer />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 text-[#F5F6FA]">
          {children}
        </main>
      </div>
    </div>
  );
}
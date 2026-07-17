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

  // Strict check: if the path matches public endpoints, bypass dashboard rendering entirely
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/register';

  // Return a completely clean background canvas during server hydration
  if (!mounted) {
    return <div className="w-full min-h-screen bg-[#0B0E14]">{children}</div>;
  }

  // FORCE completely clean landing page with zero sidebar markup injected
  if (isPublicRoute) {
    return <div className="w-full min-h-screen bg-[#0B0E14] relative z-10">{children}</div>;
  }

  // Render dashboard layout chrome strictly on internal workspace screens only
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
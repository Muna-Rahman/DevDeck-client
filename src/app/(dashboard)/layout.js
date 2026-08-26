"use client";

import React from 'react';
import SidebarContainer from "@/components/SidebarContainer";
import Navbar from "@/components/Navbar";
import { useSidebar } from "@/context/SidebarContext";

export default function DashboardLayout({ children }) {
  const { isSidebarCollapsed } = useSidebar();

  return (
    <div className="flex h-screen w-screen overflow-hidden relative font-sans antialiased text-[#1A1D29] dark:text-[#F5F6FA] transition-colors duration-300">
      
      {/* 100% SHARP BACKDROP IMAGES */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        
        {/* Light Mode Wallpaper — rendered unconditionally (identical markup
            on server and client) and shown/hidden purely with the `dark:`
            CSS variant. Branching this on a JS `isDark` state instead caused
            a hydration mismatch, because the theme-init script can already
            have set the real class before React's first client render. */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed animate-fade-in dark:hidden"
          style={{ backgroundImage: `url('https://i.pinimg.com/1200x/58/c9/0f/58c90fc7915681c2894fb639a19ec5e3.jpg')` }}
        >
          <div className="absolute inset-0 bg-[#F4F5FA]/15" />
        </div>

        {/* Dark Mode Wallpaper — visible only when the `dark` class is present */}
        <div 
          className="hidden dark:block absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed animate-fade-in"
          style={{ backgroundImage: `url('https://i.pinimg.com/736x/67/e9/60/67e960e46c4010b585d4eac3f4382654.jpg')` }}
        >
          <div className="absolute inset-0 bg-[#0B0E14]/25" />
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#E94FD1] opacity-[0.15] blur-[160px]" />
          <div className="absolute bottom-[5%] left-[-5%] w-[550px] h-[550px] rounded-full bg-[#3FE0C5] opacity-[0.12] blur-[180px]" />
        </div>
      </div>

      {/* SIDEBAR NAVIGATION PANEL FRAME */}
      <div className="relative z-30 flex-shrink-0">
        <SidebarContainer />
      </div>
      
      {/* LAYER WRAPPER SYSTEM CONTAINER */}
      <div className="flex flex-col flex-1 min-w-0 h-full relative z-10 overflow-hidden">
        
        {/* Floating Header Navbar Module Integration */}
        <div className="w-full fixed top-0 left-0 right-0 z-20">
          <Navbar />
        </div>
        
        {/* Core Layout Workspace Target Area */}
        <main 
          className={`flex-1 overflow-y-auto px-6 md:px-12 pb-16 pt-28 transition-all duration-300 min-w-0
            ${isSidebarCollapsed ? 'pl-24' : 'pl-72'}`}
        >
          <div className="max-w-[1440px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
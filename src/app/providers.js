'use client';
import React from 'react';
import { SidebarProvider } from '@/context/SidebarContext';

export default function Providers({ children }) {
  return (
    <SidebarProvider>
      {/* 
        HeroUI v3 does not use a Provider wrapper wrapper!
        It works purely out-of-the-box using the global HTML classes.
      */}
      {children}
    </SidebarProvider>
  );
}
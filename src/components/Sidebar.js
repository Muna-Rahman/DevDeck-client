"use client";

import React from 'react';
import Link from 'next/link';
import { useSidebar } from "@/context/SidebarContext";
import { 
  FolderPlus, 
  Folder, 
  Heart, 
  Clock, 
  Tag, 
  Settings,
  Menu 
} from 'lucide-react';

export default function Sidebar() {
  // Grab state directly from the context provider framework
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();

  return (
    <div 
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] border-r transition-all duration-300 ease-in-out z-40 glass-rail
        bg-black/10 dark:bg-black/30 backdrop-blur-xl border-white/10 shadow-2xl text-white
        ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="flex flex-col h-full justify-between p-4 overflow-x-hidden select-none">
        
        <div className="space-y-6">
          
          {/* HEADER ROW: Anchored Hamburger Button Inside the Sidebar */}
          <div className={`flex items-center w-full transition-all duration-300
            ${isSidebarCollapsed ? 'justify-center' : 'justify-start pl-1'}`}
          >
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200 shadow-md backdrop-blur-md hover:scale-105 active:scale-95"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Create Category Action Button */}
          <div className="mt-2">
            <button 
              className={`w-full flex items-center justify-center gap-2 font-semibold text-white bg-gradient-to-r from-seagreen/80 via-mauve/80 to-rosepink/80 hover:from-seagreen hover:via-mauve hover:to-rosepink backdrop-blur-md bg-[length:200%_auto] hover:bg-right rounded-xl shadow-md transition-all duration-500 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0
                ${isSidebarCollapsed ? 'p-3 rounded-full' : 'px-4 py-3'}`}
            >
              <FolderPlus size={20} className="animate-pulse" />
              {!isSidebarCollapsed && <span className="transition-opacity duration-300 whitespace-nowrap">Create Category</span>}
            </button>
          </div>

          {/* Core Navigation Links */}
          <nav className="space-y-1">
            <a href="#categories" className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/10 font-medium transition-all duration-200 group">
              <Folder size={20} className="group-hover:scale-110 transition-transform duration-200 text-seagreen" />
              {!isSidebarCollapsed && <span className="whitespace-nowrap text-white/90">Categories</span>}
            </a>

            <a href="#favorites" className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/10 font-medium transition-all duration-200 group">
              <Heart size={20} className="group-hover:scale-110 transition-transform duration-200 text-rosepink" />
              {!isSidebarCollapsed && <span className="whitespace-nowrap text-white/90">Favorites</span>}
            </a>

            <nav>
              <a href="#recent" className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/10 font-medium transition-all duration-200 group">
                <Clock size={20} className="group-hover:scale-110 transition-transform duration-200 text-mauve" />
                {!isSidebarCollapsed && <span className="whitespace-nowrap text-white/90">Recent</span>}
              </a>
            </nav>

            <a href="#tags" className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/10 font-medium transition-all duration-200 group">
              <Tag size={20} className="group-hover:scale-110 transition-transform duration-200 text-rosepink/80" />
              {!isSidebarCollapsed && <span className="whitespace-nowrap text-white/90">Tags</span>}
            </a>
          </nav>
        </div>

        {/* Bottom Panel Settings Shortcut (Connected with Next.js Link Engine) */}
        <div className="border-t border-white/10 pt-4 mb-4">
          <Link 
            href="/settings" 
            className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/10 font-medium transition-all duration-200 group"
          >
            <Settings size={20} className="group-hover:rotate-45 transition-transform duration-300 ease-out text-white/70" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap text-white/90">Settings</span>}
          </Link>
        </div>

      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { 
  Plus, 
  Layers, 
  Link2, 
  Code, 
  FileText, 
  Cpu, 
  Lightbulb
} from 'lucide-react';

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const { isSidebarCollapsed } = useSidebar();

  const filters = [
    { id: 'All', label: 'All', icon: Layers },
    { id: 'Links', label: 'Links', icon: Link2 },
    { id: 'Repositories', label: 'Repositories', icon: Code },
    { id: 'Snippets', label: 'Snippets', icon: Code },
    { id: 'Notes', label: 'Notes', icon: FileText },
    { id: 'APIs', label: 'APIs', icon: Cpu },
    { id: 'Ideas', label: 'Ideas', icon: Lightbulb },
  ];

  const categories = [
    { id: 'frontend', title: 'Frontend', accent: 'border-t-4 border-rosepink' },
    { id: 'backend', title: 'Backend', accent: 'border-t-4 border-seagreen' },
    { id: 'learning', title: 'Learning', accent: 'border-t-4 border-mauve' },
    { id: 'projects', title: 'Projects', accent: 'border-t-4 border-[#159FE0]' },
    { id: 'utilities', title: 'Utilities', accent: 'border-t-4 border-[#E8940F]' },
  ];

  return (
    <div className="w-full min-h-screen relative flex flex-col justify-start pt-24 p-6 overflow-x-hidden">
      
      {/* BACKGROUND GRAPHIC INTERFACE LAYERS */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed block dark:hidden"
             style={{ backgroundImage: `url('https://i.pinimg.com/1200x/58/c9/0f/58c90fc7915681c2894fb639a19ec5e3.jpg')` }}>
          <div className="absolute inset-0 backdrop-brightness-[0.80]" />
        </div>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed hidden dark:block"
             style={{ backgroundImage: `url('https://i.pinimg.com/736x/67/e9/60/67e960e46c4010b585d4eac3f4382654.jpg')` }}>
          <div className="absolute inset-0 bg-[#0B0E14]/10 backdrop-brightness-[0.55]" />
        </div>
      </div>

      {/* MAIN INNER WORKSPACE CONTAINER */}
      <div className={`relative z-10 w-full flex-1 flex flex-col justify-start transition-all duration-300 px-4 md:px-8
        ${isSidebarCollapsed ? 'ml-16 w-[calc(100%-4rem)]' : 'ml-16 lg:ml-64 w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)]'}`}
      >
        
        {/* HERO HEADER BLOCK */}
        <div className="flex flex-col gap-4 mb-8 w-full">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center w-full">
            <div className="rounded-2xl p-6 bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 max-w-xl shadow-2xl flex-1 w-full transition-all duration-300 hover:border-white/20">
              <h1 className="text-3xl font-extrabold tracking-tight uppercase font-sans text-white text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                Welcome back, Developer.
              </h1>
              <p className="text-xs font-semibold tracking-wide text-white/60 uppercase mt-2 text-justify [text-justify:inter-word] flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3FE0C5] animate-ping mt-1 flex-shrink-0" />
                System environment operating stable. Ready for deployment deck workspace layout implementation parameters.
              </p>
            </div>

            {/* HUD Status Integrity Circle */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300 hud-ring w-full sm:w-auto justify-center sm:justify-start">
              <div className="relative h-16 w-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-gradient-stroke stroke-[url(#hudGradient)] transition-all duration-1000 ease-out animate-dash" strokeWidth="3" strokeDasharray="75, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <defs>
                    <linearGradient id="hudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2E8B57" />
                      <stop offset="50%" stopColor="#E0B0FF" />
                      <stop offset="100%" stopColor="#FF66CC" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-xs font-mono font-bold text-white">75%</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Deck Integrity</p>
                <p className="text-sm font-black font-mono text-[#3FE0C5]">SYS_ACTIVE</p>
              </div>
            </div>
          </div>
        </div>

        {/* CHIPS FILTER SLOTS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar w-full select-none justify-start">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 glass-pill whitespace-nowrap
                ${activeFilter === filter.id 
                  ? `bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.15)] border-white/40 text-white scale-105` 
                  : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white'
                }`}
            >
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* COLUMNS MATRIX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 w-full items-start">
          {categories.map((col) => (
            <div 
              key={col.id} 
              className={`rounded-2xl bg-black/20 backdrop-blur-xl border border-white/5 p-4 flex flex-col min-h-[450px] transition-all duration-300 hover:border-white/10 deck-column ${col.accent}`}
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/80 font-sans">
                  {col.title}
                </h3>
                <button className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200">
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-4 text-center flex flex-col items-center justify-center py-8 group transition-all duration-300 hover:bg-white/[0.07] deck-card">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30 group-hover:bg-[#3FE0C5] transition-colors duration-300 mb-2 animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors duration-300">
                    No items found
                  </p>
                  <p className="text-[9px] text-white/30 mt-1 max-w-[140px] mx-auto text-justify [text-justify:inter-word]">
                    Connect your backend repository environment to stream live digital assets into this zone.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
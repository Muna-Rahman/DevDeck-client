"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Layers, 
  Link2, 
  Code, 
  FileText, 
  Cpu, 
  Lightbulb
} from 'lucide-react';

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState('All');

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
    <div className="w-full flex flex-col justify-start relative z-10 space-y-6">
      
      {/* HERO HEADER: Extra Dense Frosted Glass Card */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center w-full">
          <div className="rounded-2xl p-6 bg-white/85 dark:bg-black/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 max-w-xl shadow-2xl flex-1 w-full transition-all duration-300 hover:border-white/60 dark:hover:border-white/20">
            <h1 className="text-3xl font-extrabold tracking-tight uppercase font-sans text-[#1A1D29] dark:text-white text-left drop-shadow-sm dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Welcome back, Alex.
            </h1>
            <p className="text-xs font-semibold tracking-wide text-[#5B5F72] dark:text-white/70 uppercase mt-2 text-justify flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0FB8A6] dark:bg-[#3FE0C5] animate-ping mt-1 flex-shrink-0" />
              System environment operating stable. Ready for deployment deck workspace layout implementation parameters.
            </p>
          </div>

          {/* HUD Status Integrity Widget: Dense Frosted Glass */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/85 dark:bg-black/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-2xl w-full sm:w-auto justify-center sm:justify-start">
            <div className="relative h-16 w-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-black/5 dark:text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#D6249F] dark:text-[#E94FD1]" strokeWidth="3" strokeDasharray="75, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-xs font-mono font-bold text-[#1A1D29] dark:text-white">75%</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] dark:text-white/50">Deck Integrity</p>
              <p className="text-sm font-black font-mono text-[#0FB8A6] dark:text-[#3FE0C5]">SYS_ACTIVE</p>
            </div>
          </div>
        </div>
      </div>

      {/* STAT MODULE CARDS: High-Density Frosted Glass Plates */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Cards", value: "12", icon: Layers, color: "text-[#7C3AED] dark:text-[#8B5CF6]" },
          { label: "Repositories", value: "2", icon: Code, color: "text-[#159FE0] dark:text-[#2FD1FF]" },
          { label: "Snippets", value: "2", icon: Code, color: "text-[#D6249F] dark:text-[#E94FD1]" },
          { label: "Ideas", value: "2", icon: Lightbulb, color: "text-[#E8940F] dark:text-[#FFB84D]" },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/85 dark:bg-black/60 backdrop-blur-2xl p-5 flex items-center justify-between shadow-2xl transition-all duration-300 hover:border-white/60 dark:hover:border-white/20">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#5B5F72] dark:text-white/50 font-semibold">{stat.label}</p>
              <p className="text-xl font-bold text-[#1A1D29] dark:text-white mt-1">{stat.value}</p>
            </div>
            <div className={`p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 ${stat.color}`}>
              <stat.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* CHIPS FILTER SLOTS: Ultra-Frosted Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar w-full select-none justify-start">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap
              ${activeFilter === filter.id 
                ? `bg-white dark:bg-white/20 shadow-xl border-white/60 dark:border-white/40 text-[#D6249F] dark:text-white scale-105` 
                : 'bg-white/70 dark:bg-black/40 border-white/30 dark:border-white/5 text-[#5B5F72] dark:text-white/60 hover:bg-white/90 dark:hover:bg-black/60 hover:text-[#1A1D29] dark:hover:text-white'
              }`}
          >
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* COLUMNS MATRIX GRID: Heavy Frosted Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 w-full items-start">
        {categories.map((col) => (
          <div 
            key={col.id} 
            className={`rounded-2xl bg-white/85 dark:bg-black/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-4 flex flex-col min-h-[450px] transition-all duration-300 hover:border-white/60 dark:hover:border-white/20 shadow-2xl deck-column ${col.accent}`}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/5 dark:border-white/5">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#1A1D29] dark:text-white/80 font-sans">
                {col.title}
              </h3>
              <button className="p-1 rounded-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[#5B5F72] dark:text-white/60 hover:text-[#1A1D29] dark:hover:text-white transition-all duration-200">
                <Plus size={14} />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {/* Inner Empty State Cards: Deep Dynamic Contrast Layer */}
              <div className="rounded-xl border border-dashed border-black/20 dark:border-white/20 bg-black/[0.03] dark:bg-white/5 backdrop-blur-xl p-4 text-center flex flex-col items-center justify-center py-8 group transition-all duration-300 hover:bg-black/[0.06] dark:hover:bg-white/10 deck-card">
                <div className="h-1.5 w-1.5 rounded-full bg-black/20 dark:bg-white/30 group-hover:bg-[#0FB8A6] dark:group-hover:bg-[#3FE0C5] transition-colors duration-300 mb-2 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5B5F72] dark:text-white/40 group-hover:text-[#1A1D29] dark:group-hover:text-white/70 transition-colors duration-300">
                  No items found
                </p>
                <p className="text-[9px] text-[#5B5F72]/60 dark:text-white/40 mt-1 max-w-[140px] mx-auto text-justify">
                  Connect your backend repository environment to stream live digital assets into this zone.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
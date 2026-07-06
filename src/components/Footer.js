
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[rgba(20,20,40,0.06)] bg-white/40 backdrop-blur-glass dark:border-white/5 dark:bg-[#1A1D29]/40 transition-colors duration-300 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left Side: System Version & Diagnostics Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-[rgba(20,20,40,0.04)] dark:border-white/5 text-[10px] font-mono uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3FE0C5] shadow-[0_0_6px_#3FE0C5] animate-pulse" />
            Currently Online
          </div>
          <p className="text-[11px] font-medium tracking-wide text-[#5B5F72] dark:text-[#9CA3B5] uppercase">
            @ {new Date().getFullYear()} DevDeck Workspace .
          </p>
        </div>

        {/* Center/Right Side: Quick Tactical Action Bar Links */}
        <div className="flex items-center gap-1">
          <Link 
            href="/docs" 
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] hover:text-[#1A1D29] dark:text-[#9CA3B5] dark:hover:text-[#F5F6FA] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Docs
          </Link>
          <span className="text-[rgba(20,20,40,0.15)] dark:text-white/10 text-xs select-none">|</span>
          <a
        className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] hover:text-[#1A1D29] dark:text-[#9CA3B5] dark:hover:text-[#F5F6FA] hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1"

            >
                 Terminal Logs<span className="text-[rgba(20,20,40,0.15)] dark:text-white/10 text-xs select-none">|</span>
            </a>
          
          <span className="text-[rgba(20,20,40,0.15)] dark:text-white/10 text-xs select-none">|</span>
          <a 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] hover:text-[#1A1D29] dark:text-[#9CA3B5] dark:hover:text-[#F5F6FA] hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1"
          >
             Repositatory <span className="text-[rgba(20,20,40,0.15)] dark:text-white/10 text-xs select-none">|</span>
            <span className="text-[#FF6FB5] dark:text-[#E94FD1]">↗</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
"use client";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <header className="w-full h-16 border-b border-black/5 dark:border-white/5 px-8 flex items-center justify-between backdrop-blur-md bg-[var(--card-bg)] sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-8">
        {/* Logo Element */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            D
          </div>
          <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">DevDeck</span>
        </div>

        {/* Global Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button className="px-4 py-1.5 text-sm font-semibold rounded-xl text-[#8B5CF6] dark:text-[#A78BDA] bg-purple-500/10">Dashboard</button>
          <button className="px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">My Cards</button>
          <button className="px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Snippets</button>
          <button className="px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Bookmarks</button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Field UI */}
        <div className="relative hidden sm:block">
          <span className="absolute left-3 top-2.5 text-xs opacity-50">🔍</span>
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-56 h-9 pl-9 pr-12 text-xs font-medium rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[var(--text-primary)] focus:outline-none"
          />
          <kbd className="absolute right-2 top-2 px-1.5 py-0.5 text-[10px] font-sans font-semibold rounded bg-black/10 dark:bg-white/10 text-[var(--text-secondary)]">
            ⌘K
          </kbd>
        </div>

        {/* Quick Utilities */}
        <button className="p-2 text-sm text-[var(--text-secondary)]">🔔</button>
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
          className="p-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        {/* Add Card Action */}
        <button className="btn-primary text-xs font-bold px-4 h-9 flex items-center gap-1.5">
          <span>＋</span> Add Card
        </button>

        {/* Avatar Placeholder */}
        <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-xs font-bold text-[#8B5CF6]">
          A
        </div>
      </div>
    </header>
  );
}
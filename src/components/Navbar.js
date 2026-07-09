"use client";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  // JS Micro-Interaction Ripple System for Dark Mode Buttons
  const handleDarkRipple = (e) => {
    if (!isDark) return; // Light theme handles it natively via SVG draw-in
    const btn = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;

    const rect = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("ripple-span");

    const ripple = btn.getElementsByClassName("ripple-span")[0];
    if (ripple) ripple.remove();

    btn.appendChild(circle);
  };

  return (
    <nav className="w-full py-4 px-8 flex items-center justify-between border-b border-[var(--border-card)] backdrop-blur-md transition-colors duration-500">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tight">
          Dev<span className={isDark ? "gradient-text-dark" : "gradient-text-light"}>Deck</span>
        </span>
        <span className="font-accent-serif text-xs px-2 py-0.5 rounded bg-opacity-10 bg-purple-500 text-[var(--accent-purple)] ml-2">
          v2.0
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Dynamic Themed Action Button */}
        <button
          onClick={handleDarkRipple}
          className="btn-primary-theme px-6 py-2.5 flex items-center justify-center relative group min-w-[140px]"
        >
          {/* Light Theme SVG Perimeter Mask */}
          {!isDark && (
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="100%" height="100%" fill="none" rx="12" />
            </svg>
          )}
          <span className="relative z-10 text-sm">Launch Deck</span>
        </button>

        {/* Theme Toggle Trigger */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer shadow-sm"
          aria-label="Toggle Theme Mood"
        >
          {isDark ? (
            /* Cosmic Sun/Elegant icon */
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14.5 12a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          ) : (
            /* Elegant Lavender Crescent Moon icon */
            <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
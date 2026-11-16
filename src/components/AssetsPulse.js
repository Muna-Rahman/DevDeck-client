"use client";

import React from "react";
import CountUp from "@/components/CountUp";

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Left block of the dashboard hero: glowing activity ring, the big gradient
 * total and a live status pill. The ring is full and orbited while the
 * workspace is active, and drops to a short amber arc when idle.
 */
export default function AssetsPulse({ total, isActive, uptime }) {
  return (
    <div className="flex items-center gap-6 min-w-0">
      {/* Activity ring */}
      <div className="relative h-28 w-28 shrink-0">
        <span
          className={`absolute inset-3 rounded-full blur-2xl transition-colors duration-700 ${
            isActive ? "bg-[#3FE0C5]/40 animate-pulse" : "bg-amber-500/30"
          }`}
        />
        <svg viewBox="0 0 100 100" className="relative h-full w-full -rotate-90">
          <defs>
            <linearGradient id="pulseRingActive" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#E94FD1" />
              <stop offset="0.5" stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#3FE0C5" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="6" className="stroke-black/10 dark:stroke-white/10" />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            stroke={isActive ? "url(#pulseRingActive)" : "#F59E0B"}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={isActive ? 0 : CIRCUMFERENCE * 0.7}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        </svg>

        {/* Dot that circles the ring while active */}
        {isActive && (
          <div className="absolute inset-0 animate-[spin_6s_linear_infinite]">
            <span className="absolute left-1/2 top-[3px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_3px_rgba(63,224,197,0.9)]" />
          </div>
        )}

        {/* Core */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className={`h-3.5 w-3.5 rounded-full ${isActive ? "bg-[#0FB8A6] dark:bg-[#3FE0C5] animate-ping" : "bg-amber-500 animate-pulse"}`} />
          <span className={`absolute h-3.5 w-3.5 rounded-full ${isActive ? "bg-[#0FB8A6] dark:bg-[#3FE0C5]" : "bg-amber-500"}`} />
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#5B5F72] dark:text-white/50">Total Assets</p>
        <p
          className="mt-1 text-6xl sm:text-7xl font-black leading-none tracking-tighter tabular-nums bg-gradient-to-r from-[#D6249F] via-[#7C3AED] to-[#0FB8A6] dark:from-[#FF6FB5] dark:via-[#B794F6] dark:to-[#3FE0C5] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(233,79,209,0.35)]"
        >
          <CountUp value={total} />
        </p>

        <div className="mt-3 inline-flex items-center gap-3 rounded-full border px-3 py-1 text-[11px] font-mono border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5">
          <span className={`flex items-center gap-1.5 font-black ${isActive ? "text-[#0FB8A6] dark:text-[#3FE0C5]" : "text-amber-500"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-[#0FB8A6] dark:bg-[#3FE0C5] animate-pulse" : "bg-amber-500"}`} />
            {isActive ? "SYS_ACTIVE" : "SYS_IDLE"}
          </span>
          <span className="h-3 w-px bg-black/15 dark:bg-white/15" />
          <span className="text-zinc-500 dark:text-white/50">
            Uptime <span className="font-bold text-[#D6249F] dark:text-[#E94FD1]">{uptime}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
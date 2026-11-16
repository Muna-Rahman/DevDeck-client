"use client";

import React, { useEffect, useState } from "react";

// Accent per built-in category
const ACCENTS = {
  links: "#2FD1FF",
  repos: "#8B5CF6",
  snippets: "#E94FD1",
  notes: "#22C55E",
  apis: "#F97316",
  ideas: "#FFB84D",
};

// Custom categories get a stable colour from this palette, picked from their name
const CUSTOM_PALETTE = ["#EC4899", "#06B6D4", "#EAB308", "#A855F7", "#94A3B8", "#F43F5E", "#84CC16", "#6366F1"];

export function accentFor(id) {
  if (ACCENTS[id]) return ACCENTS[id];
  // FNV-1a hash so similar names still land on different colours
  let hash = 2166136261;
  for (const ch of String(id)) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
  return CUSTOM_PALETTE[(hash >>> 0) % CUSTOM_PALETTE.length];
}

const STEP_MS = 2800; // time each card stays in front
const EXIT_MS = 380; // front card sliding out before it drops to the back
const VISIBLE_DEPTH = 4; // cards deeper than this stay hidden behind the stack

/**
 * A fanned stack of category cards. The front card slides out and drops to the
 * back while the rest move up, looping on its own. Hover pauses it, clicking a
 * card behind brings it forward, clicking the front card calls onSelect.
 *
 * items: [{ id, title, count, icon: Icon }]
 */
export default function DeckStack({ items, onSelect }) {
  const [front, setFront] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const n = items.length;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (n < 2 || paused || reduceMotion) return;
    let swap;
    const timer = setTimeout(() => {
      setLeaving(true);
      swap = setTimeout(() => {
        setFront((f) => (f + 1) % n);
        setLeaving(false);
      }, EXIT_MS);
    }, STEP_MS);
    return () => {
      clearTimeout(timer);
      clearTimeout(swap);
    };
  }, [front, n, paused, reduceMotion]);

  if (n === 0) return null;

  const placement = (depth) => {
    if (depth === 0) {
      return leaving
        ? { transform: "translate(70px, 26px) scale(1.06) rotate(3deg)", opacity: 0 }
        : { transform: "translate(0px, 0px) scale(1)", opacity: 1 };
    }
    return {
      transform: `translate(${depth * 15}px, ${depth * 11}px) scale(${1 - depth * 0.045})`,
      opacity: depth <= VISIBLE_DEPTH ? 1 - depth * 0.14 : 0,
    };
  };

  return (
    <div
      className="relative w-[250px] h-[160px] shrink-0 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {items.map((item, i) => {
        const depth = (i - front + n) % n;
        const accent = accentFor(item.id);
        const Icon = item.icon;
        const isFront = depth === 0;

        return (
          <button
            key={item.id}
            type="button"
            tabIndex={isFront ? 0 : -1}
            aria-hidden={depth > VISIBLE_DEPTH}
            onClick={() => (isFront ? onSelect?.(item.id) : setFront(i))}
            title={isFront ? `Show ${item.title}` : `Bring ${item.title} forward`}
            style={{
              ...placement(depth),
              zIndex: n - depth,
              transitionDuration: isFront && leaving ? `${EXIT_MS}ms` : "650ms",
              pointerEvents: depth > VISIBLE_DEPTH ? "none" : "auto",
            }}
            className="absolute left-0 top-0 w-[190px] h-[112px] text-left overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1D29] shadow-[0_10px_30px_rgba(20,20,40,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-[transform,opacity] ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer"
          >
            <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: accent }} />
            <span
              className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-xl"
              style={{ background: accent }}
            />
            <div className="relative h-full pl-5 pr-4 py-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] dark:text-white/60 truncate">
                  {item.title}
                </p>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
                  style={{ background: `${accent}22`, color: accent }}
                >
                  <Icon size={15} />
                </span>
              </div>
              <div>
                <p className="text-3xl font-extrabold leading-none tabular-nums text-[#1A1D29] dark:text-white">
                  {item.count}
                </p>
                <p className="text-[10px] mt-1 font-medium text-[#5B5F72] dark:text-white/40">
                  {item.count === 1 ? "card" : "cards"}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
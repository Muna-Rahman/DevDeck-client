"use client";

import React, { useEffect, useState } from "react";
import { accentFor } from "@/components/DeckStack";

/**
 * Proportional bar showing how the saved cards split across categories,
 * with a clickable legend underneath.
 *
 * items: [{ id, title, count }]
 */
export default function CategoryBreakdown({ items, onSelect }) {
  // Bar starts collapsed and grows to its real widths right after mount
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const used = items.filter((item) => item.count > 0);
  const total = used.reduce((sum, item) => sum + item.count, 0);
  const largest = used.reduce((top, item) => (!top || item.count > top.count ? item : top), null);

  return (
    <div className="w-full min-w-0">
      <div className="flex items-baseline justify-between gap-3 mb-2.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] dark:text-white/50">Breakdown</p>
        {largest && (
          <p className="text-[11px] text-[#5B5F72] dark:text-white/40 truncate">
            Most in <span className="font-semibold text-[#1A1D29] dark:text-white/80">{largest.title}</span>
          </p>
        )}
      </div>

      {total === 0 ? (
        <p className="text-xs text-[#5B5F72] dark:text-white/40">Add a card and its category shows up here.</p>
      ) : (
        <>
          <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            {used.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect?.(item.id)}
                title={`${item.title}: ${item.count}`}
                aria-label={`${item.title}: ${item.count} cards`}
                style={{
                  width: grown ? `${(item.count / total) * 100}%` : "0%",
                  background: accentFor(item.id),
                  transitionDelay: `${i * 90}ms`,
                }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-[width,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:brightness-125 cursor-pointer"
              />
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {used.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect?.(item.id)}
                className="group flex items-center gap-1.5 text-xs text-[#5B5F72] dark:text-white/60 hover:text-[#1A1D29] dark:hover:text-white transition-colors cursor-pointer"
              >
                <span className="h-2 w-2 rounded-full transition-transform group-hover:scale-125" style={{ background: accentFor(item.id) }} />
                {item.title}
                <span className="font-bold tabular-nums text-[#1A1D29] dark:text-white">{item.count}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
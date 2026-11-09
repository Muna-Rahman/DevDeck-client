"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

/**
 * Pull-cord lamp theme switch.
 * Lamp ON  = light mode, lamp OFF = dark mode.
 * Pulling the cord stretches it, springs it back, flickers the bulb (when
 * switching on) and sways the whole lamp from its ceiling cord.
 *
 * Props:
 *  - ceiling: length (px) of the cord the lamp hangs from. Default 10.
 *  - className: extra classes for the outer wrapper (positioning).
 */
export default function LampToggle({ ceiling = 10, className = "" }) {
  const { isDark, toggleTheme } = useTheme();
  const [anim, setAnim] = useState({ pulling: false, flicker: false });
  const timer = useRef(null);
  const on = !isDark;

  useEffect(() => () => clearTimeout(timer.current), []);

  const handlePull = () => {
    const turningOn = isDark; // currently dark -> will become light (lamp on)
    clearTimeout(timer.current);
    // restart the CSS animations even on rapid clicks
    setAnim({ pulling: false, flicker: false });
    requestAnimationFrame(() => {
      setAnim({ pulling: true, flicker: turningOn });
      timer.current = setTimeout(() => setAnim({ pulling: false, flicker: false }), 1800);
    });
    toggleTheme();
  };

  const H = ceiling + 70;

  return (
    <div className={`lamp-wrap ${className}`} style={{ width: 56, height: H }}>
      <button
        type="button"
        onClick={handlePull}
        aria-label={on ? "Lamp is on, pull to switch to dark mode" : "Lamp is off, pull to switch to light mode"}
        aria-pressed={on}
        title={on ? "Pull to turn off the light" : "Pull to turn on the light"}
        className={`lamp-toggle ${on ? "lamp-on" : "lamp-off"} ${anim.pulling ? "lamp-pulling" : ""} ${anim.flicker ? "lamp-flicker" : ""}`}
      >
        <svg width="56" height={H} viewBox={`0 0 56 ${H}`} style={{ overflow: "visible" }} aria-hidden="true">
          <defs>
            <linearGradient id="lampCone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFD76A" stopOpacity="0.55" />
              <stop offset="1" stopColor="#FFD76A" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="lampBulb" cx="50%" cy="40%" r="60%">
              <stop offset="0" stopColor="#FFFBE6" />
              <stop offset="1" stopColor="#FFC93C" />
            </radialGradient>
          </defs>

          <g className="lamp-body">
            {/* ceiling cord */}
            <rect x="27.25" y="0" width="1.5" height={ceiling + 2} rx="0.75" className="lamp-line" />

            <g transform={`translate(0 ${ceiling})`}>
              {/* light cone */}
              <polygon className="lamp-cone" points="12,26 44,26 66,92 -10,92" fill="url(#lampCone)" />

              {/* bulb */}
              <circle className="lamp-bulb-glow" cx="28" cy="27" r="11" fill="#FFD76A" />
              <circle className="lamp-bulb" cx="28" cy="27" r="5.5" />

              {/* shade */}
              <path className="lamp-shade" d="M6 22 C6 9 16 1 28 1 C40 1 50 9 50 22 Z" />
              <rect className="lamp-rim" x="4" y="21" width="48" height="3.5" rx="1.75" />

              {/* pull cord + bead */}
              <rect className="lamp-cord" x="39.4" y="24" width="1.2" height="22" rx="0.6" />
              <g className="lamp-bead">
                <ellipse cx="40" cy="50" rx="4" ry="5" className="lamp-bead-shape" />
              </g>
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}
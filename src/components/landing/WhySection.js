// src/components/landing/WhySection.js
import React from "react";
import { Check } from "@gravity-ui/icons";

const coreValues = [
  "Personalized workspace mapping layouts",
  "Powerful multi-parameter search querying indexing",
  "Immersive futuristic aesthetic with responsive depth",
  "Theme customization engines supporting structural shifts",
  "Quick resource management shortcuts",
  "Modern productivity workflow tools mapping environment metrics"
];

export default function WhySection() {
  return (
    <section id="why" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Decorative Mock Environment Grid Pane */}
      <div className="lg:col-span-6 order-2 lg:order-1 relative p-1 rounded-2xl border border-white/08 bg-[#1A1D29]/40 backdrop-blur-[20px] overflow-hidden">
        <div className="grid grid-cols-3 gap-2 p-3 opacity-80 font-mono text-[10px] sm:text-xs">
          <div className="p-4 rounded-xl border border-[#3FE0C5]/20 bg-[#3FE0C5]/05 text-[#3FE0C5] text-center">REPOS</div>
          <div className="p-4 rounded-xl border border-[#E94FD1]/20 bg-[#E94FD1]/05 text-[#E94FD1] text-center">ENDPOINTS</div>
          <div className="p-4 rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/05 text-[#8B5CF6] text-center">NOTES</div>
          <div className="col-span-3 p-4 rounded-xl border border-white/06 bg-white/05 text-[#9CA3B5] text-center tracking-wider">
            GRID_ENGINE_STABLE
          </div>
        </div>
      </div>

      {/* Copy Block */}
      <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#F5F6FA]">
          Why Developers Love DevDeck
        </h2>
        <p className="text-base text-[#9CA3B5] leading-relaxed">
          Engineers waste valuable time sorting through disparate historical contexts to fetch environment details. DevDeck simplifies context switching so your focus remains strictly on execution optimization[cite: 1].
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base font-normal text-[#9CA3B5]">
          {coreValues.map((val, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="mt-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#3FE0C5]/10 border border-[#3FE0C5]/30 text-[#3FE0C5]">
                <Check className="w-3 h-3" />
              </span>
              <span>{val}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
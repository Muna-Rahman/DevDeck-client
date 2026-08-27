// src/components/landing/FeaturesSection.js
import React from "react";
import { 
  ShieldCheck, 
  Layers, 
  Code, 
  FileText, 
  Bookmark, 
  SquarePlus 
} from "@gravity-ui/icons"; // Exclusively Gravity UI

const featuresList = [
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description: "Robust, cookie-backed identity and secure route tokens contextually driven by Better Auth setups.",
    glowColor: "shadow-[0_0_30px_rgba(63,224,197,0.15)]",
    iconColor: "text-[#3FE0C5]"
  },
  {
    icon: Layers,
    title: "Developer Resources",
    description: "Consolidate active target vectors: remote repositories, production dependencies, endpoints, and microservices.",
    glowColor: "shadow-[0_0_30px_rgba(233,79,209,0.15)]",
    iconColor: "text-[#E94FD1]"
  },
  {
    icon: Code,
    title: "Code Snippets",
    description: "Store operational code constructs locally alongside syntax highlight maps to quickly drop structures anywhere.",
    glowColor: "shadow-[0_0_30px_rgba(139,92,246,0.15)]",
    iconColor: "text-[#8B5CF6]"
  },
  {
    icon: FileText,
    title: "Markdown Notes",
    description: "Keep technical guidelines, project execution runbooks, structural specs, and architectural decisions updated.",
    glowColor: "shadow-[0_0_30px_rgba(255,184,77,0.15)]",
    iconColor: "text-[#FFB84D]"
  },
  {
    icon: Bookmark,
    title: "Bookmarks",
    description: "Elevate critical developer dependencies, continuous integrations, and cloud consoles for instant execution access[cite: 1].",
    glowColor: "shadow-[0_0_30px_rgba(47,209,255,0.15)]",
    iconColor: "text-[#2FD1FF]"
  },
  {
    icon: SquarePlus,
    title: "Drag & Drop Organization",
    description: "Re-arrange project boards through a draggable glass grid interface with smooth transition physics[cite: 1].",
    glowColor: "shadow-[0_0_30px_rgba(233,79,209,0.15)]",
    iconColor: "text-[#FF6FB5]"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#F5F6FA]">
          Everything a Developer Needs
        </h2>
        <p className="text-base text-[#9CA3B5] max-w-2xl mx-auto">
          Ditch scattered documentation solutions. Manage all engineering components contextually from a unified space[cite: 1].
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {featuresList.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div 
              key={idx} 
              className={`p-6 sm:p-8 rounded-2xl border border-white/08 bg-[#1A1D29]/60 backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1A1D29]/80 group ${item.glowColor}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-white/05 border border-white/08 flex items-center justify-center mb-6 ${item.iconColor} transition-transform duration-300 group-hover:scale-105`}>
                <IconComp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-[#F5F6FA] mb-2">{item.title}</h3>
              <p className="text-sm text-[#9CA3B5] font-normal leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
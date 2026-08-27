// src/components/landing/AboutSection.js
import React from "react";

const stackTokens = ["Next.js", "Node.js", "Express", "MongoDB", "Better Auth", "Tailwind CSS", "HeroUI"];

export default function AboutSection() {
  return (
    <section id="about" className="p-8 sm:p-12 rounded-2xl border border-white/08 bg-[#1A1D29]/60 backdrop-blur-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-3xl space-y-6 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F5F6FA]">
          Built For The Modern Technical Workflow
        </h2>
        <p className="text-sm sm:text-base text-[#9CA3B5] leading-relaxed font-normal">
          DevDeck is a personalized developer workspace built to help programmers organize everything related to their workflow in one place. Instead of keeping repositories, APIs, notes, snippets, and ideas scattered across multiple applications, DevDeck brings everything together inside a beautiful and organized dashboard[cite: 1].
        </p>
        
        <div className="pt-4 space-y-3">
          <h4 className="text-xs uppercase font-mono tracking-widest text-[#F5F6FA]">Engine Architecture Stack</h4>
          <div className="flex flex-wrap gap-2">
            {stackTokens.map((tech, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 text-xs rounded-full font-mono font-medium border border-white/06 bg-white/05 text-[#F5F6FA]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
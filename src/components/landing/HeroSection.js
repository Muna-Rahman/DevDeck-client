// src/components/landing/HeroSection.js
import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { CheckIcon } from "@gravity-ui/icons";

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center md:py-12">
      {/* Narrative & Value Props */}
      <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-[#F5F6FA]">
          Organize Every <br />
          <span className="bg-gradient-to-r from-[#E94FD1] via-[#B084F5] to-[#2FD1FF] bg-clip-text text-transparent">
            Developer Resource
          </span> <br />
          in One Beautiful Workspace.
        </h1>
        <p className="text-base sm:text-lg text-[#9CA3B5] max-w-xl font-normal leading-relaxed">
          Stop burying vital infrastructure in browser tags. DevDeck lets you catalog GitHub repositories, live endpoints, snippets, reactive documentation, and internal architecture roadmaps within modular glass dashboards.
        </p>

        {/* Immediate Access Buttons */}
        <div className="flex flex-wrap gap-4 pt-2">
          <Button 
            as={Link} 
            href="/register" 
            className="h-12 px-8 bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white rounded-full text-base font-medium shadow-[0_0_25px_rgba(233,79,209,0.35)] hover:shadow-[0_0_35px_rgba(233,79,209,0.55)] hover:scale-[1.02] transition-all duration-200"
          >
            Get Started
          </Button>
          <Button 
            as={Link} 
            href="/login" 
            className="h-12 px-8 text-[#F5F6FA] border border-white/08 bg-white/05 hover:bg-white/10 rounded-full text-base font-medium transition-all duration-200"
          >
            Sign In
          </Button>
        </div>

        {/* Validation Stack Indicators */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-6 text-xs sm:text-sm font-medium text-[#9CA3B5]">
          <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-[#3FE0C5]" /> Better Auth Secure</span>
          <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-[#8B5CF6]" /> MongoDB Powered</span>
          <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-[#E94FD1]" /> Drag & Drop Layout</span>
          <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-[#FFB84D]" /> Glassmorphism UI</span>
        </div>
      </div>

      {/* Interactive Mockup Container */}
      <div className="lg:col-span-5 relative w-full h-[380px] sm:h-[450px] flex items-center justify-center animate-float">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3FE0C5]/10 to-[#E94FD1]/10 rounded-3xl blur-2xl" />
        {/* Layered Floating Control Desk Simulation Frame */}
        <div className="relative w-full max-w-[420px] p-6 rounded-2xl border border-white/08 bg-[#1A1D29]/60 backdrop-blur-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/06 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-[#9CA3B5] font-mono tracking-widest">WORKSPACE_HUD</span>
          </div>
          {/* Mock Floating Content Cards */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/05 border border-white/08 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#3FE0C5]/20 flex items-center justify-center text-[#3FE0C5] text-xs font-bold">API</div>
                <span className="text-xs font-medium font-mono text-[#F5F6FA]">/v1/auth/session</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#3FE0C5]/20 text-[#3FE0C5]">200 OK</span>
            </div>
            <div className="p-3 rounded-xl bg-white/05 border border-white/08 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#9CA3B5]">
                <span>Component Deployment</span>
                <span className="text-[#FF6FB5]">84%</span>
              </div>
              <div className="w-full h-1.5 bg-white/05 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] rounded-full" style={{ width: '84%' }} />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/05 border border-white/08 font-mono text-[11px] text-[#9CA3B5] overflow-hidden whitespace-nowrap text-ellipsis">
              <span className="text-[#8B5CF6]">const</span> devdeck = <span className="text-[#3FE0C5]">new</span> Workspace();
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
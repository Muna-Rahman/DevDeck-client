'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { ShieldCheck, Database, LayoutCellsLarge, Layers } from '@gravity-ui/icons';

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center xl:gap-24 pt-8 md:pt-16">
      
      {/* Left Pitch Deck Content */}
      <div className="space-y-8 text-left max-w-2xl mx-auto lg:mx-0">
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-medium tracking-tight text-[#F5F6FA] leading-[1.15]">
          Organize Every Developer Resource in <span className="bg-gradient-to-r from-[#E94FD1] via-[#B084F5] to-[#2FD1FF] bg-clip-text text-transparent">One Workspace</span>.
        </h1>
        
        <p className="text-base md:text-lg font-normal text-[#9CA3B5] leading-relaxed">
          Stop scattering your ecosystem across endless tabs and tools. DevDeck brings your GitHub repositories, production APIs, dynamic code snippets, technical notes, crucial links, and architecture concepts into a beautifully unified, glassmorphism workspace dashboard.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/register">
            <Button 
              size="lg"
              className="rounded-full px-8 text-base font-normal bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white shadow-[0_4px_25px_rgba(233,79,209,0.35)] hover:shadow-[0_4px_30px_rgba(233,79,209,0.55)] hover:scale-[1.02] transition-all duration-300"
            >
              Get Started
            </Button>
          </Link>
          
          <Link href="/login">
            <Button 
              size="lg"
              variant="bordered"
              className="rounded-full px-8 text-base font-normal text-[#F5F6FA] border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Feature Check Pillars */}
        <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-y-4 gap-x-6 sm:flex sm:items-center sm:gap-8 text-xs text-[#9CA3B5]">
          <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#E94FD1]" /> Better Auth Powered</span>
          <span className="flex items-center gap-2"><Database className="w-4 h-4 text-[#3FE0C5]" /> MongoDB Architecture</span>
          <span className="flex items-center gap-2"><LayoutCellsLarge className="w-4 h-4 text-[#8B5CF6]" /> Fluid Drag & Drop</span>
          <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-[#FFB84D]" /> Advanced Glass UI</span>
        </div>
      </div>

      {/* Right Side Immersive HUD Illustration */}
      <div className="relative flex items-center justify-center lg:justify-end select-none w-full max-w-[580px] lg:max-w-none mx-auto animate-float">
        <div className="relative w-full aspect-[4/3] rounded-2xl border border-white/5 backdrop-filter backdrop-blur-[10px] bg-[rgba(26,29,41,0.4)] shadow-2xl overflow-hidden p-6 flex flex-col gap-4">
          
          {/* Mock Dashboard Floating Layers */}
          <div className="w-full flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-white/10" />
              <span className="w-3 h-3 rounded-full bg-white/10" />
              <span className="w-3 h-3 rounded-full bg-white/10" />
            </div>
            <div className="w-1/3 h-5 rounded-full bg-white/5 border border-white/5" />
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            {/* Mock Glass Cards */}
            <div className="rounded-2xl border border-[#E94FD1]/20 bg-[rgba(26,29,41,0.6)] p-4 shadow-[0_0_20px_rgba(233,79,209,0.05)] transform -translate-y-2 translate-x-1 transition-transform duration-500">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E94FD1] to-[#FF6FB5] opacity-80 mb-3" />
              <div className="w-3/4 h-4 rounded bg-white/10 mb-2" />
              <div className="w-1/2 h-3 rounded bg-white/5" />
            </div>

            <div className="rounded-2xl border border-[#3FE0C5]/20 bg-[rgba(26,29,41,0.6)] p-4 shadow-[0_0_20px_rgba(63,224,197,0.05)] transform translate-y-3 -translate-x-1 transition-transform duration-500">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3FE0C5] to-[#2FD1FF] opacity-80 mb-3" />
              <div className="w-full h-4 rounded bg-white/10 mb-2" />
              <div className="w-2/3 h-3 rounded bg-white/5" />
            </div>
          </div>
          
          {/* Background Ambient Aura for the illustration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#8B5CF6] opacity-20 blur-[80px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
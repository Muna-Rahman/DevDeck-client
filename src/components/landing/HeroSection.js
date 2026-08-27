'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { ShieldCheck, Database, LayoutCellsLarge, Layers } from '@gravity-ui/icons';

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center xl:gap-24 pt-8 md:pt-16">
      
      {/* Pitch Info */}
      <div className="space-y-8 text-left max-w-2xl mx-auto lg:mx-0">
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-medium tracking-tight text-[#F5F6FA] leading-[1.15]">
          Organize Every Developer Resource in <span className="bg-gradient-to-r from-[#E94FD1] via-[#B084F5] to-[#2FD1FF] bg-clip-text text-transparent">One Workspace</span>.
        </h1>
        <p className="text-base md:text-lg text-[#9CA3B5] leading-relaxed">
          Stop scattering your ecosystem across endless tabs. DevDeck brings your GitHub repositories, production APIs, dynamic code snippets, and architecture concepts into a beautifully unified workspace dashboard.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/register">
            <Button size="lg" className="rounded-full px-8 bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white shadow-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="bordered" className="rounded-full px-8 text-[#F5F6FA] border-white/10 hover:bg-white/5">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4 text-xs text-[#9CA3B5]">
          <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#E94FD1]" /> Better Auth Powered</span>
          <span className="flex items-center gap-2"><Database className="w-4 h-4 text-[#3FE0C5]" /> MongoDB Architecture</span>
        </div>
      </div>

      {/* Presentation Graphic Layout */}
      <div className="relative flex items-center justify-center select-none w-full max-w-[580px] mx-auto">
        <div className="relative w-full aspect-[4/3] rounded-2xl border border-white/5 bg-[rgba(26,29,41,0.4)] backdrop-blur-md p-6 flex flex-col gap-4 shadow-2xl">
          <div className="w-full flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-white/10" />
              <span className="w-3 h-3 rounded-full bg-white/10" />
            </div>
            <div className="w-1/3 h-5 rounded-full bg-white/5 border border-white/5" />
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="rounded-2xl border border-[#E94FD1]/20 bg-[rgba(26,29,41,0.6)] p-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E94FD1] to-[#FF6FB5] mb-3" />
              <div className="w-3/4 h-4 rounded bg-white/10" />
            </div>
            <div className="rounded-2xl border border-[#3FE0C5]/20 bg-[rgba(26,29,41,0.6)] p-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3FE0C5] to-[#2FD1FF] mb-3" />
              <div className="w-full h-4 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
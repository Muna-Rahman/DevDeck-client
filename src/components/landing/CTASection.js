'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';

export default function CTASection() {
  return (
    <section className="relative w-full max-w-5xl mx-auto">
      {/* Glowing Neon Shadow backing card */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#E94FD1] via-[#8B5CF6] to-[#2FD1FF] opacity-10 blur-[80px] rounded-[32px] pointer-events-none" />
      
      <div className="relative backdrop-filter backdrop-blur-[20px] bg-[rgba(26,29,41,0.75)] border border-white/5 rounded-[32px] p-8 md:p-16 text-center space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-[#F5F6FA] leading-[1.2]">
            Ready to Organize Your Development Workflow?
          </h2>
          <p className="text-base text-[#9CA3B5] font-normal leading-relaxedmax-w-xl mx-auto">
            Deploy your personalized command hub layout today. Move faster, minimize context strain, and maximize project visibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/register">
            <Button 
              size="lg"
              className="rounded-full px-8 text-sm font-normal bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white shadow-[0_4px_20px_rgba(233,79,209,0.4)] hover:shadow-[0_4px_30px_rgba(233,79,209,0.6)] hover:scale-[1.02] transition-all duration-300"
            >
              Register Workspace
            </Button>
          </Link>
          
          <Link href="/login">
            <Button 
              size="lg"
              variant="light"
              className="rounded-full px-8 text-sm font-normal border border-white/5 bg-white/5 text-[#F5F6FA] hover:bg-white/10 transition-all duration-300"
            >
              Access Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
'use client';
import React from 'react';
import Link from 'next/link';
import { LogoGithub, LogoLinkedin, Envelope } from '@gravity-ui/icons';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[rgba(11,14,20,0.8)] backdrop-blur-md mt-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Pitch Statement */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#E94FD1] to-[#FF6FB5] flex items-center justify-center">
              <span className="text-white font-medium text-xs">D</span>
            </div>
            <span className="text-lg font-medium tracking-tight text-[#F5F6FA]">DevDeck</span>
          </div>
          <p className="text-xs text-[#9CA3B5] font-normal leading-relaxed max-w-sm">
            The personalized developer workspace engineered to host components, environments, and resources elegantly inside immersive pipelines.
          </p>
        </div>

        {/* Index Pathways */}
        <div className="flex flex-col gap-2 md:items-center">
          <div className="space-y-2 text-left">
            <h4 className="text-xs uppercase font-medium tracking-widest text-[#8B5CF6] mb-2">Navigations</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
              <a href="#" className="text-[#9CA3B5] hover:text-[#F5F6FA] transition-colors">Home</a>
              <a href="#features" className="text-[#9CA3B5] hover:text-[#F5F6FA] transition-colors">Features</a>
              <a href="#about" className="text-[#9CA3B5] hover:text-[#F5F6FA] transition-colors">About</a>
              <Link href="/login" className="text-[#9CA3B5] hover:text-[#F5F6FA] transition-colors">Login</Link>
              <Link href="/register" className="text-[#9CA3B5] hover:text-[#F5F6FA] transition-colors">Register</Link>
            </div>
          </div>
        </div>

        {/* Social Comms Links */}
        <div className="space-y-4 md:text-right md:flex md:flex-col md:items-end">
          <div>
            <h4 className="text-xs uppercase font-medium tracking-widest text-[#8B5CF6] mb-3">Community Hub</h4>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-[#9CA3B5] hover:text-[#E94FD1] transition-colors">
                <LogoGithub className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-[#9CA3B5] hover:text-[#3FE0C5] transition-colors">
                <LogoLinkedin className="w-5 h-5" />
              </a>
              <a href="mailto:hello@devdeck.io" className="text-[#9CA3B5] hover:text-[#FFB84D] transition-colors">
                <Envelope className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Line */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-white/5 flex items-center justify-between text-[11px] font-mono tracking-tight text-[#5B5F72]">
        <span>&copy; 2026 DevDeck. Built for developers.</span>
        <span>Environment Root v1.0.0</span>
      </div>
    </footer>
  );
}
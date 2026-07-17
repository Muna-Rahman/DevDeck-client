// src/components/landing/Footer.js
import React from "react";
import Link from "next/link";
import { LogoGithub, LogoLinkedin, LogoTwitter, Envelope } from "@gravity-ui/icons"; // Verified Gravity UI Icons

export default function Footer() {
  return (
    <footer className="border-t border-white/06 bg-[#12141C]/60 backdrop-blur-[20px] mt-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Info Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#E94FD1] to-[#FF6FB5]" />
            <span className="font-medium text-base tracking-wide text-[#F5F6FA]">DevDeck</span>
          </div>
          <p className="text-xs sm:text-sm text-[#9CA3B5] max-w-xs leading-relaxed font-normal">
            A comprehensive unified management dashboard built for developers to isolate workspace information streams safely[cite: 1].
          </p>
        </div>

        {/* Navigation Quick Links Column */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs uppercase font-mono tracking-widest text-[#F5F6FA]">Quick Links</h4>
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-[#9CA3B5]">
            <a href="#" className="hover:text-[#F5F6FA] transition-colors">Home</a>
            <a href="#features" className="hover:text-[#F5F6FA] transition-colors">Features</a>
            <a href="#why" className="hover:text-[#F5F6FA] transition-colors">Why DevDeck</a>
            <a href="#about" className="hover:text-[#F5F6FA] transition-colors">About</a>
            <Link href="/login" className="hover:text-[#F5F6FA] transition-colors">Login</Link>
            <Link href="/register" className="hover:text-[#F5F6FA] transition-colors">Register</Link>
          </div>
        </div>

        {/* Social Integration Column */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs uppercase font-mono tracking-widest text-[#F5F6FA]">Connect</h4>
          <div className="flex items-center gap-4 text-[#9CA3B5]">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#E94FD1] transition-colors" aria-label="GitHub"><LogoGithub className="w-5 h-5" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#3FE0C5] transition-colors" aria-label="LinkedIn"><LogoLinkedin className="w-5 h-5" /></a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[#2FD1FF] transition-colors" aria-label="X (Twitter)"><LogoTwitter className="w-5 h-5" /></a>
            <a href="mailto:support@devdeck.io" className="hover:text-[#8B5CF6] transition-colors" aria-label="Email"><Envelope className="w-5 h-5" /></a>
          </div>
        </div>
      </div>

      {/* Under-Footer Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-white/06 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-[#9CA3B5]">
        <span>&copy; 2026 DevDeck. Built for developers.</span>
        <span className="text-white/20">v1.0.0 Stable Deployment</span>
      </div>
    </footer>
  );
}
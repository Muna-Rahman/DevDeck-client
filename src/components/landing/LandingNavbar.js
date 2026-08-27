'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { Bars, Xmark } from '@gravity-ui/icons';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 max-w-[1440px] mx-auto select-none">
      {/* ULTRA-FROSTED HIGH REFRACTION CONTAINER */}
      <div className="backdrop-blur-2xl bg-white/40 dark:bg-black/40 border border-white/40 dark:border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group active:scale-95 transition-transform">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E94FD1] to-[#FF6FB5] flex items-center justify-center shadow-[0_0_15px_rgba(233,79,209,0.3)] group-hover:shadow-[0_0_20px_rgba(233,79,209,0.5)] transition-all">
            <span className="text-white font-black text-lg">D</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A1D29] dark:text-[#F5F6FA] drop-shadow-sm">
            DevDeck
          </span>
        </Link>

        {/* Navigation Pathways */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-xs font-bold uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-[#F5F6FA] transition-all duration-200 transform hover:-translate-y-0.5">
            Features
          </a>
          {/* Linked explicitly to the #why section target ID */}
          <a href="#why" className="text-xs font-bold uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-[#F5F6FA] transition-all duration-200 transform hover:-translate-y-0.5">
            Benefits
          </a>
          <a href="#about" className="text-xs font-bold uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-[#F5F6FA] transition-all duration-200 transform hover:-translate-y-0.5">
            About
          </a>
        </div>

        {/* REWORKED HIGH-INTERACTIVE ACTION BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button 
              variant="light" 
              className="rounded-full text-xs font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#1A1D29] dark:text-[#F5F6FA] px-6 h-9 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md"
            >
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button 
              className="rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white px-6 h-9 shadow-[0_4px_15px_rgba(233,79,209,0.25)] hover:shadow-[0_4px_20px_rgba(233,79,209,0.45)] transition-all duration-300 hover:scale-105 hover:brightness-105 active:scale-95 text-center"
            >
              Register
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle Trigger */}
        <button 
          className="md:hidden text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-[#F5F6FA] transition-colors cursor-pointer" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <Xmark className="w-6 h-6" /> : <Bars className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Glass Dropdown System */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 backdrop-blur-2xl bg-white/90 dark:bg-[rgba(11,13,19,0.95)] border border-white/40 dark:border-white/10 rounded-3xl p-6 flex flex-col gap-4 md:hidden shadow-2xl animate-fade-in">
          <a href="#features" onClick={() => setIsOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-white">Features</a>
          <a href="#why" onClick={() => setIsOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-white">Benefits</a>
          <a href="#about" onClick={() => setIsOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-white">About</a>
          <hr className="border-black/5 dark:border-white/5" />
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 text-[#1A1D29] dark:text-[#F5F6FA] text-xs font-bold uppercase tracking-wider h-10">Login</Button>
          </Link>
          <Link href="/register" onClick={() => setIsOpen(false)}>
            <Button className="w-full rounded-xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white text-xs font-bold uppercase tracking-wider h-10 shadow-lg">Register</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
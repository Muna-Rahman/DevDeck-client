// src/components/landing/LandingNavbar.js
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Bars3Icon, XMarkIcon } from "@gravity-ui/icons"; 

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <nav className="mx-auto flex items-center justify-between px-6 py-3 rounded-full border border-white/08 bg-[#1A1D29]/70 backdrop-blur-[20px] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300">
        {/* Brand Logo Container */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E94FD1] to-[#FF6FB5] flex items-center justify-center shadow-[0_0_15px_rgba(233,79,209,0.4)] transition-transform duration-300 group-hover:scale-105">
            <span className="text-white font-bold text-lg select-none">D</span>
          </div>
          <span className="font-medium text-lg tracking-wide bg-gradient-to-r from-[#F5F6FA] to-[#9CA3B5] bg-clip-text text-transparent">
            DevDeck
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9CA3B5]">
          <a href="#features" className="hover:text-[#F5F6FA] transition-colors duration-200">Features</a>
          <a href="#why" className="hover:text-[#F5F6FA] transition-colors duration-200">Why DevDeck</a>
          <a href="#about" className="hover:text-[#F5F6FA] transition-colors duration-200">About</a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button 
            as={Link} 
            href="/login" 
            variant="light" 
            className="text-[#F5F6FA] border border-white/08 bg-white/05 hover:bg-white/10 rounded-full text-sm font-medium transition-all duration-200"
          >
            Login
          </Button>
          <Button 
            as={Link} 
            href="/register" 
            className="bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white rounded-full text-sm font-medium px-6 shadow-[0_0_20px_rgba(233,79,209,0.3)] hover:shadow-[0_0_25px_rgba(233,79,209,0.5)] transition-all duration-200 hover:scale-[1.02]"
          >
            Register
          </Button>
        </div>

        {/* Mobile Toggle Button */}
        <button className="md:hidden text-[#F5F6FA]" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden mt-2 p-6 rounded-2xl border border-white/08 bg-[#1A1D29]/95 backdrop-blur-[20px] flex flex-col gap-4 animate-fadeIn">
          <a href="#features" onClick={() => setIsOpen(false)} className="text-[#9CA3B5] hover:text-[#F5F6FA] text-base font-medium py-1">Features</a>
          <a href="#why" onClick={() => setIsOpen(false)} className="text-[#9CA3B5] hover:text-[#F5F6FA] text-base font-medium py-1">Why DevDeck</a>
          <a href="#about" onClick={() => setIsOpen(false)} className="text-[#9CA3B5] hover:text-[#F5F6FA] text-base font-medium py-1">About</a>
          <hr className="border-white/06 my-1" />
          <Button as={Link} href="/login" className="w-full text-[#F5F6FA] bg-white/05 border border-white/08 rounded-full">Login</Button>
          <Button as={Link} href="/register" className="w-full bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white rounded-full">Register</Button>
        </div>
      )}
    </header>
  );
}
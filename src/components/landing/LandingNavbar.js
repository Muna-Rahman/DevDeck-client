'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { Bars, Xmark } from '@gravity-ui/icons';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 max-w-[1440px] mx-auto">
      {/* Glass Pill Container */}
      <div className="backdrop-filter backdrop-blur-[20px] bg-[rgba(26,29,41,0.7)] border border-white/5 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:border-white/10">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E94FD1] to-[#FF6FB5] flex items-center justify-center shadow-[0_0_15px_rgba(233,79,209,0.4)] transition-transform duration-300 group-hover:scale-105">
            <span className="text-white font-medium text-lg">D</span>
          </div>
          <span className="text-xl font-medium tracking-tight bg-gradient-to-r from-[#F5F6FA] to-[#9CA3B5] bg-clip-text text-transparent">
            DevDeck
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-normal text-[#9CA3B5] hover:text-[#F5F6FA] transition-colors duration-200">Features</a>
          <a href="#why" className="text-sm font-normal text-[#9CA3B5] hover:text-[#F5F6FA] transition-colors duration-200">Benefits</a>
          <a href="#about" className="text-sm font-normal text-[#9CA3B5] hover:text-[#F5F6FA] transition-colors duration-200">About</a>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button 
              variant="light" 
              className="rounded-full text-sm font-normal border border-white/5 bg-white/5 text-[#F5F6FA] backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              Login
            </Button>
          </Link>
          
          <Link href="/register">
            <Button 
              className="rounded-full text-sm font-normal bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white shadow-[0_4px_20px_rgba(233,79,209,0.3)] hover:shadow-[0_4px_25px_rgba(233,79,209,0.5)] hover:scale-[1.02] transition-all duration-300"
            >
              Register
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-[#9CA3B5] hover:text-[#F5F6FA] transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <Xmark className="w-6 h-6" /> : <Bars className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Glass Rail Dropdown */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 backdrop-filter backdrop-blur-[20px] bg-[rgba(26,29,41,0.95)] border border-white/5 rounded-3xl p-6 flex flex-col gap-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <a href="#features" onClick={() => setIsOpen(false)} className="text-base text-[#9CA3B5] hover:text-[#F5F6FA] py-2">Features</a>
          <a href="#why" onClick={() => setIsOpen(false)} className="text-base text-[#9CA3B5] hover:text-[#F5F6FA] py-2">Benefits</a>
          <a href="#about" onClick={() => setIsOpen(false)} className="text-base text-[#9CA3B5] hover:text-[#F5F6FA] py-2">About</a>
          <hr className="border-white/5 my-2" />
          <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
            <Button className="rounded-full border border-white/10 bg-white/5 text-[#F5F6FA] w-full">
              Login
            </Button>
          </Link>
          <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
            <Button className="rounded-full bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white w-full">
              Register
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
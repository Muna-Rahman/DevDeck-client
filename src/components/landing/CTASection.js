// src/components/landing/CTASection.js
import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function CTASection() {
  return (
    <section className="relative rounded-2xl border border-white/08 bg-[#1A1D29]/60 backdrop-blur-[20px] p-8 sm:p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Intense Glowing Core Accent Blobs */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-r from-[#E94FD1] to-[#8B5CF6] opacity-20 blur-[80px] pointer-events-none" />
      
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#F5F6FA]">
          Ready to Organize Your Development Workflow?
        </h2>
        <p className="text-sm sm:text-base text-[#9CA3B5] max-w-lg mx-auto font-normal">
          Spin up your local developer deck index dashboard container instantly. Secure authorization setups protect configurations[cite: 1].
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button 
            as={Link} 
            href="/register" 
            className="h-12 px-8 bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white rounded-full text-base font-medium shadow-[0_0_25px_rgba(233,79,209,0.35)] hover:shadow-[0_0_35px_rgba(233,79,209,0.55)] transition-all duration-200 hover:scale-[1.02]"
          >
            Register Now
          </Button>
          <Button 
            as={Link} 
            href="/login" 
            className="h-12 px-8 text-[#F5F6FA] border border-white/08 bg-white/05 hover:bg-white/10 rounded-full text-base font-medium transition-all duration-200"
          >
            Login
          </Button>
        </div>
      </div>
    </section>
  );
}
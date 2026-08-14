"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const { isDark: darkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#FAF9F6] dark:bg-[#07090E] text-[#1A1D29] dark:text-[#F5F6FA] overflow-x-hidden font-sans antialiased selection:bg-[#E94FD1]/30 selection:text-[#FF6FB5]">
      
      {/* BACKGROUND GRAPHIC CANVASES */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Light Mode Specific Artwork Layer */}
        {!darkMode && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed animate-fade-in"
            style={{ backgroundImage: `url('https://i.pinimg.com/736x/19/6c/8e/196c8e1b5682ea37d9c42ca85fec4b14.jpg')` }}
          >
            <div className="absolute inset-0 bg-white/20" />
          </div>
        )}

        {/* Dark Mode Specific Artwork Layer */}
        {darkMode && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed animate-fade-in"
            style={{ backgroundImage: `url('https://i.pinimg.com/1200x/f2/64/d5/f264d5349c9e0ee907ba65172c63e54d.jpg')` }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute top-[5%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#E94FD1] opacity-[0.25] blur-[180px]" />
            <div className="absolute bottom-[20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-[#3FE0C5] opacity-[0.18] blur-[220px]" />
          </div>
        )}
      </div>

      {/* Floating Theme Switcher Option */}
      {mounted && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={toggleTheme}
            aria-label="Toggle layout theme look"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#12141C]/85 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-white cursor-pointer"
          >
            {darkMode ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
          </button>
        </div>
      )}

      {/* Top Fixed Header Navbar */}
      <LandingNavbar />
      
      {/* MAIN LAYOUT CANVAS FLOW */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 relative z-10 flex flex-col justify-start space-y-20">
        
        {/* ROW 1: HERO VIEW */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 rounded-3xl border border-black/5 dark:border-white/10 bg-white/85 dark:bg-black/40 backdrop-blur-2xl p-8 md:p-12 flex flex-col justify-center shadow-xl dark:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#E94FD1] to-[#8B5CF6]" />
            <div className="space-y-6 max-w-xl">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#E94FD1] bg-[#E94FD1]/10 px-3 py-1 rounded-full">
                ✦ Built for modern developers
              </span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none text-[#1A1D29] dark:text-white">
                Your workspace.<br/>
                Perfected.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E94FD1] via-[#B55FE6] to-[#3FE0C5]">Streamlined.</span>
              </h1>
              <p className="text-sm font-medium text-[#5B5F72] dark:text-[#9CA3B5] leading-relaxed">
                Stop bouncing between tabs to manage your code. DevDeck brings your GitHub repositories, snippets, project links, and daily notes together into one beautiful, unified workspace.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Link href="/register" className="h-11 px-8 rounded-xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white text-xs font-bold uppercase tracking-widest shadow-xl hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center">
                  Get Started Free →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Interactive Mockup */}
          <div className="lg:col-span-5 rounded-3xl border border-black/5 dark:border-white/10 bg-white/85 dark:bg-black/60 backdrop-blur-2xl p-8 flex flex-col justify-between shadow-xl dark:shadow-2xl relative overflow-hidden min-h-[350px]">
            <div className="absolute -inset-px bg-gradient-to-br from-[#E94FD1]/10 via-transparent to-[#3FE0C5]/10 pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <div className="w-2 h-2 rounded-full bg-[#0FB8A6] dark:bg-[#3FE0C5] animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-[#5B5F72] dark:text-white/40 tracking-widest uppercase">Platform Status</span>
            </div>

            <div className="flex-1 flex items-center justify-center my-4">
              <div className="relative w-40 h-40 rounded-full border border-dashed border-[#E94FD1]/30 flex items-center justify-center animate-spin [animation-duration:25s]">
                <div className="w-32 h-32 rounded-full border border-double border-[#3FE0C5]/20 flex items-center justify-center" />
                <div className="absolute top-0 left-1/2 -ml-1 w-2 h-2 rounded-full bg-[#E94FD1] shadow-[0_0_8px_#E94FD1]" />
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-[#3FE0C5] shadow-[0_0_8px_#3FE0C5]" />
              </div>
              <div className="absolute text-center">
                <span className="text-sm font-bold font-mono tracking-wider text-[#1A1D29] dark:text-white/80">READY</span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-[#5B5F72] dark:text-white/50">
              <span>WORKFLOW SYNC</span>
              <span className="text-[#0FB8A6] dark:text-[#3FE0C5] font-bold">100% ONLINE</span>
            </div>
          </div>
        </section>

        {/* ROW 2: FEATURES SECTION */}
        <section id="features" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-[#E94FD1] uppercase">Capabilities</span>
            <h2 className="text-2xl font-black uppercase text-[#1A1D29] dark:text-white">Built for the way you work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Secure Accounts", desc: "Keep your workspace private with premium, cookie-based authentication built directly into safe network layers.", color: "from-[#3FE0C5]" },
              { title: "Developer Dashboard", desc: "Keep track of active staging links, project credentials, configurations, and quick resources in one clean panel.", color: "from-[#2FD1FF]" },
              { title: "Code Snippet Manager", desc: "Save your most used code structures, boilerplate layouts, and handy utilities inside a responsive, beautiful board.", color: "from-[#E94FD1]" }
            ].map((feat, i) => (
              <div key={i} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/85 dark:bg-black/40 backdrop-blur-xl p-6 shadow-lg dark:shadow-xl relative group transition-all duration-300 hover:-translate-y-1 hover:border-black/10 dark:hover:border-white/20">
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feat.color} to-transparent rounded-t-2xl`} />
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#1A1D29] dark:text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ROW 3: WHY DEVDECK SECTION */}
        <section id="why" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-[#3FE0C5] uppercase">Philosophy</span>
            <h2 className="text-2xl font-black uppercase text-[#1A1D29] dark:text-white">Why DevDeck?</h2>
          </div>
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/85 dark:bg-black/40 backdrop-blur-xl p-8 shadow-lg dark:shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#3FE0C5]/10 to-transparent pointer-events-none" />
            <div className="max-w-3xl space-y-4">
              <h3 className="text-base font-bold text-[#1A1D29] dark:text-white uppercase tracking-wide">A tailor-made dashboard for your ideas</h3>
              <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5] leading-relaxed">
                DevDeck was created to eliminate tabs clutter and mental overhead. Instead of leaving important repos, API keys, snippet ideas, and design links scattered across browser bookmarks or random text files, DevDeck aggregates everything into a premium, interactive glass command board. It's your entire coding setup, elegantly organized.
              </p>
            </div>
          </div>
        </section>

        {/* ROW 4: ABOUT DECK STACK */}
        <section id="about" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-[#8B5CF6] uppercase">Tech Stack</span>
            <h2 className="text-2xl font-black uppercase text-[#1A1D29] dark:text-white">Modern Tech Stack</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/85 dark:bg-black/40 backdrop-blur-xl p-6 shadow-lg dark:shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1A1D29] dark:text-white">Markdown Notes & Dynamic Pins</h3>
              <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5] leading-relaxed">
                Write complete project wikis, deployment logs, or system rules directly in crisp markdown syntax. Pin important links and reference modules alongside your codebase tabs for rapid workflow context switches.
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/85 dark:bg-black/40 backdrop-blur-xl p-6 shadow-lg dark:shadow-xl space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#5B5F72] dark:text-white/70 font-mono">// core_stack</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {["Next.js", "Node.js", "Express", "MongoDB", "Better Auth", "Tailwind CSS"].map((tech, idx) => (
                  <span key={idx} className="text-[10px] font-mono font-bold px-3 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[#0FB8A6] dark:text-[#3FE0C5]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ROW 5: INTERACTIVE FOOTER CTA */}
        <section className="w-full max-w-4xl mx-auto pt-4">
          <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-gradient-to-br from-white/95 to-white/85 dark:from-black/80 dark:to-[#11141D]/90 backdrop-blur-3xl p-8 md:p-12 text-center shadow-xl dark:shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E94FD1] via-[#3FE0C5] to-[#8B5CF6]" />
            <h2 className="text-2xl font-black uppercase tracking-wider text-[#1A1D29] dark:text-white">Ready to organize your workflow?</h2>
            <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5] mt-2 max-w-md mx-auto leading-relaxed">
              Join developers who are tracking their projects, snippets, and repositories all in one place.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/register" className="h-11 px-8 rounded-xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white text-xs font-bold uppercase tracking-widest shadow-xl hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center">
                Create Your Free Workspace
              </Link>
            </div>
          </div>
        </section>

      </div>

      {/* Pinned Full-Width Footer Element */}
      <Footer />
    </div>
  );
}
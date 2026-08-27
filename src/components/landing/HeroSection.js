'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Intro Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-base-content/10 bg-base-200/60 backdrop-blur-md mb-8 text-xs sm:text-sm font-medium">
          <span className="text-primary font-semibold">✨ DevDeck</span>
          <span className="text-base-content/40">•</span>
          <span className="text-base-content/80">Your personal developer sanctuary</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-base-content leading-[1.15]">
          A second brain built for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-secondary">
            how developers actually work.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
          Stop drowning in lost browser tabs and scattered notes. Keep your favorite code snippets, documentation bookmarks, and project notes organized in one clean, distraction-free space.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="btn btn-primary btn-lg w-full sm:w-auto px-8 shadow-lg shadow-primary/20 normal-case text-base hover:scale-[1.02] transition-transform"
          >
            Start organizing — it&apos;s free
          </Link>
          <Link
            href="/dashboard"
            className="btn btn-ghost btn-lg w-full sm:w-auto border border-base-content/10 normal-case text-base hover:bg-base-200"
          >
            Explore the Workspace
          </Link>
        </div>

        {/* Feature Highlights / Social Proof */}
        <div className="mt-16 pt-8 border-t border-base-content/10 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          <div className="flex flex-col">
            <span className="font-bold text-base-content text-lg">Instant Lookup</span>
            <span className="text-sm text-base-content/60">Find snippets and links without breaking flow</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base-content text-lg">AI Assisted</span>
            <span className="text-sm text-base-content/60">Generate, refine, and explain syntax on the fly</span>
          </div>
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="font-bold text-base-content text-lg">Zero Clutter</span>
            <span className="text-sm text-base-content/60">Clean aesthetic tailored for daily focus</span>
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-28">
      {/* Ambient background blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-primary/15 via-indigo-500/15 to-secondary/15 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-base-content/10 bg-base-200/60 backdrop-blur-md mb-6 text-xs sm:text-sm font-medium">
              <span className="text-primary font-semibold">✨ DevDeck</span>
              <span className="text-base-content/30">•</span>
              <span className="text-base-content/80">Your personal developer sanctuary</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-base-content leading-[1.12]">
              A second brain built for <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-secondary">
                how developers actually work.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-base-content/70 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Stop losing snippets in messy scratchpads and scattered tabs. Keep your go-to code, documentation links, and daily commands organized in one clean workspace.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
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
                Open Workspace
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="mt-12 pt-8 border-t border-base-content/10 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block font-extrabold text-base-content text-xl sm:text-2xl">0.1s</span>
                <span className="text-xs sm:text-sm text-base-content/60">Instant lookup</span>
              </div>
              <div>
                <span className="block font-extrabold text-base-content text-xl sm:text-2xl">Markdown</span>
                <span className="text-xs sm:text-sm text-base-content/60">Syntax ready</span>
              </div>
              <div>
                <span className="block font-extrabold text-base-content text-xl sm:text-2xl">100%</span>
                <span className="text-xs sm:text-sm text-base-content/60">Distraction free</span>
              </div>
            </div>
          </div>

          {/* Right Visual Card (Replaces the Platform Status widget) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-base-content/10 bg-base-100/90 shadow-2xl backdrop-blur-xl p-5 sm:p-6 relative">
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-base-content/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-error/70 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-warning/70 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-success/70 inline-block" />
                </div>
                <span className="text-xs font-mono text-base-content/50">snippets/auth-middleware.ts</span>
              </div>

              {/* Code Sandbox Preview */}
              <div className="font-mono text-xs sm:text-sm leading-relaxed text-base-content/85 space-y-1 overflow-hidden">
                <p><span className="text-primary font-semibold">import</span> &#123; verifyToken &#125; <span className="text-primary font-semibold">from</span> <span className="text-success">&apos;@/lib/auth&apos;</span>;</p>
                <p className="text-base-content/40">// Quick reference handler</p>
                <p><span className="text-primary font-semibold">export async function</span> <span className="text-indigo-400">authGuard</span>(req) &#123;</p>
                <p className="pl-4"><span className="text-primary font-semibold">const</span> token = req.headers.get(<span className="text-success">&apos;authorization&apos;</span>);</p>
                <p className="pl-4"><span className="text-primary font-semibold">if</span> (!token) <span className="text-primary font-semibold">return</span> Response.json(&#123; error: <span className="text-success">&apos;Unauthorized&apos;</span> &#125;);</p>
                <p className="pl-4"><span className="text-primary font-semibold">return</span> verifyToken(token);</p>
                <p>&#125;</p>
              </div>

              {/* Interactive Tag Bar */}
              <div className="mt-5 pt-4 border-t border-base-content/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="badge badge-sm badge-primary badge-outline">TypeScript</span>
                  <span className="badge badge-sm badge-ghost">Next.js 14</span>
                </div>
                <span className="text-xs text-base-content/60 font-medium">Synced just now</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
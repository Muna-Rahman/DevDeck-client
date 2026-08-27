'use client';

import Link from 'next/link';

export default function AboutSection() {
  return (
    <section className="py-20 border-t border-base-content/10 bg-base-200/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">About the project</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
              Built to solve real day-to-day friction.
            </h2>
            <p className="mt-4 text-base-content/70 leading-relaxed text-sm sm:text-base">
              Every developer accumulates hundreds of micro-patterns: Docker compose configs, API authentication handlers, Git aliases, and framework templates.
            </p>
            <p className="mt-3 text-base-content/70 leading-relaxed text-sm sm:text-base">
              DevDeck was created to give those snippets a permanent home where they can be searched, shared, and referenced instantly.
            </p>
            <div className="mt-6">
              <Link href="/cards" className="btn btn-primary btn-sm normal-case">
                Explore Dev Cards
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-base-100 border border-base-content/10 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h4 className="font-bold text-base-content text-sm">Save Once</h4>
                <p className="text-xs text-base-content/60">Capture terminal commands, links, and code blocks.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h4 className="font-bold text-base-content text-sm">Tag & Categorize</h4>
                <p className="text-xs text-base-content/60">Keep everything organized by language, stack, and project.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h4 className="font-bold text-base-content text-sm">Retrieve in Seconds</h4>
                <p className="text-xs text-base-content/60">Instant keyboard-friendly lookup whenever you build.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';

import Link from 'next/link';

export default function WhySection() {
  const points = [
    {
      title: 'Context switching is the real productivity killer',
      body: 'Opening 15 browser tabs just to find that one regex or Bash boilerplate disrupts your flow state. DevDeck puts your most-used assets one keystroke away.',
      icon: '🧠',
    },
    {
      title: 'Clean, structured, and developer-first',
      body: 'No bloated enterprise overhead or noisy dashboards. DevDeck gives you lightweight cards, syntax-aware snippets, and neat bookmark collections.',
      icon: '⚡',
    },
    {
      title: 'Works smoothly alongside your coding setup',
      body: 'Whether you want a dark mode terminal feel or a high-contrast theme, DevDeck adapts seamlessly to your favorite workspace aesthetic.',
      icon: '🎨',
    },
  ];

  return (
    <section className="py-20 border-t border-base-content/5 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Why DevDeck</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            Designed for developers who value clarity
          </p>
          <p className="mt-4 text-base-content/70">
            A faster, cleaner way to store and retrieve your technical know-how without the noise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((pt, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-base-200/40 border border-base-content/5 flex flex-col justify-between hover:border-primary/20 transition-all"
            >
              <div>
                <div className="text-3xl mb-4">{pt.icon}</div>
                <h3 className="text-xl font-bold text-base-content mb-3 leading-snug">
                  {pt.title}
                </h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  {pt.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/snippets" className="btn btn-outline btn-sm normal-case font-medium">
            Browse snippet collection →
          </Link>
        </div>
      </div>
    </section>
  );
}
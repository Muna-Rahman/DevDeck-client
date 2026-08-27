'use client';

export default function FeaturesSection() {
  const features = [
    {
      title: 'Smart Code Stashes',
      description: 'Save snippets with multi-language syntax highlighting. Grab what you need in seconds without searching old repos.',
      badge: 'Snippets',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      title: 'Focused Bookmarks',
      description: 'Organize documentation, libraries, GitHub threads, and cheat sheets with custom categories and tag hierarchies.',
      badge: 'Organization',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
    },
    {
      title: 'Built-in AI Assistant',
      description: 'Get automated summaries, quick refactors, and intelligent suggestions directly inside your developer workspace.',
      badge: 'Productivity',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Flexible Modular Cards',
      description: 'Create customizable cards for micro-tasks, project ideas, commands, or quick reference sheets that stay out of your way.',
      badge: 'Cards',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      title: 'Personalized Workspace',
      description: 'Tailor themes, view layouts, language preferences, and font families so your editor aesthetic carries straight into your dashboard.',
      badge: 'Customization',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
    {
      title: 'Instant Search & Filter',
      description: 'Quickly find what you saved 5 minutes or 5 months ago with lightning-fast keyword search and category tags.',
      badge: 'Speed',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 bg-base-200/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Designed for Flow</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-base-content">
            Everything you need. Nothing you don&apos;t.
          </p>
          <p className="mt-4 text-base-content/70">
            Crafted to simplify how you capture knowledge during active coding sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-base-100 border border-base-content/5 hover:border-primary/30 transition-all hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <span className="badge badge-ghost badge-sm text-xs font-medium">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-base-content mb-2">{item.title}</h3>
                <p className="text-sm text-base-content/70 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-primary/10 via-base-200 to-secondary/10 border border-base-content/10 text-center relative">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-base-content tracking-tight">
            Ready to reclaim your workspace?
          </h2>
          <p className="mt-4 text-base-content/70 max-w-xl mx-auto text-base sm:text-lg">
            Join developers keeping their snippets organized, code clean, and workflows seamless.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="btn btn-primary btn-lg normal-case px-8 shadow-lg shadow-primary/20"
            >
              Create Free Account
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-outline btn-lg normal-case px-8"
            >
              Open Live Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
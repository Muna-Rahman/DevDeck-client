'use client';

import Link from 'next/link';

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-base-100/80 border-b border-base-content/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight text-base-content">
          <span className="w-8 h-8 rounded-lg bg-primary text-primary-content flex items-center justify-center font-black text-sm shadow">
            D
          </span>
          <span>DevDeck</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="btn btn-ghost btn-sm normal-case text-sm font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="btn btn-primary btn-sm normal-case text-sm font-medium shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate database staging execution delay
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Account created successfully! Redirecting...");
      
      // Auto-route back to login access gateway after a quick pause
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 relative">
      
      {/* Immersive Panoramic Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: `url('https://i.pinimg.com/1200x/b2/8e/3e/b28e3e30962488350fe80888d2833967.jpg')`
        }}
      >
        {/* Dark overlay mask matching the login panel configuration */}
        <div className="absolute inset-0 bg-[#0B0E14]/40 backdrop-brightness-[0.75] dark:backdrop-brightness-[0.45]" />
      </div>

      {/* Frosted Registration Terminal Card */}
      <div className="w-full max-w-md rounded-2xl border border-[rgba(20,20,40,0.12)] dark:border-white/10 bg-white/70 dark:bg-[#1A1D29]/65 backdrop-blur-glass p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative z-10">
        
        {/* Card Header Identity */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white shadow-[0_0_15px_rgba(233,79,209,0.4)] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#1A1D29] dark:text-[#F5F6FA]">
            Account Registration
          </h2>
          <p className="text-xs font-medium uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5] mt-1">
            Create new deployment credentials
          </p>
        </div>

        {/* Action Form Handler */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {successMsg && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              {successMsg}
            </div>
          )}

          {/* User Name Input Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5] mb-1.5">
              Account Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="MunaNemme"
              className="w-full h-10 rounded-xl border border-[rgba(20,20,40,0.15)] bg-white/50 dark:border-white/5 dark:bg-[#0B0E14]/60 px-4 text-xs font-medium tracking-wide text-[#1A1D29] dark:text-[#F5F6FA] outline-none transition-all focus:border-[#D6249F] dark:focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
            />
          </div>

          {/* Email Input Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5] mb-1.5">
              Type your email here

            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="devdeck@gmail.com"
              className="w-full h-10 rounded-xl border border-[rgba(20,20,40,0.15)] bg-white/50 dark:border-white/5 dark:bg-[#0B0E14]/60 px-4 text-xs font-medium tracking-wide text-[#1A1D29] dark:text-[#F5F6FA] outline-none transition-all focus:border-[#D6249F] dark:focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
            />
          </div>

          {/* Password Input Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5] mb-1.5">
                Type your password here
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 rounded-xl border border-[rgba(20,20,40,0.15)] bg-white/50 dark:border-white/5 dark:bg-[#0B0E14]/60 px-4 text-xs font-mono tracking-wide text-[#1A1D29] dark:text-[#F5F6FA] outline-none transition-all focus:border-[#D6249F] dark:focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
            />
          </div>

          {/* Registration Trigger Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] dark:from-[#D6249F] text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(233,79,209,0.25)] hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Registering Character..." : "Account created successfully! Redirecting..."}
          </button>

        </form>

        {/* Existing Profile Links Redirect */}
        <div className="mt-6 pt-4 border-t border-[rgba(20,20,40,0.1)] dark:border-white/5 text-center">
          <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5]">
            Already have an account????{" "}
            <Link href="/login" className="text-[#D6249F] dark:text-[#FF6FB5] font-semibold hover:underline">
              Login to your account then!!
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected system connection anomaly occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 relative">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
        }}
      >
        <div className="absolute inset-0 bg-[#0B0E14]/40 backdrop-brightness-[0.75] dark:backdrop-brightness-[0.45]" />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-[rgba(20,20,40,0.12)] dark:border-white/10 bg-white/70 dark:bg-[#1A1D29]/65 backdrop-blur-glass p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative z-10">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#db61ad] to-[#861e60] text-white shadow-[0_0_15px_rgba(233,79,209,0.4)] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#1A1D29] dark:text-[#F5F6FA]">
             Initialization
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-xs font-semibold uppercase tracking-wider text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
              {error}
            </div>
          )}

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

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#81456e] to-[#da448c] dark:from-[#8c035c] text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(233,79,209,0.25)] hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Verifying information..." : "Initializing account"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5]">
            No account yet?{" "}
            <Link href="/register" className="text-[#D6249F] dark:text-[#FF6FB5] font-semibold hover:underline cursor-pointer">
              Create an account then!!
            </Link>
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-[rgba(20,20,40,0.1)] dark:border-white/5 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5]">
            "hardcoded email and password since its not connected to backend yet "
          </p>
          <p className="text-[11px] font-mono mt-1 text-[#D6249F] dark:text-[#FF6FB5]">
            devdeck@gmail.com // 12345678
          </p>
        </div>
      </div>
    </div>
  );
}
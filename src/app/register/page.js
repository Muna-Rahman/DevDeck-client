"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import { authClient } from "@/lib/auth-client";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match matching parameters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected deployment anomaly occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center px-4 relative bg-[#FAF9F6] dark:bg-[#0B0E14] transition-colors duration-300">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
        }}
      >
        <div className="absolute inset-0 bg-white/50 dark:bg-[#0B0E14]/40 backdrop-brightness-100 dark:backdrop-brightness-[0.45]" />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-[rgba(20,20,40,0.12)] dark:border-white/10 bg-white/70 dark:bg-[#1A1D29]/65 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative z-10">
        
        {/* Sleek Floating Back To Landing Navigation Action */}
        <Link 
          href="/" 
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-white transition-all group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </Link>

        <div className="text-center mb-6 mt-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#db61ad] to-[#861e60] text-white shadow-[0_0_15px_rgba(233,79,209,0.4)] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#1A1D29] dark:text-[#F5F6FA]">
            Registration
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
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Mercer"
              className="w-full h-10 rounded-xl border border-[rgba(20,20,40,0.15)] bg-white/50 dark:border-white/5 dark:bg-[#0B0E14]/60 px-4 text-xs font-medium tracking-wide text-[#1A1D29] dark:text-[#F5F6FA] outline-none transition-all focus:border-[#D6249F] dark:focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5] mb-1.5">
              Email Address
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
              Choose Password
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

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5] mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 rounded-xl border border-[rgba(20,20,40,0.15)] bg-white/50 dark:border-white/5 dark:bg-[#0B0E14]/60 px-4 text-xs font-mono tracking-wide text-[#1A1D29] dark:text-[#F5F6FA] outline-none transition-all focus:border-[#D6249F] dark:focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#81456e] to-[#da448c] dark:from-[#8c035c] text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(233,79,209,0.25)] hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating Profile..." : "Register Account"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#D6249F] dark:text-[#FF6FB5] font-semibold hover:underline cursor-pointer">
              Log in instead
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
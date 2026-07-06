
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

import SunIcon from '@gravity-ui/icons/svgs/sun.svg';
import MoonIcon from '@gravity-ui/icons/svgs/moon.svg';

export default function Navbar() {
  const router = useRouter();
  const currentPath = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Added state tracking for dropdown
  const dropdownRef = useRef(null); // Reference to close dropdown when clicking outside
  
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown if user clicks anywhere else on the screen
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setDropdownOpen(false);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { label: "Dashboard", target: "/" },
    { label: "My Cards", target: "/cards" },
    { label: "Snippets", target: "/snippets" },
    { label: "Bookmarks", target: "/bookmarks" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(20,20,40,0.06)] bg-white/80 backdrop-blur-glass dark:border-white/8 dark:bg-[#1A1D29]/65 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 transition-transform active:scale-95 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] dark:from-[#D6249F] text-white shadow-[0_0_15px_rgba(233,79,209,0.35)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-10 5 10 5 10-5-10-5Z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#1A1D29] dark:text-[#F5F6FA]">
              DevDeck
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = currentPath === item.target;
              return (
                <Link
                  key={item.target}
                  href={item.target}
                  className={`px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-black/5 dark:bg-white/10 text-[#D6249F] dark:text-[#FF6FB5] border border-[rgba(20,20,40,0.06)] dark:border-white/10"
                      : "text-[#5B5F72] hover:text-[#1A1D29] dark:text-[#9CA3B5] dark:hover:text-[#F5F6FA]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Global Filter Search Module Bar */}
        <div className="hidden sm:flex relative max-w-sm w-full mx-4">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#5B5F72] dark:text-[#9CA3B5]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search dashboard..."
            className="w-full h-10 rounded-xl border border-[rgba(20,20,40,0.08)] bg-white/40 pl-10 pr-12 text-xs uppercase font-medium tracking-wide text-[#1A1D29] dark:text-[#F5F6FA] outline-none transition-all focus:border-[#D6249F] dark:focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
          />
          <kbd className="absolute right-3 top-2 inline-flex h-6 select-none items-center gap-0.5 rounded-md border border-[rgba(20,20,40,0.08)] bg-white px-1.5 font-sans text-[10px] font-medium text-[#5B5F72] dark:border-white/10 dark:bg-[#1A1D29] dark:text-[#9CA3B5]">
            <span>⌘</span>K
          </kbd>
        </div>

        {/* Interactive Actions Stack */}
        <div className="flex items-center gap-3.5">
          <button className="hidden sm:inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] dark:from-[#D6249F] px-5 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(233,79,209,0.25)] hover:opacity-95 active:scale-95 transition-all">
            Add Card
          </button>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle visual theme mode"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(20,20,40,0.08)] bg-white/60 dark:border-white/10 dark:bg-[#1A1D29]/60 hover:bg-white dark:hover:bg-[#1A1D29] transition-all duration-200 active:scale-90"
          >
            <Image 
              src={darkMode ? SunIcon : MoonIcon} 
              alt="Theme" 
              width={18} 
              height={18}
              className="opacity-80 dark:invert transition-opacity"
            />
          </button>

          {/* Render Profile Section safely on client post-mount */}
          {mounted && !isPending && session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="flex items-center outline-none cursor-pointer transition-transform active:scale-95"
              >
                <img
  src={session.user.image || `https://api.dicebear.com/7.x/open-peeps/svg?seed=${encodeURIComponent(session.user.name || 'default')}`}
  alt="User Profile"
  className="h-9 w-9 rounded-full border-2 border-[#FF6FB5] dark:border-[#E94FD1] object-cover"
/>
              </button>
              
              {/* Controlled dynamically via conditional rendering + transition checks */}
              <div 
                className={`absolute right-0 mt-2.5 w-52 origin-top-right rounded-2xl border border-[rgba(20,20,40,0.08)] bg-white/95 backdrop-blur-glass p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-150 dark:border-white/8 dark:bg-[#1A1D29]/95 ${
                  dropdownOpen 
                    ? "opacity-100 scale-100 pointer-events-auto" 
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="px-3 py-2 border-b border-[rgba(20,20,40,0.06)] dark:border-white/5 mb-1">
                  <p className="text-xs font-semibold text-[#1A1D29] dark:text-[#F5F6FA] truncate">{session.user.name}</p>
                  <p className="text-[11px] text-[#5B5F72] dark:text-[#9CA3B5] truncate">{session.user.email}</p>
                </div>
                <Link 
                  href="/profile" 
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center w-full px-3 py-2 text-xs rounded-xl text-[#5B5F72] dark:text-[#9CA3B5] hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Profile Settings
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center w-full px-3 py-2 text-xs font-medium rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer text-left"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            mounted && !isPending && (
              <Link href="/login" className="text-sm font-medium text-[#5B5F72] hover:text-[#1A1D29] dark:text-[#9CA3B5] dark:hover:text-[#F5F6FA]">
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
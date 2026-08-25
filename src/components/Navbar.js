"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Search, Plus, Code2, FileText, Link2, Cpu, Lightbulb, Loader2 } from "lucide-react";
import { LogoGithub } from "@gravity-ui/icons";

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Small icon per result type, purely cosmetic in the dropdown.
const typeIcon = (type) => {
  switch (type) {
    case "GitHub Repository":
    case "repos":
      return LogoGithub;
    case "Snippet":
    case "snippets":
      return Code2;
    case "Markdown Note":
    case "notes":
      return FileText;
    case "API Endpoint":
    case "apis":
      return Cpu;
    case "Project Idea":
    case "ideas":
      return Lightbulb;
    case "Resource Link":
    case "links":
    default:
      return Link2;
  }
};

export default function Navbar() {
  const router = useRouter();
  const currentPath = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const { isDark: darkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: session, isPending } = authClient.useSession();

  // --- Global search state -------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchWrapRef = useRef(null);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced parallel search across cards + snippets. There's no server
  // search endpoint, so we pull each collection and filter client-side —
  // still debounced so we're not re-fetching on every keystroke.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const thisRequestId = ++requestIdRef.current;
      try {
        const [cardsRes, snippetsRes] = await Promise.all([
          fetch(`${backendUrl}/api/cards`, { credentials: "include" }),
          fetch(`${backendUrl}/api/snippets`, { credentials: "include" }),
        ]);

        const cardsData = cardsRes.ok ? await cardsRes.json() : [];
        const snippetsData = snippetsRes.ok ? await snippetsRes.json() : [];

        // Stale response guard — ignore results from a request that isn't
        // the latest one fired (fast typers can otherwise get flicker).
        if (thisRequestId !== requestIdRef.current) return;

        const lowerQuery = query.toLowerCase();

        const matches = (title, extra) =>
          (title || "").toLowerCase().includes(lowerQuery) ||
          (extra || []).some((v) => (v || "").toLowerCase().includes(lowerQuery));

        const cardMatches = cardsData
          .filter((c) =>
            matches(c.title || c.content?.title, [
              c.metadata?.description,
              c.content?.notes,
              c.metadata?.url,
              c.content?.url,
              ...(Array.isArray(c.tags) ? c.tags : []),
            ])
          )
          .map((c) => ({
            id: c._id || c.id,
            title: c.title || c.content?.title || c.metadata?.url || "Untitled Card",
            type: c.type,
            isSnippet: false,
          }));

        const snippetMatches = snippetsData
          .filter((s) =>
            matches(s.title, [
              s.description,
              s.code,
              s.language,
              ...(Array.isArray(s.tags) ? s.tags : []),
            ])
          )
          .map((s) => ({
            id: s._id || s.id,
            title: s.title || "Untitled Snippet",
            type: "Snippet",
            isSnippet: true,
          }));

        setSearchResults([...cardMatches, ...snippetMatches].slice(0, 8));
      } catch (err) {
        console.error("Global search failed:", err);
        if (thisRequestId === requestIdRef.current) setSearchResults([]);
      } finally {
        if (thisRequestId === requestIdRef.current) setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handleSelectResult = (result) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    router.push(result.isSnippet ? "/snippets" : "/cards");
  };

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
    { label: "Dashboard", target: "/dashboard" },
    { label: "My Cards", target: "/cards" },
    { label: "Snippets", target: "/snippets" },
    { label: "Bookmarks", target: "/bookmarks" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(20,20,40,0.06)] bg-white/80 backdrop-blur-glass dark:border-white/8 dark:bg-[#1A1D29]/65 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 transition-transform active:scale-95 group">
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
                  key={item.label + item.target}
                  href={item.target}
                  className={`px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-black/5 dark:bg-white/10 text-[#D6249F] dark:text-[#FF6FB5] border border-[rgba(20,20,40,0.06)] dark:border-white/10 shadow-xs"
                      : "text-[#5B5F72] hover:text-[#1A1D29] dark:text-[#9CA3B5] dark:hover:text-[#F5F6FA] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Global Search Input Bar */}
        <div className="hidden sm:flex relative max-w-sm w-full mx-4" ref={searchWrapRef}>
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#5B5F72] dark:text-[#9CA3B5]">
            {isSearching ? <Loader2 size={16} strokeWidth={2.5} className="animate-spin" /> : <Search size={16} strokeWidth={2.5} />}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => {
              setSearchFocused(true);
              if (searchQuery.trim()) setSearchOpen(true);
            }}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchResults[0]) {
                handleSelectResult(searchResults[0]);
              } else if (e.key === "Escape") {
                setSearchOpen(false);
              }
            }}
            placeholder="Search snippets & cards..."
            className="w-full h-10 rounded-xl border border-[rgba(20,20,40,0.08)] bg-white/40 pl-10 pr-12 text-xs uppercase font-medium tracking-wide text-[#1A1D29] dark:text-[#F5F6FA] outline-none transition-all focus:border-[#D6249F] dark:focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
          />

          {/* Results Dropdown */}
          {searchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-[rgba(20,20,40,0.08)] dark:border-white/8 bg-white/95 dark:bg-[#1A1D29]/95 backdrop-blur-glass shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden normal-case">
              {isSearching && searchResults.length === 0 ? (
                <div className="px-4 py-3 text-xs text-[#5B5F72] dark:text-[#9CA3B5]">Searching...</div>
              ) : searchResults.length === 0 ? (
                <div className="px-4 py-3 text-xs text-[#5B5F72] dark:text-[#9CA3B5]">No matches found.</div>
              ) : (
                <ul className="max-h-80 overflow-y-auto py-1">
                  {searchResults.map((result) => {
                    const Icon = typeIcon(result.type);
                    return (
                      <li key={`${result.isSnippet ? "s" : "c"}-${result.id}`}>
                        <button
                          type="button"
                          onClick={() => handleSelectResult(result)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-medium text-[#1A1D29] dark:text-[#F5F6FA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <Icon width={14} height={14} className="text-[#D6249F] dark:text-[#FF6FB5] flex-shrink-0" />
                          <span className="truncate flex-1">{result.title}</span>
                          <span className="text-[10px] uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] flex-shrink-0">
                            {result.isSnippet ? "Snippet" : result.type}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => router.push("/cards?openModal=true")}
            className="hidden sm:inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] dark:from-[#D6249F] px-5 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(233,79,209,0.25)] hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} strokeWidth={3} />
            <span>Add Card</span>
          </button>

          <button 
            onClick={toggleTheme}
            aria-label="Toggle visual theme mode"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(20,20,40,0.08)] bg-white/60 dark:border-white/10 dark:bg-[#1A1D29]/60 hover:bg-white dark:hover:bg-[#1A1D29] transition-all duration-200 active:scale-90 text-[#5B5F72] dark:text-[#9CA3B5] cursor-pointer"
          >
            {darkMode ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
          </button>

          {/* User Profile / Auth State */}
          {mounted && !isPending && session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="flex items-center outline-none cursor-pointer transition-transform active:scale-95"
              >
                <img
                  src={session.user.image || `https://www.gravatar.com/avatar/${session.user.email}?d=identicon`}
                  alt="User Profile"
                  className="h-9 w-9 rounded-full border-2 border-[#FF6FB5] dark:border-[#E94FD1] object-cover"
                />
              </button>
              
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
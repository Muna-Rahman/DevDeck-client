"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from "@/context/SidebarContext";
import { authClient } from "@/lib/auth-client";
import CreateCategoryModal from "@/components/CreateCategoryModal";
import {
  FolderPlus,
  Folder,
  Heart,
  Clock,
  Tag,
  Settings,
  LayoutDashboard,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Sidebar() {
  // Grab state directly from the context provider framework
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Close the drawer on navigation and when Escape is pressed.
  useEffect(() => { closeSidebar(); }, [pathname, closeSidebar]);
  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKey = (e) => { if (e.key === "Escape") closeSidebar(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isSidebarOpen, closeSidebar]);

  const [workspaceCards, setWorkspaceCards] = useState([]);
  const [savedCategories, setSavedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);

 
  useEffect(() => {
    let isMounted = true;

    const fetchWorkspaceCards = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/cards`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok && isMounted) {
          const data = await response.json();
          setWorkspaceCards(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Sidebar: failed to sync workspace cards from backend.", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWorkspaceCards();
    return () => { isMounted = false; };
  }, []);

  // Pull categories the user has explicitly created via "Create Category",
  // independent of whether a card has been assigned to them yet.
  const fetchSavedCategories = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setSavedCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Sidebar: failed to sync categories from backend.", err);
    }
  };

  useEffect(() => {
    fetchSavedCategories();
  }, []);


  const categories = useMemo(() => {
    const counts = new Map();

    savedCategories.forEach((cat) => {
      if (cat?.name) counts.set(cat.name, 0);
    });

    workspaceCards.forEach((card) => {
      const key = card.category || card.type || "Uncategorized";
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [workspaceCards, savedCategories]);

  // Derive live tags with counts from the fetched cards
  const tags = useMemo(() => {
    const counts = new Map();
    workspaceCards.forEach((card) => {
      (Array.isArray(card.tags) ? card.tags : []).forEach((tag) => {
        if (!tag) return;
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [workspaceCards]);

  const favoritesCount = useMemo(
    () => workspaceCards.filter((card) => card.isBookmarked).length,
    [workspaceCards]
  );

  const recentCount = workspaceCards.length;

  
  const handleCreateCategory = () => {
    closeSidebar();
    setCategoriesOpen(true);
    setIsCreateCategoryOpen(true);
  };

  const handleCategoryCreated = async (name) => {
    try {
      const response = await fetch(`${backendUrl}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { error: data?.error || "Failed to create category." };
      }

      setSavedCategories((prev) => [data, ...prev]);
      return { category: data };
    } catch (err) {
      console.error("Sidebar: failed to create category.", err);
      return { error: "Failed to create category. Please try again." };
    }
  };

  const userName = (mounted && session?.user?.name) || "Your workspace";
  const userEmail = (mounted && session?.user?.email) || "";
  const userImage = mounted ? session?.user?.image : null;
  const initial = (userName || "D").trim().charAt(0).toUpperCase();

  // One shared look for every drawer row. `active` gets the gradient pill.
  const rowClass = (active) =>
    `drawer-row group w-full flex items-center gap-3 pl-2 pr-3 py-2 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer text-left ${
      active
        ? "bg-gradient-to-r from-[#4338CA] to-[#6D4AFF] dark:from-[#35338F] dark:to-[#5A4BD1] text-white shadow-[0_10px_22px_-10px_rgba(79,70,229,0.8)]"
        : "text-[#3A3656] dark:text-[#C9C6E0] hover:bg-[#6D4AFF]/[0.07] dark:hover:bg-white/[0.06]"
    }`;
  const chipClass = (active) =>
    `flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
      active
        ? "bg-[#2FA8FF] text-white"
        : "bg-[#6D4AFF]/10 text-[#6B6788] dark:bg-white/[0.07] dark:text-[#9A97B5] group-hover:text-[#6D28D9] dark:group-hover:text-white"
    }`;
  const countClass = (active) =>
    `text-[10px] font-mono ${active ? "text-white/80" : "text-[#8A86A6] dark:text-white/40"}`;
  const subLinkClass =
    "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#4A4668] dark:text-[#C9C6E0]/80 hover:bg-[#6D4AFF]/[0.07] dark:hover:bg-white/[0.06] hover:text-[#1E1B3A] dark:hover:text-white transition-all duration-150";

  const isActive = (target) => pathname === target;

  return (
    <>
    <div className={isSidebarOpen ? "drawer-open" : ""}>
      {/* Dimmed page behind the drawer; tap to close */}
      <div
        onClick={closeSidebar}
        aria-hidden="true"
        className={`fixed inset-0 z-[55] bg-[#0B0E14]/55 backdrop-blur-[2px] transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        inert={!isSidebarOpen}
        aria-hidden={!isSidebarOpen}
        aria-label="Workspace navigation"
        className="drawer-panel fixed top-0 -left-10 z-[60] h-full w-[22rem] max-w-[calc(85vw+2.5rem)] pl-10 flex flex-col rounded-r-[28px] border-r border-[#6D4AFF]/15 dark:border-white/[0.07] bg-gradient-to-b from-white to-[#F3F0FF] dark:from-[#26233B] dark:to-[#1C1A2D] shadow-[24px_0_60px_-20px_rgba(30,27,58,0.35)] dark:shadow-[24px_0_60px_-20px_rgba(0,0,0,0.8)] select-none"
      >
        <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden p-5">

          {/* Profile header */}
          <div className="drawer-row flex items-center gap-3 pb-5" style={{ "--i": 0 }}>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#2FA8FF] to-[#7C5CFF] text-lg font-semibold text-white shadow-[0_8px_20px_-8px_rgba(79,70,229,0.8)]">
              {userImage ? <img src={userImage} alt="" className="h-full w-full object-cover" /> : initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1E1B3A] dark:text-white">{userName}</p>
              {userEmail && <p className="truncate text-[11px] text-[#8A86A6] dark:text-[#9A97B5]">{userEmail}</p>}
            </div>
            <button
              onClick={closeSidebar}
              aria-label="Close menu"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-[#6B6788] dark:text-[#9A97B5] hover:bg-[#6D4AFF]/[0.08] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <nav className="space-y-1.5">
            {/* Dashboard */}
            <Link href="/dashboard" className={rowClass(isActive("/dashboard"))} style={{ "--i": 1 }}>
              <span className={chipClass(isActive("/dashboard"))}><LayoutDashboard size={16} /></span>
              <span className="flex-1 whitespace-nowrap">Dashboard</span>
            </Link>

            {/* Categories — expandable list of real, live categories */}
            <div>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={rowClass(false)}
                style={{ "--i": 2 }}
              >
                <span className={chipClass(false)}><Folder size={16} /></span>
                <span className="flex-1 whitespace-nowrap">Categories</span>
                <span className={countClass(false)}>{loading ? "…" : categories.length}</span>
                {categoriesOpen ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />}
              </button>

              {categoriesOpen && (
                <div className="mt-1 ml-6 space-y-0.5 border-l border-[#6D4AFF]/15 dark:border-white/10 pl-3 animate-fadeIn">
                  {categories.length === 0 ? (
                    <p className="text-xs text-[#8A86A6] dark:text-white/40 py-1.5">No categories yet</p>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={`/cards?category=${encodeURIComponent(cat.name)}`}
                        className={subLinkClass}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] font-mono ml-2 text-[#8A86A6] dark:text-white/40">{cat.count}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Favorites — links to the real, backend-backed bookmarks page */}
            <Link href="/bookmarks" className={rowClass(isActive("/bookmarks"))} style={{ "--i": 3 }}>
              <span className={chipClass(isActive("/bookmarks"))}><Heart size={16} /></span>
              <span className="flex-1 whitespace-nowrap">Favorites</span>
              <span className={countClass(isActive("/bookmarks"))}>{loading ? "…" : favoritesCount}</span>
            </Link>

            {/* Recent — the cards workspace, already sorted newest-first by the backend */}
            <Link href="/cards" className={rowClass(isActive("/cards"))} style={{ "--i": 4 }}>
              <span className={chipClass(isActive("/cards"))}><Clock size={16} /></span>
              <span className="flex-1 whitespace-nowrap">Recent</span>
              <span className={countClass(isActive("/cards"))}>{loading ? "…" : recentCount}</span>
            </Link>

            {/* Tags — expandable list of real, live tags */}
            <div>
              <button
                onClick={() => setTagsOpen(!tagsOpen)}
                className={rowClass(false)}
                style={{ "--i": 5 }}
              >
                <span className={chipClass(false)}><Tag size={16} /></span>
                <span className="flex-1 whitespace-nowrap">Tags</span>
                <span className={countClass(false)}>{loading ? "…" : tags.length}</span>
                {tagsOpen ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />}
              </button>

              {tagsOpen && (
                <div className="mt-1 ml-6 space-y-0.5 border-l border-[#6D4AFF]/15 dark:border-white/10 pl-3 animate-fadeIn">
                  {tags.length === 0 ? (
                    <p className="text-xs text-[#8A86A6] dark:text-white/40 py-1.5">No tags yet</p>
                  ) : (
                    tags.map((tag) => (
                      <Link
                        key={tag.name}
                        href={`/cards?tag=${encodeURIComponent(tag.name)}`}
                        className={subLinkClass}
                      >
                        <span className="truncate">#{tag.name}</span>
                        <span className="text-[10px] font-mono ml-2 text-[#8A86A6] dark:text-white/40">{tag.count}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Footer: create category + settings */}
          <div className="mt-auto pt-5 space-y-2">
            <button
              onClick={handleCreateCategory}
              className="drawer-row w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#C026D3] to-[#E94FD1] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(192,38,211,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 cursor-pointer"
              style={{ "--i": 6 }}
            >
              <FolderPlus size={18} />
              <span className="whitespace-nowrap">Create Category</span>
            </button>

            <div className="drawer-row border-t border-[#6D4AFF]/10 dark:border-white/[0.07] pt-2" style={{ "--i": 7 }}>
              <Link href="/settings" className={rowClass(isActive("/settings")).replace("drawer-row ", "")}>
                <span className={chipClass(isActive("/settings"))}>
                  <Settings size={16} className="group-hover:rotate-45 transition-transform duration-300 ease-out" />
                </span>
                <span className="flex-1 whitespace-nowrap">Settings</span>
              </Link>
            </div>
          </div>

        </div>
      </aside>
    </div>

    <CreateCategoryModal
      isOpen={isCreateCategoryOpen}
      onClose={() => setIsCreateCategoryOpen(false)}
      onCreate={handleCategoryCreated}
    />
    </>
  );
}
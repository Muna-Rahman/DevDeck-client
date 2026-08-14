"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSidebar } from "@/context/SidebarContext";
import {
  FolderPlus,
  Folder,
  Heart,
  Clock,
  Tag,
  Settings,
  Menu,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Sidebar() {
  // Grab state directly from the context provider framework
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();
  const router = useRouter();

  const [workspaceCards, setWorkspaceCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);

  // Pull live workspace data from the backend so the sidebar reflects
  // the user's real cards instead of static placeholder links.
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

  // Derive live categories with counts from the fetched cards
  const categories = useMemo(() => {
    const counts = new Map();
    workspaceCards.forEach((card) => {
      const key = card.category || card.type || "Uncategorized";
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [workspaceCards]);

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

  // There is no standalone "categories" collection in the backend — a
  // category only exists once a card is created with that category value.
  // So "Create Category" opens the real create-card flow on /cards, where
  // the user picks/types a category as part of saving a new card.
  const handleCreateCategory = () => {
    router.push("/cards?openModal=true");
  };

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] border-r transition-all duration-300 ease-in-out z-40 glass-rail
        bg-black/10 dark:bg-black/30 backdrop-blur-xl border-white/10 shadow-2xl text-white
        ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="flex flex-col h-full justify-between p-4 overflow-x-hidden select-none overflow-y-auto">

        <div className="space-y-6">

          {/* HEADER ROW: Anchored Hamburger Button Inside the Sidebar */}
          <div className={`flex items-center w-full transition-all duration-300
            ${isSidebarCollapsed ? 'justify-center' : 'justify-start pl-1'}`}
          >
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200 shadow-md backdrop-blur-md hover:scale-105 active:scale-95"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Create Category Action Button */}
          <div className="mt-2">
            <button
              onClick={handleCreateCategory}
              className={`w-full flex items-center justify-center gap-2 font-semibold text-white bg-gradient-to-r from-seagreen/80 via-mauve/80 to-rosepink/80 hover:from-seagreen hover:via-mauve hover:to-rosepink backdrop-blur-md bg-[length:200%_auto] hover:bg-right rounded-xl shadow-md transition-all duration-500 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer
                ${isSidebarCollapsed ? 'p-3 rounded-full' : 'px-4 py-3'}`}
            >
              <FolderPlus size={20} className="animate-pulse" />
              {!isSidebarCollapsed && <span className="transition-opacity duration-300 whitespace-nowrap">Create Category</span>}
            </button>
          </div>

          {/* Core Navigation Links */}
          <nav className="space-y-1">

            {/* Categories — expandable list of real, live categories */}
            <div>
              <button
                onClick={() => (isSidebarCollapsed ? router.push("/cards") : setCategoriesOpen(!categoriesOpen))}
                className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/10 font-medium transition-all duration-200 group cursor-pointer"
              >
                <Folder size={20} className="group-hover:scale-110 transition-transform duration-200 text-seagreen flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <>
                    <span className="whitespace-nowrap text-white/90 flex-1 text-left">Categories</span>
                    <span className="text-[10px] text-white/50 font-mono">{loading ? "…" : categories.length}</span>
                    {categoriesOpen ? <ChevronDown size={14} className="text-white/50" /> : <ChevronRight size={14} className="text-white/50" />}
                  </>
                )}
              </button>

              {!isSidebarCollapsed && categoriesOpen && (
                <div className="mt-1 ml-8 space-y-0.5 border-l border-white/10 pl-3">
                  {categories.length === 0 ? (
                    <p className="text-xs text-white/40 py-1.5">No categories yet</p>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={`/cards?category=${encodeURIComponent(cat.name)}`}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/10 text-xs text-white/80 hover:text-white transition-all duration-150"
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] text-white/40 font-mono ml-2">{cat.count}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Favorites — links to the real, backend-backed bookmarks page */}
            <Link
              href="/bookmarks"
              className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/10 font-medium transition-all duration-200 group"
            >
              <Heart size={20} className="group-hover:scale-110 transition-transform duration-200 text-rosepink flex-shrink-0" />
              {!isSidebarCollapsed && (
                <>
                  <span className="whitespace-nowrap text-white/90 flex-1">Favorites</span>
                  <span className="text-[10px] text-white/50 font-mono">{loading ? "…" : favoritesCount}</span>
                </>
              )}
            </Link>

            {/* Recent — links to the cards workspace, already sorted newest-first by the backend */}
            <Link
              href="/cards"
              className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/10 font-medium transition-all duration-200 group"
            >
              <Clock size={20} className="group-hover:scale-110 transition-transform duration-200 text-mauve flex-shrink-0" />
              {!isSidebarCollapsed && (
                <>
                  <span className="whitespace-nowrap text-white/90 flex-1">Recent</span>
                  <span className="text-[10px] text-white/50 font-mono">{loading ? "…" : recentCount}</span>
                </>
              )}
            </Link>

            {/* Tags — expandable list of real, live tags */}
            <div>
              <button
                onClick={() => (isSidebarCollapsed ? router.push("/cards") : setTagsOpen(!tagsOpen))}
                className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/10 font-medium transition-all duration-200 group cursor-pointer"
              >
                <Tag size={20} className="group-hover:scale-110 transition-transform duration-200 text-rosepink/80 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <>
                    <span className="whitespace-nowrap text-white/90 flex-1 text-left">Tags</span>
                    <span className="text-[10px] text-white/50 font-mono">{loading ? "…" : tags.length}</span>
                    {tagsOpen ? <ChevronDown size={14} className="text-white/50" /> : <ChevronRight size={14} className="text-white/50" />}
                  </>
                )}
              </button>

              {!isSidebarCollapsed && tagsOpen && (
                <div className="mt-1 ml-8 space-y-0.5 border-l border-white/10 pl-3">
                  {tags.length === 0 ? (
                    <p className="text-xs text-white/40 py-1.5">No tags yet</p>
                  ) : (
                    tags.map((tag) => (
                      <Link
                        key={tag.name}
                        href={`/cards?tag=${encodeURIComponent(tag.name)}`}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/10 text-xs text-white/80 hover:text-white transition-all duration-150"
                      >
                        <span className="truncate">#{tag.name}</span>
                        <span className="text-[10px] text-white/40 font-mono ml-2">{tag.count}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Bottom Panel Settings Shortcut (Connected with Next.js Link Engine) */}
        <div className="border-t border-white/10 pt-4 mb-4">
          <Link
            href="/settings"
            className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/10 font-medium transition-all duration-200 group"
          >
            <Settings size={20} className="group-hover:rotate-45 transition-transform duration-300 ease-out text-white/70" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap text-white/90">Settings</span>}
          </Link>
        </div>

      </div>
    </div>
  );
}
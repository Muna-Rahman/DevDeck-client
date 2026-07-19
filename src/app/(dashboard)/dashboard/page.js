"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Layers, 
  Link2, 
  Code, 
  FileText, 
  Cpu, 
  Lightbulb,
  Bookmark,
  Star,
  ArrowUpRight,
  Copy
} from 'lucide-react'; 
import { authClient } from "@/lib/auth-client";
import { useBookmarks } from '@/context/BookmarkContext';
import CardDetailsDrawer from '@/components/CardDetailsDrawer';

/* ==========================================================================
   REUSABLE SYSTEM INTERFACE DESIGN COMPONENT: CARDITEM
   ========================================================================== */
function DashboardCardItem({ card, onCardUpdate, onSelectCard }) {
  const { toggleBookmark } = useBookmarks();

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const activeTargetId = card._id || card.id;
    const updated = await toggleBookmark(activeTargetId);
    if (onCardUpdate && updated) onCardUpdate(updated);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('a') || e.target.closest('.copy-action-trigger')) return;
    if (onSelectCard) onSelectCard(card);
  };

  const titleText = card.title || card.content?.title || card.metadata?.url || card.content?.url || "Untitled Configuration";
  const descText = card.metadata?.description || card.content?.notes || card.content?.body || "";
  const isBookmarkedState = card.isBookmarked || false;

  const renderCardContent = () => {
    switch(card.type) {
      case 'GitHub Repository':
      case 'repos':
        return (
          <div className="space-y-3 min-w-0">
            <p className="text-[#9CA3B5] text-xs line-clamp-2 break-words">{descText}</p>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 max-w-[100px] truncate rounded bg-[#8B5CF6]/10 text-[#B084F5] border border-[#8B5CF6]/20 font-mono">
                {card.metadata?.language || "JavaScript"}
              </span>
              <span className="flex items-center gap-1 text-[#FFB84D] font-mono flex-shrink-0">
                <Star className="w-3 h-3 fill-[#FFB84D]" /> {card.metadata?.stars || 0}
              </span>
            </div>
          </div>
        );
      case 'Snippet':
      case 'snippets':
        return (
          <div className="space-y-2 min-w-0">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#3FE0C5] uppercase tracking-wider font-mono font-semibold truncate max-w-[120px]">
                {card.metadata?.language || "Code"}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(card.metadata?.code || descText);
                }}
                className="copy-action-trigger text-[#9CA3B5] hover:text-[#3FE0C5] transition-colors flex-shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <pre className="p-2.5 bg-[#0B0E14]/60 rounded-lg text-[11px] font-mono text-[#3FE0C5] overflow-x-auto border border-white/5 whitespace-pre-wrap break-all max-h-[100px]">
              <code className="block truncate">{card.metadata?.code || descText}</code>
            </pre>
          </div>
        );
      case 'API Endpoint':
      case 'apis':
        return (
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-1.5 font-mono text-[11px] w-full">
              <span className={`px-1.5 py-0.5 rounded font-extrabold text-[10px] flex-shrink-0 ${
                card.metadata?.httpMethod === 'POST' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {card.metadata?.httpMethod || 'GET'}
              </span>
              <span className="text-[#F5F6FA] dark:text-[#F5F6FA] truncate block flex-1 break-all">
                {card.metadata?.url || card.content?.url}
              </span>
            </div>
            {descText && <p className="text-[11px] text-[#9CA3B5] line-clamp-2 break-words">{descText}</p>}
          </div>
        );
      default:
        return <p className="text-[#9CA3B5] text-xs line-clamp-2 break-words">{descText}</p>;
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative rounded-xl border border-white/[0.08] bg-white/85 dark:bg-[#1A1D29]/60 backdrop-blur-xl p-4 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(233,79,209,0.12)] cursor-pointer min-w-0 overflow-hidden w-full"
    >
      <div className="flex justify-between items-start gap-2 mb-2 w-full">
        <div className="min-w-0 flex-1">
          <span className="text-[9px] uppercase font-bold tracking-widest text-[#9CA3B5]/60 block mb-0.5 font-mono truncate">{card.type}</span>
          <h4 className="text-sm font-semibold text-[#1A1D29] dark:text-[#F5F6FA] tracking-tight truncate w-full">{titleText}</h4>
        </div>
        
        <button 
          onClick={handleBookmarkClick}
          className="p-1.5 rounded-lg bg-black/5 dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] text-[#9CA3B5] hover:text-[#E94FD1] transition-all flex-shrink-0"
        >
          {isBookmarkedState ? (
            <Bookmark className="w-3.5 h-3.5 text-[#E94FD1] drop-shadow-[0_0_6px_#E94FD1] fill-[#E94FD1]" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {renderCardContent()}

      <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/[0.06] flex justify-between items-center text-[10px] text-[#5B5F72]/60 dark:text-white/30 font-mono w-full">
        <span className="truncate">ID: {(card._id || card.id || "SYNC").substring(0, 6)}</span>
        {(card.metadata?.url || card.content?.url) && (
          <a 
            href={card.metadata?.url || card.content?.url} 
            target="_blank" 
            rel="noreferrer" 
            className="text-[#3FE0C5] hover:underline flex items-center gap-0.5 font-sans flex-shrink-0 ml-1"
          >
            Launch <ArrowUpRight className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   PRIMARY WORKSPACE MANAGEMENT ARCHITECTURE (CORE CONTROLLER PAGE)
   ========================================================================== */
export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [dbCards, setDbCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  
  // HUD Runtime Monitoring States
  const [isSystemActive, setIsSystemActive] = useState(true);
  
  // FIX: Converted state from number to string to handle structural uptime formats ("1h 4m 12s")
  const [uptimeDisplay, setUptimeDisplay] = useState("0m 0s");
  
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  
  const startTimeRef = useRef(Date.now());
  const lastActivityTime = useRef(Date.now());

  const { data: session } = authClient.useSession();
  const { refreshBookmarks } = useBookmarks();

  const streamWorkspaceAssets = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/cards`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setDbCards(data);
      }
    } catch (err) {
      console.error("Ecosystem stream connection rejected by infrastructure link.", err);
    }
  };

  useEffect(() => {
    streamWorkspaceAssets();
  }, [backendUrl]);

  const handleCardStateShift = (updatedCard) => {
    setDbCards(prev => prev.map(c => {
      const currentId = c._id || c.id;
      const targetId = updatedCard._id || updatedCard.id;
      return currentId === targetId ? updatedCard : c;
    }));
    
    if (selectedCard && ((selectedCard._id === updatedCard._id) || (selectedCard.id === updatedCard.id))) {
      setSelectedCard(updatedCard);
    }
    refreshBookmarks();
  };

  const handleDrawerBookmarkToggle = async (cardId) => {
    try {
      const res = await fetch(`${backendUrl}/api/cards/${cardId}/bookmark`, { 
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const updatedCard = await res.json();
        handleCardStateShift(updatedCard);
      }
    } catch (err) {
      console.error("Failed to alter bookmark matrix configurations:", err);
    }
  };

  // FIXED: Precision interval calculator tracking dynamic strings matching 'Xh Ym Zs' or 'Ym Zs'
  useEffect(() => {
    const runtimeInterval = setInterval(() => {
      if (isSystemActive) {
        const totalSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
          setUptimeDisplay(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setUptimeDisplay(`${minutes}m ${seconds}s`);
        }
      }
    }, 1000); // Polling clock ticks strictly every second

    const idleCheckInterval = setInterval(() => {
      const timeSinceLastAction = Date.now() - lastActivityTime.current;
      if (timeSinceLastAction > 120000) {
        setIsSystemActive(false);
      }
    }, 5000);

    const recordUserHeartbeat = () => {
      lastActivityTime.current = Date.now();
      setIsSystemActive(true);
    };

    window.addEventListener("mousemove", recordUserHeartbeat);
    window.addEventListener("keydown", recordUserHeartbeat);
    window.addEventListener("click", recordUserHeartbeat);

    return () => {
      clearInterval(runtimeInterval);
      clearInterval(idleCheckInterval);
      window.removeEventListener("mousemove", recordUserHeartbeat);
      window.removeEventListener("keydown", recordUserHeartbeat);
      window.removeEventListener("click", recordUserHeartbeat);
    };
  }, [isSystemActive]);

  const filters = [
    { id: 'All', label: 'All', icon: Layers },
    { id: 'links', label: 'Links', icon: Link2 },
    { id: 'repos', label: 'Repositories', icon: Code },
    { id: 'snippets', label: 'Snippets', icon: Code },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'apis', label: 'APIs', icon: Cpu },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb },
  ];

  const allCategories = [
    { id: 'links', ids: ['links', 'Resource Link'], title: 'Links / Docs', accent: 'border-t-4 border-rosepink' },
    { id: 'repos', ids: ['repos', 'GitHub Repository'], title: 'Repositories', accent: 'border-t-4 border-seagreen' },
    { id: 'snippets', ids: ['snippets', 'Snippet'], title: 'Snippets', accent: 'border-t-4 border-mauve' },
    { id: 'notes', ids: ['notes', 'Markdown Note'], title: 'Notes', accent: 'border-t-4 border-[#159FE0]' },
    { id: 'apis', ids: ['apis', 'API Endpoint'], title: 'APIs', accent: 'border-t-4 border-[#E8940F]' },
    { id: 'ideas', ids: ['ideas', 'Project Idea'], title: 'Ideas', accent: 'border-t-4 border-rosepink' },
  ];

  const username = session?.user?.name || session?.user?.email || "User";

  const visibleCategories = allCategories.filter((col) => {
    const belongsToActiveFilter = activeFilter === 'All' || col.id.toLowerCase() === activeFilter.toLowerCase();
    const columnCardsCount = dbCards.filter(card => col.ids.map(id => id.toLowerCase()).includes(card.type?.toLowerCase())).length;
    
    if (activeFilter === 'All') {
      return columnCardsCount > 0; 
    }
    return belongsToActiveFilter;
  });

  const getGridColumnClass = () => {
    const columnsCount = visibleCategories.length;
    if (columnsCount === 1) return "grid-cols-1 w-full max-w-4xl mx-auto";
    if (columnsCount === 2) return "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto";
    if (columnsCount === 3) return "grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto";
    if (columnsCount === 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    return "grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";
  };

  return (
    <div className="w-full flex flex-col justify-start relative z-10 space-y-6 min-w-0">
      
      {/* HERO HEADER */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center w-full">
          <div className="rounded-2xl p-6 bg-white/85 dark:bg-black/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 max-w-xl shadow-2xl flex-1 w-full transition-all duration-300 hover:border-white/60 dark:hover:border-white/20">
            <h1 className="text-3xl font-extrabold tracking-tight uppercase font-sans text-[#1A1D29] dark:text-white text-left drop-shadow-sm dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              Welcome back, {username}.
            </h1>
            <p className="text-xs font-semibold tracking-wide text-[#5B5F72] dark:text-white/70 uppercase mt-2 text-justify flex items-start gap-2">
              <span className={`h-1.5 w-1.5 rounded-full animate-ping mt-1 flex-shrink-0 ${isSystemActive ? "bg-[#0FB8A6] dark:bg-[#3FE0C5]" : "bg-amber-500"}`} />
              System environment operating stable. Ready for deployment deck workspace layout implementation parameters.
            </p>
          </div>

          {/* HUD MONITOR */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/85 dark:bg-black/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-2xl w-full sm:w-auto min-w-[240px] justify-center sm:justify-start transition-all duration-500">
            <div className="relative h-16 w-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-black/5 dark:text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path 
                  className={`transition-all duration-1000 ease-in-out ${
                    isSystemActive 
                      ? "text-[#0FB8A6] dark:text-[#3FE0C5] drop-shadow-[0_0_8px_rgba(63,224,197,0.5)] [stroke-dasharray:100,_100]" 
                      : "text-amber-500 dark:text-amber-500/80 [stroke-dasharray:30,_100]"
                  }`}
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  fill="none" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                />
              </svg>
              <span className={`absolute h-2 w-2 rounded-full shadow-md ${
                isSystemActive ? "bg-[#0FB8A6] dark:bg-[#3FE0C5] animate-ping" : "bg-amber-500 animate-pulse"
              }`} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] dark:text-white/50">Workspace Status</p>
              <div className="flex flex-col mt-0.5">
                <span className={`text-sm font-black font-mono transition-colors duration-300 ${
                  isSystemActive ? "text-[#0FB8A6] dark:text-[#3FE0C5]" : "text-amber-500"
                }`}>
                  {isSystemActive ? "SYS_ACTIVE" : "SYS_IDLE"}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 dark:text-white/40 font-medium">
                  {/* FIXED: Output string handles Hours/Minutes/Seconds accurately */}
                  Uptime: <span className="text-[#E94FD1] font-bold">{uptimeDisplay}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STAT MODULE CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Cards", value: dbCards.length.toString(), icon: Layers, color: "text-[#7C3AED] dark:text-[#8B5CF6]" },
          { label: "Repositories", value: dbCards.filter(c => c.type === 'repos' || c.type === 'GitHub Repository').length.toString(), icon: Code, color: "text-[#159FE0] dark:text-[#2FD1FF]" },
          { label: "Snippets", value: dbCards.filter(c => c.type === 'snippets' || c.type === 'Snippet').length.toString(), icon: Code, color: "text-[#D6249F] dark:text-[#E94FD1]" },
          { label: "Ideas", value: dbCards.filter(c => c.type === 'ideas' || c.type === 'Project Idea').length.toString(), icon: Lightbulb, color: "text-[#E8940F] dark:text-[#FFB84D]" },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/85 dark:bg-black/60 backdrop-blur-2xl p-5 flex items-center justify-between shadow-2xl transition-all duration-300 hover:border-white/60 dark:hover:border-white/20">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#5B5F72] dark:text-white/50 font-semibold">{stat.label}</p>
              <p className="text-xl font-bold text-[#1A1D29] dark:text-white mt-1">{stat.value}</p>
            </div>
            <div className={`p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 ${stat.color}`}>
              <stat.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* CHIPS FILTER SLOTS */}
      <div className="w-full bg-white/5 dark:bg-black/20 backdrop-blur-2xl p-2 border border-white/40 dark:border-white/5 rounded-2xl shadow-xl select-none">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-2 w-full">
          {filters.map((filter) => {
            const isSelected = activeFilter.toLowerCase() === filter.id.toLowerCase();
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`group flex items-center justify-center gap-2.5 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl border transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 w-full cursor-pointer
                  ${isSelected 
                    ? `bg-white dark:bg-white/25 shadow-xl border-white/80 dark:border-white/30 text-[#D6249F] dark:text-white scale-[1.02] drop-shadow-[0_0_12px_rgba(233,79,209,0.25)]` 
                    : 'bg-white/40 dark:bg-black/40 border-white/20 dark:border-white/5 text-[#5B5F72] dark:text-white/60 hover:bg-white/80 dark:hover:bg-black/60 hover:text-[#1A1D29] dark:hover:text-white'
                  }`}
              >
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* COLUMNS MATRIX GRID */}
      {visibleCategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 backdrop-blur-2xl p-12 text-center max-w-xl mx-auto w-full shadow-2xl">
          <div className="h-2 w-2 bg-[#3FE0C5] rounded-full animate-ping mx-auto mb-4" />
          <h3 className="text-sm font-black uppercase tracking-widest text-white/80">No active card assets found</h3>
          <p className="text-xs text-[#5B5F72] dark:text-white/40 font-medium uppercase mt-2">
            Click "+ Add Card" in the control deck navigation container to initialize resource card objects.
          </p>
        </div>
      ) : (
        <div className={`grid gap-5 w-full items-start transition-all duration-500 min-w-0 ${getGridColumnClass()}`}>
          {visibleCategories.map((col) => {
            const columnCards = dbCards.filter(card => col.ids.map(id => id.toLowerCase()).includes(card.type?.toLowerCase()));

            return (
              <div 
                key={col.id} 
                className={`rounded-2xl bg-white/85 dark:bg-black/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-4 flex flex-col h-auto transition-all duration-300 hover:border-white/60 dark:hover:border-white/20 shadow-2xl deck-column min-w-0 overflow-hidden w-full ${col.accent}`}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/5 dark:border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#1A1D29] dark:text-white/80 font-sans truncate">
                    {col.title} ({columnCards.length})
                  </h3>
                </div>

                <div className="flex flex-col gap-3 h-auto transition-all duration-300 w-full min-w-0">
                  {columnCards.map((card) => (
                    <DashboardCardItem 
                      key={card._id || card.id}
                      card={card}
                      onCardUpdate={handleCardStateShift}
                      onSelectCard={(c) => setSelectedCard(c)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Insight Panel Details Overlay */}
      <CardDetailsDrawer 
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onToggleBookmark={handleDrawerBookmarkToggle}
      />

    </div>
  );
}
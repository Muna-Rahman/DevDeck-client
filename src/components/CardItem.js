'use client';
import React from 'react';
import { useBookmarks } from '../context/BookmarkContext';
import { Bookmark, BookmarkFill, Star, ArrowUpRight, Copy } from '@gravity-ui/icons';
import { GripVertical } from 'lucide-react';

// Map HTTP methods to badge styles (keeps color consistency across modal and drawer views)
const METHOD_BADGE_CLASSES = {
  GET: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  POST: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400",
  PUT: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  PATCH: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
  DELETE: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
};

// Light-mode accent per card type (thin top bar + type label). Dark mode ignores these.
const CARD_ACCENTS = {
  repos:    { bar: "from-[#7C3AED] to-[#D6249F]", label: "text-[#6D28D9]", hover: "hover:border-[#7C3AED]/45" },
  snippets: { bar: "from-[#0E9F8A] to-[#2FD1FF]", label: "text-[#0B7F6E]", hover: "hover:border-[#0E9F8A]/45" },
  apis:     { bar: "from-[#4F46E5] to-[#2FA8FF]", label: "text-[#4338CA]", hover: "hover:border-[#4F46E5]/45" },
  other:    { bar: "from-[#D6249F] to-[#7C3AED]", label: "text-[#A21B7C]", hover: "hover:border-[#D6249F]/45" },
};
const accentFor = (type) => {
  if (type === 'GitHub Repository' || type === 'repos') return CARD_ACCENTS.repos;
  if (type === 'Snippet' || type === 'snippets') return CARD_ACCENTS.snippets;
  if (type === 'API Endpoint' || type === 'apis') return CARD_ACCENTS.apis;
  return CARD_ACCENTS.other;
};

const AUTH_LABELS = { none: "None", bearer: "Bearer Token", apikey: "API Key", basic: "Basic" };

// dragHandleProps is optional: when provided (by SortableCardItem) a grip handle is shown
export default function CardItem({ card, onCardUpdate, onSelectCard, dragHandleProps }) {
  const { toggleBookmark } = useBookmarks();

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Avoid triggering the card selection/drawer
    const activeTargetId = card._id || card.id;
    const updated = await toggleBookmark(activeTargetId, card.type);
    if (onCardUpdate && updated) onCardUpdate(updated);
  };

  const handleCardClick = (e) => {
    // Ignore card click if clicking a direct link or copy button
    if (e.target.closest('a') || e.target.closest('.copy-btn-action')) return;
    if (onSelectCard) onSelectCard(card);
  };

  const titleText = card.title || card.content?.title || card.metadata?.url || card.content?.url || "Untitled Configuration";
  const descText = card.metadata?.description || card.content?.notes || card.content?.body || "";
  const isBookmarkedState = card.isBookmarked || false;
  const accent = accentFor(card.type);

  const renderCardContent = () => {
    switch(card.type) {
      case 'GitHub Repository':
      case 'repos':
        return (
          <div className="space-y-3">
            <p className="text-[#5F5B7A] dark:text-[#9CA3B5] text-sm leading-relaxed line-clamp-2">{descText}</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2 py-1 rounded bg-[#EDE9FE] text-[#5B21B6] dark:bg-[#8B5CF6]/10 dark:text-[#B084F5] border border-[#7C3AED]/20 dark:border-[#8B5CF6]/20 font-mono">
                {card.metadata?.language || "JavaScript"}
              </span>
              <span className="flex items-center gap-1 text-[#B45309] dark:text-[#FFB84D]">
                <Star strokeWidth={2} className="w-3.5 h-3.5 fill-[#FFB84D]" /> {card.metadata?.stars || 0}
              </span>
            </div>
          </div>
        );
      case 'Snippet':
      case 'snippets':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#0B7F6E] dark:text-[#3FE0C5] uppercase tracking-wider font-semibold">{card.metadata?.language || "Code"}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Don't trigger the card drawer when copying
                  navigator.clipboard.writeText(card.metadata?.code || descText);
                }}
                className="copy-btn-action text-[#5F5B7A] dark:text-[#9CA3B5] hover:text-[#0B7F6E] dark:hover:text-[#3FE0C5] transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <pre className="p-3 bg-[#1E1B3A] dark:bg-[#0B0E14]/60 rounded-lg text-xs font-mono text-[#7CF0DB] dark:text-[#3FE0C5] overflow-x-auto border border-[#1E1B3A] dark:border-white/5 shadow-inner">
              <code>{card.metadata?.code || descText}</code>
            </pre>
          </div>
        );
      case 'API Endpoint':
      case 'apis': {
        const method = (card.metadata?.httpMethod || card.content?.method || 'GET').toUpperCase();
        // Support auth arrays from metadata or legacy content objects
        const auth = Array.isArray(card.metadata?.auth)
          ? card.metadata.auth
          : (Array.isArray(card.content?.auth) ? card.content.auth : []);
        const authLabel = (auth.length === 0 || (auth.length === 1 && auth[0] === 'none'))
          ? "No auth"
          : auth.filter((a) => a !== 'none').map((a) => AUTH_LABELS[a] || a).join(' + ');
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className={`px-2 py-0.5 rounded font-bold ${METHOD_BADGE_CLASSES[method] || METHOD_BADGE_CLASSES.GET}`}>
                {method}
              </span>
              <span className="text-[#1E1B3A] dark:text-[#F5F6FA] truncate break-all">{card.metadata?.url || card.content?.url}</span>
            </div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#6D4AFF]/[0.07] dark:bg-white/[0.04] text-[#5F5B7A] dark:text-[#9CA3B5] border border-[#6D4AFF]/15 dark:border-white/[0.06]">
              {authLabel}
            </span>
            {descText && <p className="text-xs text-[#5F5B7A] dark:text-[#9CA3B5] line-clamp-2">{descText}</p>}
          </div>
        );
      }
      default:
        return <p className="text-[#5F5B7A] dark:text-[#9CA3B5] text-sm leading-relaxed line-clamp-3">{descText}</p>;
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-2xl border border-[#6D4AFF]/15 dark:border-white/[0.08] bg-gradient-to-b from-white to-[#F7F5FF] hover:to-white dark:bg-none dark:bg-[#1A1D29]/60 backdrop-blur-xl p-5 shadow-[0_1px_2px_rgba(30,27,58,0.06),0_10px_28px_-12px_rgba(79,70,229,0.28)] dark:shadow-xl transition-all duration-300 hover:-translate-y-1 ${accent.hover} hover:shadow-[0_2px_4px_rgba(30,27,58,0.06),0_18px_36px_-12px_rgba(79,70,229,0.4)] dark:hover:shadow-[0_0_25px_rgba(233,79,209,0.15)] cursor-pointer select-none`}
    >
      <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${accent.bar} dark:hidden`} />
      <div className="flex justify-between items-start gap-2 mb-3">
        {dragHandleProps && (
          <button
            type="button"
            aria-label="Drag to reorder"
            title="Drag to reorder"
            {...dragHandleProps}
            onClick={(e) => e.stopPropagation()} // Grabbing the handle shouldn't open the drawer
            className="p-1.5 -ml-1 rounded-lg text-[#8A86A6] dark:text-[#9CA3B5] hover:text-[#6D28D9] dark:hover:text-[#3FE0C5] hover:bg-[#6D4AFF]/[0.08] dark:hover:bg-white/[0.06] cursor-grab active:cursor-grabbing touch-none flex-shrink-0 transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <span className={`text-[10px] uppercase font-bold tracking-widest ${accent.label} dark:text-[#9CA3B5]/60 block mb-1 font-mono`}>{card.type}</span>
          <h4 className="text-base font-medium text-[#1E1B3A] dark:text-[#F5F6FA] tracking-tight transition-colors dark:group-hover:text-white">{titleText}</h4>
        </div>
        
        <button 
          onClick={handleBookmarkClick}
          className="p-2 rounded-lg bg-[#6D4AFF]/[0.06] dark:bg-white/[0.04] border border-[#6D4AFF]/15 dark:border-white/[0.06] text-[#6B6788] dark:text-[#9CA3B5] hover:text-[#D6249F] dark:hover:text-[#E94FD1] transition-all flex-shrink-0"
        >
          {isBookmarkedState ? (
            <BookmarkFill className="w-4 h-4 text-[#E94FD1] drop-shadow-[0_0_8px_#E94FD1]" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {renderCardContent()}

      <div className="mt-4 pt-3 border-t border-[#6D4AFF]/10 dark:border-white/[0.06] flex justify-between items-center text-xs text-[#8A86A6] dark:text-zinc-500 font-mono">
        <span>ID: {(card._id || card.id || "SYNC").substring(0, 6)}</span>
        {(card.metadata?.url || card.content?.url) && (
          <a 
            href={card.metadata?.url || card.content?.url} 
            target="_blank" 
            rel="noreferrer" 
            className="text-[#6D28D9] dark:text-[#3FE0C5] font-medium hover:underline flex items-center gap-0.5 font-sans z-10"
          >
            Launch <ArrowUpRight className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
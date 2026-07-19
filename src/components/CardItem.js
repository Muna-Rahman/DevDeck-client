'use client';
import React from 'react';
import { useBookmarks } from '../context/BookmarkContext';
import { Bookmark, BookmarkFill, Star, ArrowUpRight, Copy } from '@gravity-ui/icons';

export default function CardItem({ card, onCardUpdate, onSelectCard }) {
  const { toggleBookmark } = useBookmarks();

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // CRITICAL: Stops the detail drawer from sliding open when just toggling bookmark status
    const activeTargetId = card._id || card.id;
    const updated = await toggleBookmark(activeTargetId);
    if (onCardUpdate && updated) onCardUpdate(updated);
  };

  const handleCardClick = (e) => {
    // If the user clicked the direct launch link or the copy button, don't trigger the layout drawer selection
    if (e.target.closest('a') || e.target.closest('.copy-btn-action')) return;
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
          <div className="space-y-3">
            <p className="text-[#9CA3B5] dark:text-[#9CA3B5] light:text-[#5B5F72] text-sm line-clamp-2">{descText}</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2 py-1 rounded bg-[#8B5CF6]/10 text-[#B084F5] border border-[#8B5CF6]/20 font-mono">
                {card.metadata?.language || "JavaScript"}
              </span>
              <span className="flex items-center gap-1 text-[#FFB84D]">
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
              <span className="text-xs text-[#3FE0C5] uppercase tracking-wider font-semibold">{card.metadata?.language || "Code"}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent modal popup on copy utility engagement
                  navigator.clipboard.writeText(card.metadata?.code || descText);
                }}
                className="copy-btn-action text-[#9CA3B5] hover:text-[#3FE0C5] transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <pre className="p-3 bg-[#0B0E14]/60 rounded-lg text-xs font-mono text-[#3FE0C5] overflow-x-auto border border-white/5">
              <code>{card.metadata?.code || descText}</code>
            </pre>
          </div>
        );
      case 'API Endpoint':
      case 'apis':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className={`px-2 py-0.5 rounded font-bold ${
                card.metadata?.httpMethod === 'POST' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {card.metadata?.httpMethod || 'GET'}
              </span>
              <span className="text-[#F5F6FA] dark:text-[#F5F6FA] light:text-[#1A1D29] truncate break-all">{card.metadata?.url || card.content?.url}</span>
            </div>
            {descText && <p className="text-xs text-[#9CA3B5] light:text-[#5B5F72] line-clamp-2">{descText}</p>}
          </div>
        );
      default:
        return <p className="text-[#9CA3B5] dark:text-[#9CA3B5] light:text-[#5B5F72] text-sm line-clamp-3">{descText}</p>;
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative rounded-2xl border border-white/[0.08] bg-[#1A1D29]/60 backdrop-blur-xl p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(233,79,209,0.15)] cursor-pointer select-none"
    >
      <div className="flex justify-between items-start gap-2 mb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3B5]/60 block mb-1 font-mono">{card.type}</span>
          <h4 className="text-base font-medium text-[#F5F6FA] tracking-tight transition-colors group-hover:text-white">{titleText}</h4>
        </div>
        
        <button 
          onClick={handleBookmarkClick}
          className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#9CA3B5] hover:text-[#E94FD1] transition-all flex-shrink-0"
        >
          {isBookmarkedState ? (
            <BookmarkFill className="w-4 h-4 text-[#E94FD1] drop-shadow-[0_0_8px_#E94FD1]" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {renderCardContent()}

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex justify-between items-center text-xs text-zinc-500 font-mono">
        <span>ID: {(card._id || card.id || "SYNC").substring(0, 6)}</span>
        {(card.metadata?.url || card.content?.url) && (
          <a 
            href={card.metadata?.url || card.content?.url} 
            target="_blank" 
            rel="noreferrer" 
            className="text-[#3FE0C5] hover:underline flex items-center gap-0.5 font-sans z-10"
          >
            Launch <ArrowUpRight className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
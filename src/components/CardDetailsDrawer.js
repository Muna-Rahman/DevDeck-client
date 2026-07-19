'use client';
import React, { useEffect, useState } from 'react';
import { Bookmark, BookmarkFill, Xmark, ArrowUpRight, Copy, ArrowLeft } from '@gravity-ui/icons'; 

export default function CardDetailsDrawer({ card, onClose, onToggleBookmark }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Force-checks the state of the HTML root element class to ensure theme syncing works perfectly
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);

      // Mutation observer to capture instant dark/light mode toggles while the card modal is open
      const observer = new MutationObserver(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
  }, []);

  if (!card) return null;

  const titleText = card.title || card.content?.title || card.metadata?.url || card.content?.url || "Untitled Asset";
  const descText = card.metadata?.description || card.content?.notes || card.content?.body || "No workspace text parameters specified.";
  const isBookmarkedState = card.isBookmarked || false;

  const handleReturnAction = (e) => {
    e.preventDefault();
    onClose(); 
  };

  return (
    // FULL-SCREEN BLUR LAYER
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 min-h-screen overflow-y-auto backdrop-blur-md transition-all duration-300 ${
      isDarkMode ? 'bg-[#0B0E14]/60' : 'bg-[#EBEDF5]/60'
    }`}>
      
      {/* ATMOSPHERIC GRADIENT STREAKS BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[300px] rotate-[-35deg] rounded-full mix-blend-screen opacity-20 dark:opacity-20 light:opacity-10 bg-gradient-to-r from-[#E94FD1] via-[#8B5CF6] to-transparent blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[250px] rotate-[-35deg] rounded-full mix-blend-screen opacity-15 dark:opacity-15 light:opacity-10 bg-gradient-to-r from-[#3FE0C5] via-[#2FD1FF] to-transparent blur-[90px]" />
      </div>

      <div className="absolute inset-0" onClick={onClose} />

      {/* 
        CENTERED ULTRA-FROSTED THEME-REACTIVE CARD 
        Uses explicit state conditions to guarantee the background shifts from dark slate to frosted white.
      */}
      <div className={`relative w-full max-w-2xl border rounded-2xl p-6 md:p-8 flex flex-col justify-between max-h-[90vh] z-10 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-[#1A1D29]/85 border-white/[0.08] backdrop-blur-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] text-[#F5F6FA]' 
          : 'bg-white/90 border-black/[0.08] backdrop-blur-[40px] shadow-[0_20px_50px_rgba(20,20,40,0.12)] text-[#1A1D29]'
      }`}>
        
        <div className="flex flex-col min-h-0">
          {/* Header Action Row */}
          <div className={`flex items-center justify-between mb-6 pb-4 border-b ${
            isDarkMode ? 'border-white/[0.06]' : 'border-black/[0.06]'
          }`}>
            <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border rounded ${
              isDarkMode ? 'bg-white/5 border-white/10 text-[#3FE0C5]' : 'bg-black/5 border-black/5 text-[#0FB8A6]'
            }`}>
              {card.type}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onToggleBookmark(card._id || card.id)}
                className={`p-2 rounded-lg border transition-all ${
                  isDarkMode 
                    ? 'bg-white/[0.02] border-white/[0.06] text-[#9CA3B5] hover:text-[#E94FD1]' 
                    : 'bg-black/[0.02] border-black/[0.06] text-[#5B5F72] hover:text-[#D6249F]'
                }`}
              >
                {isBookmarkedState ? (
                  <BookmarkFill className={`w-4 h-4 ${isDarkMode ? 'text-[#E94FD1] drop-shadow-[0_0_8px_#E94FD1]' : 'text-[#D6249F]'}`} />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
              <button 
                onClick={onClose} 
                className={`p-2 rounded-lg border transition-all ${
                  isDarkMode ? 'bg-white/[0.02] border-white/[0.06] text-[#9CA3B5] hover:text-white' : 'bg-black/[0.02] border-black/[0.06] text-[#5B5F72] hover:text-[#1A1D29]'
                }`}
              >
                <Xmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title Header */}
          <h2 className={`text-xl md:text-2xl font-medium tracking-tight mb-6 ${
            isDarkMode ? 'text-[#F5F6FA]' : 'text-[#1A1D29]'
          }`}>
            {titleText}
          </h2>

          {/* Inner Content Scrolling Matrix */}
          <div className="space-y-6 overflow-y-auto pr-2 min-h-0 scrollbar-none">
            
            {/* Code Snippets Variant */}
            {card.metadata?.code && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
                  <span>Code Preview ({card.metadata.language || "Plain Text"})</span>
                  <button 
                    onClick={() => copyToClipboard(card.metadata.code)}
                    className={`hover:underline flex items-center gap-1 ${isDarkMode ? 'text-[#3FE0C5]' : 'text-[#0FB8A6]'}`}
                  >
                    <Copy className="w-3 h-3" /> Copy Source
                  </button>
                </div>
                <pre className={`p-4 rounded-xl text-xs font-mono border max-h-60 shadow-inner overflow-x-auto ${
                  isDarkMode ? 'bg-[#0B0E14]/90 border-white/5 text-[#3FE0C5]' : 'bg-[#EBEDF5]/90 border-black/5 text-[#0FB8A6]'
                }`}>
                  <code>{card.metadata.code}</code>
                </pre>
              </div>
            )}

            {/* API Endpoint HTTP Block Rows */}
            {card.metadata?.httpMethod && (
              <div className={`p-3.5 rounded-xl border font-mono text-xs flex items-center gap-3 shadow-sm ${
                isDarkMode ? 'bg-[#0B0E14]/90 border-white/5' : 'bg-[#EBEDF5]/90 border-black/5'
              }`}>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  card.metadata.httpMethod === 'POST' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {card.metadata.httpMethod}
                </span>
                <span className={`truncate break-all ${isDarkMode ? 'text-white' : 'text-[#1A1D29]'}`}>
                  {card.metadata.url || card.content?.url}
                </span>
              </div>
            )}

            {/* GitHub Stars Stats Badges Layout */}
            {card.metadata?.stars !== undefined && (
              <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl border text-xs font-mono ${
                isDarkMode ? 'bg-white/[0.01] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]'
              }`}>
                <div>
                  <span className="text-zinc-500 block">Language Asset</span>
                  <span className={`font-semibold mt-0.5 block ${isDarkMode ? 'text-[#B084F5]' : 'text-[#7C3AED]'}`}>{card.metadata.language || "N/A"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Repository Stars</span>
                  <span className={`font-semibold mt-0.5 block ${isDarkMode ? 'text-[#FFB84D]' : 'text-[#E8940F]'}`}>★ {card.metadata.stars}</span>
                </div>
              </div>
            )}

            {/* Workspace Core Meta Notes Section */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-mono font-bold text-zinc-500 tracking-wider block">
                Workspace Notes / Specs
              </span>
              <div className={`p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap ${
                isDarkMode 
                  ? 'bg-black/[0.08] border-white/[0.04] text-[#9CA3B5]' 
                  : 'bg-black/[0.02] border-black/[0.03] text-[#5B5F72]'
              }`}>
                {descText}
              </div>
            </div>

            {/* Custom tags pill line */}
            {card.tags && card.tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs uppercase font-mono font-bold text-zinc-500 tracking-wider block">
                  Assigned Identifiers
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {card.tags.map(tag => (
                    <span key={tag} className={`text-xs px-2.5 py-0.5 rounded-full border font-mono ${
                      isDarkMode ? 'bg-white/5 border-white/5 text-zinc-400' : 'bg-black/5 border-black/5 text-zinc-500'
                    }`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Action Row Footers Bar */}
        <div className={`pt-5 mt-6 border-t flex items-center justify-between text-xs font-mono ${
          isDarkMode ? 'border-white/[0.06] text-zinc-600' : 'border-black/[0.06] text-zinc-400'
        }`}>
          <button 
            onClick={handleReturnAction}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 border rounded-xl transition-all font-sans font-medium shadow-sm ${
              isDarkMode 
                ? 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.04]' 
                : 'border-black/5 bg-black/[0.02] text-[#5B5F72] hover:text-[#1A1D29] hover:bg-black/[0.04]'
            }`}
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isDarkMode ? 'text-[#3FE0C5]' : 'text-[#0FB8A6]'}`} /> Return to Deck
          </button>

          {(card.metadata?.url || card.content?.url) && (
            <a 
              href={card.metadata?.url || card.content?.url} 
              target="_blank" 
              rel="noreferrer" 
              className={`px-4 py-2 font-sans font-bold rounded-xl flex items-center gap-1 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-[#3FE0C5] to-[#2FD1FF] text-[#12141C]' 
                  : 'bg-gradient-to-r from-[#0FB8A6] to-[#159FE0] text-white'
              }`}
            >
              Open Resource <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
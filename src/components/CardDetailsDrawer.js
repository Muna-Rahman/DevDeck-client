'use client';
import React, { useEffect, useState } from 'react';
import { Bookmark, BookmarkFill, Xmark, ArrowUpRight, Copy, ArrowLeft, Check, TrashBin, Pencil } from '@gravity-ui/icons'; 

export default function CardDetailsDrawer({ card, onClose, onToggleBookmark, onDelete, onUpdate }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable Form State
  const [titleText, setTitleText] = useState('');
  const [descText, setDescText] = useState('');
  const [codeText, setCodeText] = useState('');
  const [repoUrl, setRepoUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);

      const observer = new MutationObserver(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
  }, []);

  // Sync state with passed card prop
  useEffect(() => {
    if (card) {
      setTitleText(card.title || card.content?.title || card.metadata?.title || card.content?.repoUrl || card.content?.url || "Untitled Asset");
      setDescText(card.content?.notes || card.content?.description || card.metadata?.description || card.content?.body || card.description || '');
      setCodeText(card.content?.code || card.content?.snippet || card.metadata?.code || card.code || '');
      setRepoUrl(card.content?.repoUrl || card.content?.url || card.metadata?.url || card.url || '');
    }
  }, [card]);

  if (!card) return null;

  const cardId = card._id || card.id;
  const isBookmarkedState = card.isBookmarked || false;
  const languageText = card.content?.language || card.metadata?.language || card.language;
  const displayType = card.type || (repoUrl ? "GitHub Repository" : codeText ? "Snippet" : "Card");

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    const updatedCard = {
      ...card,
      title: titleText,
      content: {
        ...card.content,
        title: titleText,
        notes: descText,
        description: descText,
        code: codeText,
        repoUrl: repoUrl,
        url: repoUrl,
      },
    };
    if (onUpdate) onUpdate(updatedCard);
    setIsEditing(false);
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 min-h-screen overflow-y-auto backdrop-blur-md transition-all duration-300 ${
      isDarkMode ? 'bg-[#0B0E14]/60' : 'bg-[#EBEDF5]/60'
    }`}>
      
      <div className="absolute inset-0" onClick={onClose} />

      {/* CENTERED MODAL */}
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
              {displayType}
            </span>

            <div className="flex items-center gap-2">
              {/* EDIT BUTTON */}
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className={`p-2 rounded-lg border transition-all ${
                  isEditing 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                    : isDarkMode 
                    ? 'bg-white/[0.02] border-white/[0.06] text-[#9CA3B5] hover:text-white' 
                    : 'bg-black/[0.02] border-black/[0.06] text-[#5B5F72] hover:text-[#1A1D29]'
                }`}
                title="Edit Card"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* DELETE BUTTON */}
              {onDelete && (
                <button 
                  onClick={() => onDelete(cardId)} 
                  className="p-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  title="Delete Card"
                >
                  <TrashBin className="w-4 h-4" />
                </button>
              )}

              {/* BOOKMARK BUTTON */}
              <button 
                onClick={() => onToggleBookmark && onToggleBookmark(cardId)}
                className={`p-2 rounded-lg border transition-all ${
                  isDarkMode 
                    ? 'bg-white/[0.02] border-white/[0.06] text-[#9CA3B5] hover:text-[#E94FD1]' 
                    : 'bg-black/[0.02] border-black/[0.06] text-[#5B5F72] hover:text-[#D6249F]'
                }`}
              >
                {isBookmarkedState ? (
                  <BookmarkFill className={`w-4 h-4 ${isDarkMode ? 'text-[#E94FD1]' : 'text-[#D6249F]'}`} />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              {/* CLOSE BUTTON */}
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

          {/* EDIT FORM OR VIEW MODE */}
          {isEditing ? (
            <div className="space-y-4 mb-4">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Title</label>
                <input 
                  type="text" 
                  value={titleText} 
                  onChange={(e) => setTitleText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-sm font-medium bg-transparent border-white/10 focus:border-[#3FE0C5] outline-none"
                />
              </div>

              {repoUrl && (
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Resource URL</label>
                  <input 
                    type="text" 
                    value={repoUrl} 
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-sm font-mono bg-transparent border-white/10 focus:border-[#3FE0C5] outline-none"
                  />
                </div>
              )}

              {codeText && (
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Code Snippet</label>
                  <textarea 
                    rows={5}
                    value={codeText} 
                    onChange={(e) => setCodeText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs font-mono bg-transparent border-white/10 focus:border-[#3FE0C5] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Notes / Description</label>
                <textarea 
                  rows={3}
                  value={descText} 
                  onChange={(e) => setDescText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-xs bg-transparent border-white/10 focus:border-[#3FE0C5] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="px-4 py-2 text-xs rounded-xl border border-white/10 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit} 
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#3FE0C5] text-[#12141C] hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Title Header */}
              <h2 className={`text-xl md:text-2xl font-medium tracking-tight mb-6 ${
                isDarkMode ? 'text-[#F5F6FA]' : 'text-[#1A1D29]'
              }`}>
                {titleText}
              </h2>

              {/* Inner Content Matrix */}
              <div className="space-y-6 overflow-y-auto pr-2 min-h-0 scrollbar-none">
                
                {repoUrl && (
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono font-bold text-zinc-500 tracking-wider block">
                      Resource URL
                    </span>
                    <div className={`p-3.5 rounded-xl border font-mono text-xs flex items-center justify-between gap-3 ${
                      isDarkMode ? 'bg-[#0B0E14]/90 border-white/5' : 'bg-[#EBEDF5]/90 border-black/5'
                    }`}>
                      <a 
                        href={repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className={`truncate hover:underline ${isDarkMode ? 'text-[#3FE0C5]' : 'text-[#0FB8A6]'}`}
                      >
                        {repoUrl}
                      </a>
                      <button 
                        onClick={() => copyToClipboard(repoUrl)}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors text-zinc-400 hover:text-white shrink-0"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {codeText && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
                      <span>Code Preview ({languageText || "Plain Text"})</span>
                      <button 
                        onClick={() => copyToClipboard(codeText)}
                        className={`hover:underline flex items-center gap-1 ${isDarkMode ? 'text-[#3FE0C5]' : 'text-[#0FB8A6]'}`}
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy Source
                      </button>
                    </div>
                    <pre className={`p-4 rounded-xl text-xs font-mono border max-h-60 shadow-inner overflow-x-auto ${
                      isDarkMode ? 'bg-[#0B0E14]/90 border-white/5 text-[#3FE0C5]' : 'bg-[#EBEDF5]/90 border-black/5 text-[#0FB8A6]'
                    }`}>
                      <code>{codeText}</code>
                    </pre>
                  </div>
                )}

                {descText && (
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono font-bold text-zinc-500 tracking-wider block">
                      Workspace Notes
                    </span>
                    <div className={`p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap ${
                      isDarkMode ? 'bg-black/[0.08] border-white/[0.04] text-[#9CA3B5]' : 'bg-black/[0.02] border-black/[0.03] text-[#5B5F72]'
                    }`}>
                      {descText}
                    </div>
                  </div>
                )}

              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`pt-5 mt-6 border-t flex items-center justify-between text-xs font-mono ${
          isDarkMode ? 'border-white/[0.06] text-zinc-600' : 'border-black/[0.06] text-zinc-400'
        }`}>
          <button 
            onClick={onClose}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 border rounded-xl transition-all font-sans font-medium ${
              isDarkMode 
                ? 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white' 
                : 'border-black/5 bg-black/[0.02] text-[#5B5F72] hover:text-[#1A1D29]'
            }`}
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isDarkMode ? 'text-[#3FE0C5]' : 'text-[#0FB8A6]'}`} /> Return to Deck
          </button>

          {repoUrl && (
            <a 
              href={repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`} 
              target="_blank" 
              rel="noreferrer" 
              className={`px-4 py-2 font-sans font-bold rounded-xl flex items-center gap-1 shadow-md hover:scale-[1.02] transition-all ${
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
'use client';
import React, { useEffect, useState } from 'react';
import { Bookmark, BookmarkFill, Xmark, ArrowUpRight, Copy, ArrowLeft, Check, TrashBin, Pencil } from '@gravity-ui/icons';

export default function CardDetailsDrawer({ card, onClose, onToggleBookmark, onDelete, onUpdate }) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable Form State
  const [titleText, setTitleText] = useState('');
  const [descText, setDescText] = useState('');
  const [codeText, setCodeText] = useState('');
  const [repoUrl, setRepoUrl] = useState('');

  // Whether this card actually HAS a code field at all. Computed once from
  // the card as it arrived (not from live `codeText`, and not from
  // `metadata.code !== undefined` — the backend always includes
  // `metadata.code` as "" for every card type, so that check was true for
  // every single card and forced a "Code snippet can't be empty" error on
  // cards that never had code in the first place, e.g. Notes/Ideas/Links).
  const [hasCodeField, setHasCodeField] = useState(false);

  // Sync state with passed card prop
  useEffect(() => {
    if (card) {
      const initialCode = card.content?.code || card.content?.snippet || card.metadata?.code || card.code || '';
      setTitleText(card.title || card.content?.title || card.metadata?.title || card.content?.repoUrl || card.content?.url || "Untitled Asset");
      setDescText(card.content?.notes || card.content?.description || card.metadata?.description || card.content?.body || card.description || '');
      setCodeText(initialCode);
      setRepoUrl(card.content?.repoUrl || card.content?.url || card.metadata?.url || card.url || '');
      setHasCodeField(Boolean(initialCode) || card.type === 'Snippet' || card.type === 'snippets');
      setIsEditing(false);
      setIsSaving(false);
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

  const isValidHttpUrl = (candidate) => {
    if (!candidate) return false;
    try {
      const parsed = new URL(candidate.trim());
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSaveEdit = async () => {
    if (!titleText.trim()) {
      alert("Title can't be empty.");
      return;
    }
    // Only enforce these when the field is actually part of this card (the
    // drawer only shows the URL/code inputs when the card already has that
    // content), so a plain note or idea card isn't held to a URL/code rule
    // that never applied to it.
    if (repoUrl && !isValidHttpUrl(repoUrl.startsWith("http") ? repoUrl : `https://${repoUrl}`)) {
      alert("That doesn't look like a valid URL.");
      return;
    }
    // Use `hasCodeField` (computed once, from the card as loaded) instead of
    // checking `metadata.code !== undefined` — the backend always stores
    // `metadata.code` as "" for every card type, so that old check fired for
    // every non-snippet card even though the code field wasn't shown at all.
    if (hasCodeField && !codeText.trim()) {
      alert("Code snippet can't be empty.");
      return;
    }

    const updatedCard = {
      ...card,
      title: titleText,
      content: {
        ...card.content,
        title: titleText,
        notes: descText,
        description: descText,
        ...(hasCodeField ? { code: codeText } : {}),
        repoUrl: repoUrl,
        url: repoUrl,
      },

      metadata: {
        ...card.metadata,
        description: descText,
        ...(hasCodeField ? { code: codeText } : {}),
        url: repoUrl,
      },
    };

    if (!onUpdate) {
      setIsEditing(false);
      return;
    }

    // Wait for the actual save to succeed before leaving edit mode. Before,
    // this called onUpdate() without awaiting it and closed the edit form
    // immediately — so on any save failure (network error, validation
    // error, etc.) the drawer would still flip back to "view" mode showing
    // the locally-edited (unsaved) text, making it look like the save had
    // gone through when the server never actually persisted it.
    setIsSaving(true);
    try {
      const result = await onUpdate(updatedCard);
      // Treat only an explicit `false` as failure so this stays compatible
      // with callers that don't return anything yet.
      if (result !== false) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };


  const inputBaseClass = "w-full p-2.5 rounded-xl border text-sm bg-black/[0.02] dark:bg-white/5 border-black/10 dark:border-white/10 text-[#1A1D29] dark:text-[#F5F6FA] focus:border-[#0FB8A6] dark:focus:border-[#3FE0C5] focus:outline-none transition-colors";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 min-h-screen overflow-y-auto backdrop-blur-md transition-all duration-300 bg-[#EBEDF5]/60 dark:bg-[#0B0E14]/70">

      <div className="absolute inset-0" onClick={onClose} />

    
      <div className="relative w-full max-w-2xl lg:max-w-3xl border rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col justify-between max-h-[90vh] z-10 transition-all duration-300 bg-white/90 dark:bg-[#1A1D29]/85 border-black/[0.08] dark:border-white/[0.08] backdrop-blur-[40px] shadow-[0_20px_50px_rgba(20,20,40,0.12)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] text-[#1A1D29] dark:text-[#F5F6FA]">

        <div className="flex flex-col min-h-0">
          {/* Header Action Row — wraps instead of overflowing on narrow screens */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border rounded bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-[#0FB8A6] dark:text-[#3FE0C5]">
              {displayType}
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {/* EDIT BUTTON */}
              <button
                onClick={() => !isSaving && setIsEditing(!isEditing)}
                disabled={isSaving}
                className={`p-2 rounded-lg border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isEditing
                    ? 'bg-amber-500/20 border-amber-500 text-amber-500 dark:text-amber-400'
                    : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.06] text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-white'
                }`}
                title="Edit Card"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* DELETE BUTTON */}
              {onDelete && (
                <button
                  onClick={() => onDelete(cardId)}
                  className="p-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                  title="Delete Card"
                >
                  <TrashBin className="w-4 h-4" />
                </button>
              )}

              {/* BOOKMARK BUTTON */}
              <button
                onClick={() => onToggleBookmark && onToggleBookmark(cardId, card.type)}
                className="p-2 rounded-lg border transition-all cursor-pointer bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.06] text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#D6249F] dark:hover:text-[#E94FD1]"
              >
                {isBookmarkedState ? (
                  <BookmarkFill className="w-4 h-4 text-[#D6249F] dark:text-[#E94FD1]" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="p-2 rounded-lg border transition-all cursor-pointer bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.06] text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-white"
              >
                <Xmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* EDIT FORM OR VIEW MODE */}
          {isEditing ? (
            <div className="space-y-4 mb-4">
              <div>
                <label className="text-xs font-mono text-[#5B5F72] dark:text-[#9CA3B5] block mb-1">Title</label>
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  className={`${inputBaseClass} font-medium`}
                />
              </div>

              {repoUrl && (
                <div>
                  <label className="text-xs font-mono text-[#5B5F72] dark:text-[#9CA3B5] block mb-1">Resource URL</label>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className={`${inputBaseClass} font-mono`}
                  />
                </div>
              )}

              {hasCodeField && (
                <div>
                  <label className="text-xs font-mono text-[#5B5F72] dark:text-[#9CA3B5] block mb-1">Code Snippet</label>
                  <textarea
                    rows={5}
                    value={codeText}
                    onChange={(e) => setCodeText(e.target.value)}
                    className={`${inputBaseClass} font-mono text-xs resize-y max-h-96`}
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-mono text-[#5B5F72] dark:text-[#9CA3B5] block mb-1">Notes / Description</label>
                <textarea
                  rows={3}
                  value={descText}
                  onChange={(e) => setDescText(e.target.value)}
                  className={`${inputBaseClass} text-xs resize-y max-h-72`}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0FB8A6] dark:bg-[#3FE0C5] text-white dark:text-[#12141C] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Title Header */}
              <h2 className="text-xl md:text-2xl font-medium tracking-tight mb-6 text-[#1A1D29] dark:text-[#F5F6FA] break-words">
                {titleText}
              </h2>

              {/* Inner Content Matrix — this whole area scrolls, so any
                  combination of long title/URL/code/notes stays contained
                  inside the modal instead of pushing it off-screen. */}
              <div className="space-y-6 overflow-y-auto pr-2 min-h-0 scrollbar-none">

                {repoUrl && (
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono font-bold text-zinc-500 tracking-wider block">
                      Resource URL
                    </span>
                    <div className="p-3.5 rounded-xl border font-mono text-xs flex flex-wrap items-center justify-between gap-3 bg-[#EBEDF5]/90 dark:bg-[#0B0E14]/90 border-black/5 dark:border-white/5">
                      <a
                        href={repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate hover:underline text-[#0FB8A6] dark:text-[#3FE0C5] min-w-0 flex-1"
                      >
                        {repoUrl}
                      </a>
                      <button
                        onClick={() => copyToClipboard(repoUrl)}
                        className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors text-zinc-400 hover:text-[#1A1D29] dark:hover:text-white shrink-0 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {codeText && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-mono text-zinc-500">
                      <span>Code Preview ({languageText || "Plain Text"})</span>
                      <button
                        onClick={() => copyToClipboard(codeText)}
                        className="hover:underline flex items-center gap-1 text-[#0FB8A6] dark:text-[#3FE0C5] cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy Source
                      </button>
                    </div>
                    {/* max-h + overflow-y-auto (not just overflow-x-auto) so
                        large files scroll inside their own box instead of
                        spilling past it and breaking the modal's layout. */}
                    <pre className="p-4 rounded-xl text-xs font-mono border max-h-56 sm:max-h-72 md:max-h-96 shadow-inner overflow-auto bg-[#EBEDF5]/90 dark:bg-[#0B0E14]/90 border-black/5 dark:border-white/5 text-[#0FB8A6] dark:text-[#3FE0C5]">
                      <code>{codeText}</code>
                    </pre>
                  </div>
                )}

                {descText && (
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono font-bold text-zinc-500 tracking-wider block">
                      Workspace Notes
                    </span>
                    <div className="p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto bg-black/[0.02] dark:bg-black/[0.08] border-black/[0.03] dark:border-white/[0.04] text-[#5B5F72] dark:text-[#9CA3B5]">
                      {descText}
                    </div>
                  </div>
                )}

              </div>
            </>
          )}
        </div>

        {/* Footer — stacks on small screens instead of squeezing side by side */}
        <div className="pt-5 mt-6 border-t flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono border-black/[0.06] dark:border-white/[0.06] text-zinc-400 dark:text-zinc-600">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border rounded-xl transition-all font-sans font-medium cursor-pointer border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-[#5B5F72] dark:text-zinc-400 hover:text-[#1A1D29] dark:hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0FB8A6] dark:text-[#3FE0C5]" /> Return to Deck
          </button>

          {repoUrl && (
            <a
              href={repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 font-sans font-bold rounded-xl flex items-center justify-center gap-1 shadow-md hover:scale-[1.02] transition-all bg-gradient-to-r from-[#0FB8A6] to-[#159FE0] dark:from-[#3FE0C5] dark:to-[#2FD1FF] text-white dark:text-[#12141C]"
            >
              Open Resource <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
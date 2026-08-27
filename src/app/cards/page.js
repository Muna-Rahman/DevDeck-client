'use client';
import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Bookmark, BookmarkFill, Xmark, ArrowUpRight, Copy, ArrowLeft, Check, TrashBin, Pencil } from '@gravity-ui/icons';

// Auth options and display labels matching CreateCardModal
const AUTH_OPTIONS = ["none", "bearer", "apikey", "basic"];
const AUTH_LABELS = { none: "None", bearer: "Bearer Token", apikey: "API Key", basic: "Basic" };

// Languages that Monaco natively parses and reports syntax errors for — keep in
// sync with CreateCardModal so "no linting available" languages behave the same
// way in both the create and edit paths.
const MONACO_VALIDATED_LANGUAGES = ["javascript", "typescript", "json"];

// Color mapping for HTTP method badges
const METHOD_BADGE_CLASSES = {
  GET: "bg-emerald-500/20 text-emerald-400",
  POST: "bg-sky-500/20 text-sky-400",
  PUT: "bg-amber-500/20 text-amber-400",
  PATCH: "bg-orange-500/20 text-orange-400",
  DELETE: "bg-rose-500/20 text-rose-400",
};

export default function CardDetailsDrawer({ card, onClose, onToggleBookmark, onDelete, onUpdate, existingItems = [] }) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable Form State
  const [titleText, setTitleText] = useState('');
  const [descText, setDescText] = useState('');
  const [codeText, setCodeText] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  
  // API endpoint configuration state
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiAuth, setApiAuth] = useState([]);

  // Check if the card includes code content (prevents false validation errors on notes/ideas)
  const [hasCodeField, setHasCodeField] = useState(false);

  // Capture Monaco editor diagnostics for the code being edited, same as CreateCardModal
  const [codeSyntaxErrors, setCodeSyntaxErrors] = useState([]);

  // Sync state with incoming card prop
  useEffect(() => {
    if (card) {
      const initialCode = card.content?.code || card.content?.snippet || card.metadata?.code || card.code || '';
      setTitleText(card.title || card.content?.title || card.metadata?.title || card.content?.repoUrl || card.content?.url || "Untitled Asset");
      setDescText(card.content?.notes || card.content?.description || card.metadata?.description || card.content?.body || card.description || '');
      setCodeText(initialCode);
      setRepoUrl(card.content?.repoUrl || card.content?.url || card.metadata?.url || card.url || '');
      setHasCodeField(Boolean(initialCode) || card.type === 'Snippet' || card.type === 'snippets');
      setApiMethod((card.metadata?.httpMethod || card.content?.method || 'GET').toUpperCase());
      setApiAuth(Array.isArray(card.metadata?.auth) ? card.metadata.auth : (Array.isArray(card.content?.auth) ? card.content.auth : []));
      setIsEditing(false);
      setIsSaving(false);
      setCodeSyntaxErrors([]);
    }
  }, [card]);

  if (!card) return null;

  const cardId = card._id || card.id;
  const isBookmarkedState = card.isBookmarked || false;
  const languageText = card.content?.language || card.metadata?.language || card.language;
  const displayType = card.type || (repoUrl ? "GitHub Repository" : codeText ? "Snippet" : "Card");
  const isApiCard = card.type === 'API Endpoint' || card.type === 'apis';

  const toggleApiAuth = (value) => {
    setApiAuth((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

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

  // Custom editor theme — kept identical to CreateCardModal so snippets look
  // the same whether you're creating or editing one.
  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("devdeck-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6272a4", fontStyle: "italic" },
        { token: "keyword", foreground: "E94FD1", fontStyle: "bold" },
        { token: "string", foreground: "3FE0C5" },
        { token: "number", foreground: "FFB84D" },
        { token: "variable", foreground: "F5F6FA" },
        { token: "function", foreground: "2FD1FF" },
      ],
      colors: {
        "editor.background": "#0B0E14",
        "editor.foreground": "#F5F6FA",
        "editor.lineHighlightBackground": "#1A1D2980",
        "editorCursor.foreground": "#3FE0C5",
        "editorLineNumber.foreground": "#9CA3B540",
        "editorLineNumber.activeForeground": "#3FE0C5",
        "editor.selectionBackground": "#E94FD140",
        "editorIndentGuide.background": "#ffffff10",
        "editorIndentGuide.activeBackground": "#3FE0C550",
      },
    });
  };

  // Capture Monaco editor diagnostics
  const handleCodeValidate = (markers) => {
    setCodeSyntaxErrors(markers.filter((m) => m.severity === 8)); // 8 is Monaco's MarkerSeverity.Error
  };

  // Look for another already-saved item with the exact same code (and
  // language, when known) so we can block the save client-side instead of
  // only finding out after a round trip to the server.
  const findDuplicateSibling = () => {
    if (!hasCodeField || !Array.isArray(existingItems) || existingItems.length === 0) return null;

    const normalizedCode = codeText.trim();
    if (!normalizedCode) return null;

    const normalizedLanguage = (languageText || '').trim().toLowerCase();

    return existingItems.find((item) => {
      const itemId = (item._id || item.id)?.toString();
      if (itemId && itemId === cardId?.toString()) return false; // skip self

      const itemType = item.type;
      const isSnippetLike = itemType === 'Snippet' || itemType === 'snippets';
      if (!isSnippetLike) return false;

      const itemCode = (item.content?.code || item.content?.snippet || item.metadata?.code || item.code || '').trim();
      if (!itemCode || itemCode !== normalizedCode) return false;

      const itemLanguage = (item.content?.language || item.metadata?.language || item.language || '').trim().toLowerCase();
      return itemLanguage === normalizedLanguage;
    }) || null;
  };

  const handleSaveEdit = async () => {
    if (!titleText.trim()) {
      alert("Title can't be empty.");
      return;
    }
    
    // Only validate URL if the card actually has one
    if (repoUrl && !isValidHttpUrl(repoUrl.startsWith("http") ? repoUrl : `https://${repoUrl}`)) {
      alert("That doesn't look like a valid URL.");
      return;
    }
    
    // Validate code only if this card type uses code snippets
    if (hasCodeField && !codeText.trim()) {
      alert("Code snippet can't be empty.");
      return;
    }

    // Block saving code that Monaco has flagged as having syntax errors —
    // same gate CreateCardModal applies when a snippet is first added.
    if (hasCodeField && MONACO_VALIDATED_LANGUAGES.includes((languageText || '').toLowerCase()) && codeSyntaxErrors.length > 0) {
      alert(`Fix ${codeSyntaxErrors.length} syntax error(s) in the code before saving.`);
      return;
    }

    // Block saving if the edited code is identical to another snippet already saved.
    if (findDuplicateSibling()) {
      alert("A snippet with this exact code already exists — it wasn't saved again.");
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
        // Persist updated API method and auth settings
        ...(isApiCard ? { method: apiMethod, auth: apiAuth } : {}),
      },

      metadata: {
        ...card.metadata,
        description: descText,
        ...(hasCodeField ? { code: codeText } : {}),
        url: repoUrl,
        ...(isApiCard ? { httpMethod: apiMethod, auth: apiAuth } : {}),
      },
    };

    if (!onUpdate) {
      setIsEditing(false);
      return;
    }

    // Await update resolution before closing edit view to avoid desync on failure
    setIsSaving(true);
    try {
      const result = await onUpdate(updatedCard);
      // Treat only an explicit false as failure for backwards compatibility
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

      {/* Main drawer card container */}
      <div className="relative w-full max-w-2xl lg:max-w-3xl border rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col justify-between max-h-[90vh] z-10 transition-all duration-300 bg-white/90 dark:bg-[#1A1D29]/85 border-black/[0.08] dark:border-white/[0.08] backdrop-blur-[40px] shadow-[0_20px_50px_rgba(20,20,40,0.12)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] text-[#1A1D29] dark:text-[#F5F6FA]">

        <div className="flex flex-col min-h-0">
          {/* Header Action Row */}
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
                  <label className="text-xs font-mono text-[#5B5F72] dark:text-[#9CA3B5] block mb-1">
                    {isApiCard ? "Endpoint URL" : "Resource URL"}
                  </label>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className={`${inputBaseClass} font-mono`}
                  />
                </div>
              )}

              {isApiCard && (
                <div className="flex flex-col gap-3">
                  <div className="w-40">
                    <label className="text-xs font-mono text-[#5B5F72] dark:text-[#9CA3B5] block mb-1">Method</label>
                    <select
                      value={apiMethod}
                      onChange={(e) => setApiMethod(e.target.value)}
                      className={`${inputBaseClass} font-mono font-bold`}
                    >
                      {Object.keys(METHOD_BADGE_CLASSES).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#5B5F72] dark:text-[#9CA3B5] block mb-2">Authentication Requirements</label>
                    <div className="flex flex-wrap gap-4">
                      {AUTH_OPTIONS.map((authType) => (
                        <label key={authType} className="flex items-center gap-2 cursor-pointer select-none text-sm font-normal text-[#1A1D29] dark:text-[#F5F6FA]">
                          <input
                            type="checkbox"
                            checked={apiAuth.includes(authType)}
                            onChange={() => toggleApiAuth(authType)}
                            className="rounded border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-[#0FB8A6] dark:text-[#3FE0C5] focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                          />
                          <span>{AUTH_LABELS[authType]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {hasCodeField && (
                <div>
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
                    <label className="text-xs font-mono text-[#5B5F72] dark:text-[#9CA3B5] block">Code Snippet</label>
                    <span className="text-[10px] font-mono text-[#0FB8A6] dark:text-[#3FE0C5]">
                      {MONACO_VALIDATED_LANGUAGES.includes((languageText || '').toLowerCase()) ? "VS Code Intellisense Engine" : "Syntax highlighting only — not linted"}
                    </span>
                  </div>
                  <div className="border rounded-xl overflow-hidden shadow-inner bg-[#0B0E14] border-black/10 dark:border-white/10">
                    <Editor
                      height="220px"
                      language={languageText || 'javascript'}
                      theme="devdeck-theme"
                      beforeMount={handleEditorWillMount}
                      value={codeText}
                      onChange={(value) => setCodeText(value || '')}
                      onValidate={handleCodeValidate}
                      options={{
                        fontSize: 13,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        lineNumbers: "on",
                        folding: true,
                        autoClosingTags: true,
                        autoClosingBrackets: "always",
                        autoClosingQuotes: "always",
                        formatOnPaste: true,
                        padding: { top: 12, bottom: 12 },
                      }}
                    />
                  </div>
                  {MONACO_VALIDATED_LANGUAGES.includes((languageText || '').toLowerCase()) && codeSyntaxErrors.length > 0 && (
                    <p className="text-xs text-rose-500 mt-1.5 font-normal">
                      {codeSyntaxErrors.length} syntax error(s) — fix these before saving.
                    </p>
                  )}
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
                  disabled={isSaving || (hasCodeField && MONACO_VALIDATED_LANGUAGES.includes((languageText || '').toLowerCase()) && codeSyntaxErrors.length > 0)}
                  title={hasCodeField && codeSyntaxErrors.length > 0 ? "Fix the syntax errors in the editor first" : undefined}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0FB8A6] dark:bg-[#3FE0C5] text-white dark:text-[#12141C] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving…" : codeSyntaxErrors.length > 0 && hasCodeField ? "Fix Errors to Save" : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Title Header */}
              <h2 className="text-xl md:text-2xl font-medium tracking-tight mb-6 text-[#1A1D29] dark:text-[#F5F6FA] break-words">
                {titleText}
              </h2>

              {/* Scrollable details container */}
              <div className="space-y-6 overflow-y-auto pr-2 min-h-0 scrollbar-none">

                {isApiCard && (
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono font-bold text-zinc-500 tracking-wider block">
                      Request
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${METHOD_BADGE_CLASSES[apiMethod] || METHOD_BADGE_CLASSES.GET}`}>
                        {apiMethod}
                      </span>
                      <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                        {(apiAuth.length === 0 || (apiAuth.length === 1 && apiAuth[0] === 'none'))
                          ? "No authentication required"
                          : apiAuth.filter((a) => a !== 'none').map((a) => AUTH_LABELS[a] || a).join(' + ')}
                      </span>
                    </div>
                  </div>
                )}

                {repoUrl && (
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono font-bold text-zinc-500 tracking-wider block">
                      {isApiCard ? "Endpoint URL" : "Resource URL"}
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
                    {/* Auto-scroll container for long snippets */}
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

        {/* Footer actions */}
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
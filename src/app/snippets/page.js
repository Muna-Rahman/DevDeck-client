"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import AiAssistButton from "@/components/AiAssistButton";
import { 
  Search, 
  Plus, 
  Code2, 
  Copy, 
  Check, 
  Bookmark, 
  Trash2, 
  Sparkles,
  Filter,
  Terminal,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";

// Supported languages in Monaco
const LANGUAGES = [
  "All", 
  "typescript", 
  "javascript", 
  "python", 
  "html", 
  "css", 
  "cpp", 
  "java", 
  "go", 
  "rust", 
  "php", 
  "sql", 
  "json"
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Keep this in sync with the server's MIN_AI_INPUT_LENGTH in /api/ai/generate —
// both directions (code→description and description→code) need the same
// minimum amount of real content before the button is even enabled.
const MIN_AI_INPUT_LENGTH = 10;

export default function SnippetsPage() {
  const router = useRouter();
  const [snippets, setSnippets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [copiedId, setCopiedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New Snippet Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLang, setNewLang] = useState("javascript");
  const [newCode, setNewCode] = useState("");
  const [newTags, setNewTags] = useState("");
  const [editorErrors, setEditorErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch snippets from database on component mount
  useEffect(() => {
    fetchSnippets();
  }, []);

  // 1. Fetch Snippets
  const fetchSnippets = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/snippets`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSnippets(data);
      }
    } catch (err) {
      console.error("Failed to fetch snippets from database:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Save Snippet
  const handleCreateSnippet = async (e) => {
    e.preventDefault();
    if (!newTitle || !newCode || isSubmitting) return;

    const newSnippetData = {
      title: newTitle,
      description: newDesc,
      language: newLang,
      tags: newTags ? newTags.split(",").map((t) => t.trim()) : ["Code"],
      code: newCode,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/snippets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newSnippetData),
      });

      if (!res.ok) {
        throw new Error("Failed to save snippet");
      }

      const savedSnippet = await res.json();

      setSnippets((prev) => [savedSnippet, ...prev]);
      setIsModalOpen(false);

      // Reset Form
      setNewTitle("");
      setNewDesc("");
      setNewLang("javascript");
      setNewCode("");
      setNewTags("");
      setEditorErrors([]);
    } catch (err) {
      console.error("Error persisting snippet to database:", err);
      alert("Failed to save snippet to the database. Make sure Express server is running on http://localhost:3001");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Toggle Bookmark
  const toggleBookmark = async (id) => {
    const targetSnippet = snippets.find((item) => (item.id || item._id) === id);
    if (!targetSnippet) return;

    const updatedBookmarkedState = !targetSnippet.bookmarked;

    setSnippets((prev) =>
      prev.map((item) =>
        (item.id || item._id) === id ? { ...item, bookmarked: updatedBookmarkedState } : item
      )
    );

    try {
      await fetch(`${API_URL}/api/snippets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bookmarked: updatedBookmarkedState }),
      });
    } catch (err) {
      console.error("Failed to update bookmark in database:", err);
    }
  };

  // 4. Delete Snippet
  const handleDelete = async (id) => {
    setSnippets((prev) => prev.filter((item) => (item.id || item._id) !== id));

    try {
      await fetch(`${API_URL}/api/snippets/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to delete snippet from database:", err);
    }
  };

  // Configure Monaco before mounting to ignore missing module declarations
  const handleEditorWillMount = (monaco) => {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true, // Ignores missing module import errors (e.g. "react")
      noSyntaxValidation: false,  // Keeps syntax validation enabled (missing brackets, commas)
    });

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
  };

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Capture real-time syntax error markers from Monaco Editor
  const handleValidate = (markers) => {
    const errors = markers.filter(
      (m) => m.severity === 8 // 8 represents MarkerSeverity.Error in Monaco
    );
    setEditorErrors(errors);
  };

  // Filter Logic
  const filteredSnippets = snippets.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLang =
      selectedLanguage === "All" || item.language?.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearch && matchesLang;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0F1117] text-[#1A1D29] dark:text-[#F5F6FA] px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Section with Back Button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 text-[#5B5F72] dark:text-[#9CA3B5] hover:bg-black/[0.08] dark:hover:bg-white/10 hover:text-[#1A1D29] dark:hover:text-white transition-all active:scale-95 cursor-pointer shrink-0"
              title="Go Back"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D6249F] dark:text-[#FF6FB5] mb-1">
                <Sparkles size={14} />
                <span>IDE Workspace</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[#1A1D29] dark:text-white">Code Snippets</h1>
              <p className="text-sm text-[#5B5F72] dark:text-[#9CA3B5] mt-1">
                VS Code-powered snippet editor with IntelliSense, auto-suggestions, and linting.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] dark:from-[#D6249F] px-5 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(233,79,209,0.3)] hover:opacity-95 active:scale-95 transition-all gap-2 cursor-pointer w-fit"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Create Snippet</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/70 dark:bg-[#1A1D29]/65 border border-black/10 dark:border-white/8 rounded-2xl p-4 backdrop-blur-glass">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#5B5F72] dark:text-[#9CA3B5]">
              <Search size={16} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search snippets by title, tag, or description..."
              className="w-full h-10 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 pl-10 pr-4 text-xs tracking-wide text-[#1A1D29] dark:text-[#F5F6FA] outline-none transition-all focus:border-[#D6249F] dark:focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 max-w-full scrollbar-thin scrollbar-thumb-white/10">
            <Filter size={14} className="text-[#5B5F72] dark:text-[#9CA3B5] mr-1 hidden sm:block shrink-0" />
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  selectedLanguage === lang
                    ? "bg-[#D6249F] text-white shadow-[0_0_10px_rgba(214,36,159,0.3)]"
                    : "bg-black/[0.03] dark:bg-white/5 text-[#5B5F72] dark:text-[#9CA3B5] hover:bg-black/[0.08] dark:hover:bg-white/10 hover:text-[#1A1D29] dark:hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Snippets Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#5B5F72] dark:text-[#9CA3B5]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF6FB5] border-t-transparent mb-3" />
            <p className="text-xs font-medium">Loading snippets from database...</p>
          </div>
        ) : filteredSnippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnippets.map((snippet) => (
              <div
                key={snippet.id || snippet._id}
                className="group relative flex flex-col justify-between rounded-2xl border border-black/10 dark:border-white/8 bg-white/70 dark:bg-[#1A1D29]/65 p-5 backdrop-blur-glass transition-all hover:border-black/20 dark:hover:border-white/15 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/[0.03] dark:bg-white/5 text-[#D6249F] dark:text-[#FF6FB5] border border-black/10 dark:border-white/10">
                        <Code2 size={15} />
                      </div>
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#D6249F] dark:text-[#FF6FB5] bg-[#FF6FB5]/10 px-2 py-0.5 rounded-md">
                        {snippet.language}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleBookmark(snippet.id || snippet._id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          snippet.bookmarked
                            ? "text-[#D6249F] dark:text-[#FF6FB5] bg-[#FF6FB5]/10"
                            : "text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/5"
                        }`}
                        title="Bookmark"
                      >
                        <Bookmark size={15} fill={snippet.bookmarked ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => handleDelete(snippet.id || snippet._id)}
                        className="p-1.5 rounded-lg text-[#5B5F72] dark:text-[#9CA3B5] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-[#1A1D29] dark:text-white group-hover:text-[#D6249F] dark:group-hover:text-[#FF6FB5] transition-colors line-clamp-1">
                    {snippet.title}
                  </h3>
                  <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5] mt-1 line-clamp-2 h-8">
                    {snippet.description}
                  </p>
                </div>

                {/* Monaco Read-Only Terminal Box — kept dark (vs-dark editor theme) intentionally, like any code editor */}
                <div className="my-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#1e1e1e] shadow-inner overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#252526] px-3 py-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></div>
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500/80"></div>
                      <span className="ml-2 text-[#858585] text-[10px] tracking-wide uppercase font-mono">
                        {snippet.language}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(snippet.id || snippet._id, snippet.code)}
                      className="flex items-center gap-1 text-[10px] text-[#9CA3B5] hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedId === (snippet.id || snippet._id) ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="py-2">
                    <Editor
                      height="140px"
                      language={snippet.language}
                      value={snippet.code}
                      beforeMount={handleEditorWillMount}
                      theme="vs-dark"
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 12,
                        scrollBeyondLastLine: false,
                        lineNumbers: "on",
                        folding: false,
                        domReadOnly: true,
                        renderLineHighlight: "none",
                        scrollbar: { vertical: "hidden", horizontal: "auto" }
                      }}
                    />
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                  <div className="flex flex-wrap gap-1.5">
                    {snippet.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-[#5B5F72] dark:text-[#9CA3B5] bg-black/[0.03] dark:bg-white/5 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-[#5B5F72] dark:text-[#9CA3B5]">
                    {snippet.createdAt ? new Date(snippet.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#1A1D29]/40 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.03] dark:bg-white/5 text-[#5B5F72] dark:text-[#9CA3B5] mb-4">
              <Terminal size={24} />
            </div>
            <h3 className="text-base font-semibold text-[#1A1D29] dark:text-white">No snippets yet</h3>
            <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5] mt-1 max-w-sm">
              Click &quot;Create Snippet&quot; to save your first code snippet to the database.
            </p>
          </div>
        )}

      </div>

      {/* Interactive VS Code Editor Modal — kept as a dark IDE-style panel intentionally, consistent with the Monaco editor it hosts */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#1A1D29] p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Terminal className="text-[#FF6FB5]" size={20} />
                VS Code Snippet Editor
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#9CA3B5] hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSnippet} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9CA3B5] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Next.js Auth Middleware"
                  className="w-full h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-white outline-none focus:border-[#FF6FB5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#9CA3B5] mb-1">Language</label>
                  <select
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value)}
                    className="w-full h-10 rounded-xl border border-white/10 bg-[#1A1D29] px-3 text-xs text-white uppercase outline-none focus:border-[#FF6FB5]"
                  >
                    {LANGUAGES.filter((lang) => lang !== "All").map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9CA3B5] mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Auth, Next.js, Middleware"
                    className="w-full h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-white outline-none focus:border-[#FF6FB5]"
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
                  <label className="text-xs font-medium text-[#9CA3B5]">Description</label>
                  <AiAssistButton
                    mode="description"
                    label="Generate Description"
                    disabled={newCode.trim().length < MIN_AI_INPUT_LENGTH}
                    buildPayload={() => ({ code: newCode, language: newLang })}
                    onResult={(generated) => {
                      if (newDesc.trim().length > 3 && !window.confirm("This will replace your current description. Continue?")) {
                        return;
                      }
                      setNewDesc(generated);
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief explanation of the snippet..."
                  className="w-full h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-white outline-none focus:border-[#FF6FB5]"
                />
              </div>

              {/* Real-time Monaco Code Editor */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <label className="text-xs font-medium text-[#9CA3B5]">Code Editor (IntelliSense &amp; Syntax Linting Enabled)</label>
                  <div className="flex items-center gap-2">
                    {editorErrors.length > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                        <AlertTriangle size={12} />
                        {editorErrors.length} Syntax Error(s)
                      </span>
                    )}
                    <AiAssistButton
                      mode="code"
                      label="Generate Code"
                      disabled={newDesc.trim().length < MIN_AI_INPUT_LENGTH}
                      buildPayload={() => ({ description: newDesc, language: newLang })}
                      onResult={(generated) => {
                        if (newCode.trim().length > 3 && !window.confirm("This will replace your current code. Continue?")) {
                          return;
                        }
                        setNewCode(generated);
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 overflow-hidden bg-[#1e1e1e]">
                  <Editor
                    height="200px"
                    language={newLang}
                    value={newCode}
                    beforeMount={handleEditorWillMount}
                    onChange={(value) => setNewCode(value || "")}
                    onValidate={handleValidate}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      quickSuggestions: true,
                      suggestOnTriggerCharacters: true,
                      autoClosingBrackets: "always",
                      autoClosingQuotes: "always",
                      formatOnType: true,
                      tabSize: 2,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#9CA3B5] hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] hover:opacity-95 cursor-pointer shadow-[0_0_15px_rgba(233,79,209,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving…" : "Save Snippet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
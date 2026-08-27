"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { X, Folder, Plus } from "lucide-react";
import AiAssistButton from "@/components/AiAssistButton";

import { 
  Link as LinkIcon, 
  LogoGithub, 
  Code as CodeIcon, 
  Text as NoteIcon, 
  Thunderbolt as ApiIcon, 
  Bulb as IdeaIcon 
} from "@gravity-ui/icons";

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Real URL validation instead of a loose regex — catches things like
// "https://" with nothing after it, stray whitespace, or non-http(s)
// schemes such as "javascript:...".
function isValidHttpUrl(candidate) {
  if (!candidate) return false;
  try {
    const parsed = new URL(candidate.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// A GitHub repo URL must resolve to the github.com host itself (not just
// contain the substring "github.com" anywhere in the string) and point at
// an owner/repo path.
function isValidGithubRepoUrl(candidate) {
  if (!isValidHttpUrl(candidate)) return false;
  try {
    const { hostname, pathname } = new URL(candidate.trim());
    const host = hostname.toLowerCase();
    if (host !== "github.com" && host !== "www.github.com") return false;
    return pathname.split("/").filter(Boolean).length >= 2;
  } catch {
    return false;
  }
}

// Monaco only ships a real parser/checker for these — every other language
// in LANGUAGE_OPTIONS below only gets syntax *highlighting*, so onValidate's
// markers stay empty no matter how broken the code is.
const MONACO_VALIDATED_LANGUAGES = ["javascript", "typescript", "json"];

// Keep this in sync with the server's MIN_AI_INPUT_LENGTH in /api/ai/generate —
// both directions (code→description and description→code) need the same
// minimum amount of real content before the button is even enabled.
const MIN_AI_INPUT_LENGTH = 10;

export default function CreateCardModal({ isOpen, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("links");

  // Categories you've created (via "Create Category") — pulled in
  // automatically and rendered as extra chips right in the same tab bar as
  // Link/Repo/Snippet/Note/API/Idea, not as a separate control.
  const [customCategories, setCustomCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categorySaveError, setCategorySaveError] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // One id per "compose session" (each time the modal opens). Sent with the
  // save request and re-sent unchanged if the same click/submit somehow
  // fires more than once, so the server's unique index can recognize it as
  // the same attempt instead of a new card.
  const [clientRequestId, setClientRequestId] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCategory(null);
      setIsAddingCategory(false);
      setNewCategoryName("");
      setCategorySaveError("");
      setIsSubmitting(false);
      setCodeSyntaxErrors([]);
      return;
    }
    // Fresh id for this compose session every time the modal opens.
    setClientRequestId(
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/categories`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok && isMounted) {
          const data = await response.json();
          setCustomCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("CreateCardModal: failed to load categories.", err);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, [isOpen]);

  // Persists a brand-new category (same endpoint the sidebar's "Create
  // Category" uses), adds it to the chip list, and immediately tags this
  // card with it — so saving a new category and using it are one step.
  const handleSaveNewCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategorySaveError("Category name is required.");
      return;
    }
    if (trimmed.length > 60) {
      setCategorySaveError("Category name must be 60 characters or fewer.");
      return;
    }

    setSavingCategory(true);
    setCategorySaveError("");

    try {
      const response = await fetch(`${backendUrl}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await response.json().catch(() => ({}));

      let savedName = null;
      if (response.ok) {
        savedName = data.name;
        setCustomCategories((prev) => [data, ...prev]);
      } else if (response.status === 409) {
        // Category already exists — just use the existing one.
        savedName = data.category?.name || trimmed;
      } else {
        setCategorySaveError(data?.error || "Failed to save category.");
        setSavingCategory(false);
        return;
      }

      setSelectedCategory(savedName);
      setActiveTab("custom");
      setIsAddingCategory(false);
      setNewCategoryName("");
    } catch (err) {
      console.error("CreateCardModal: failed to save category.", err);
      setCategorySaveError("Failed to save category. Please try again.");
    } finally {
      setSavingCategory(false);
    }
  };

  const [formData, setFormData] = useState({
    url: "",
    title: "",
    notes: "",
    tags: [],
    repoUrl: "",
    customLabel: "",
    language: "javascript",
    code: "",
    purpose: "",
    noteTitle: "",
    markdownContent: "",
    apiMethod: "GET",
    apiUrl: "",
    apiAuth: [],
    ideaTitle: "",
    ideaStatus: "draft",
    customCategoryTitle: "",
    customCategoryContent: ""
  });

  const [errors, setErrors] = useState({});
  // The snippet tab's Monaco editor never had an onValidate handler, so
  // syntax errors were tracked nowhere and code with real syntax errors
  // could be saved. Mirror the same pattern the Snippets page uses.
  const [codeSyntaxErrors, setCodeSyntaxErrors] = useState([]);
  const handleCodeValidate = (markers) => {
    setCodeSyntaxErrors(markers.filter((m) => m.severity === 8)); // 8 = MarkerSeverity.Error
  };

  // Expanded Language List
  const LANGUAGE_OPTIONS = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "python", label: "Python" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS / Tailwind" },
    { value: "java", label: "Java" },
    { value: "go", label: "Go Lang" },
    { value: "rust", label: "Rust" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "sql", label: "SQL" },
    { value: "json", label: "JSON" },
    { value: "shell", label: "Shell / Bash" },
  ];

  // Define custom Monaco theme matching DevDeck palette
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

  const validateForm = () => {
    let currentErrors = {};

    if (activeTab === "links") {
      if (!formData.url) {
        currentErrors.url = "We need a valid link to point your card to.";
      } else if (!isValidHttpUrl(formData.url)) {
        currentErrors.url = "That layout doesn't look like a real URL setup.";
      }
      if (!formData.title) currentErrors.title = "Give it a short, descriptive name so it's easy to spot.";
    }

    if (activeTab === "repos") {
      if (!formData.repoUrl) {
        currentErrors.repoUrl = "We need a repository link to capture this.";
      } else if (!isValidGithubRepoUrl(formData.repoUrl)) {
        currentErrors.repoUrl = "That doesn't look like a valid GitHub repository URL (expected https://github.com/owner/repo).";
      }
    }

    if (activeTab === "snippets") {
      if (!formData.language) currentErrors.language = "Pick a language framework so syntax engines can shine.";
      if (!formData.code || !formData.code.trim()) {
        currentErrors.code = "A snippet card needs some code to hold onto!";
      } else if (MONACO_VALIDATED_LANGUAGES.includes(formData.language) && codeSyntaxErrors.length > 0) {
        currentErrors.code = `Fix ${codeSyntaxErrors.length} syntax error(s) in the code before saving.`;
      }
    }

    if (activeTab === "notes") {
      if (!formData.noteTitle) currentErrors.noteTitle = "Every great entry needs a headline.";
      if (!formData.markdownContent) currentErrors.markdownContent = "Don't leave the thoughts canvas entirely blank.";
    }

    if (activeTab === "apis") {
      if (!formData.apiUrl) {
        currentErrors.apiUrl = "Where are we targeting? An endpoint URL route is mandatory.";
      } else if (!/^https?:\/\/\S+/.test(formData.apiUrl)) {
        currentErrors.apiUrl = "Ensure your API endpoint starts with http:// or https://";
      }
    }

    if (activeTab === "ideas") {
      if (!formData.ideaTitle) currentErrors.ideaTitle = "What's the spark called? Name your vision.";
    }

    if (activeTab === "custom") {
      if (!formData.customCategoryTitle) currentErrors.customCategoryTitle = "Give this entry a title.";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field] : null }));
    }
  };

  const handleCheckboxChange = (value) => {
    let updatedAuth = [...formData.apiAuth];
    if (updatedAuth.includes(value)) {
      updatedAuth = updatedAuth.filter((item) => item !== value);
    } else {
      updatedAuth.push(value);
    }
    setFormData((prev) => ({ ...prev, apiAuth: updatedAuth }));
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Wait for the save to actually finish before closing — this also
      // guarantees a second click (or Enter key repeat) can't fire a second
      // POST while the first one is still in flight.
      await onSave({
        type: activeTab,
        data: { ...formData, category: selectedCategory || undefined, clientRequestId }
      });
      setSelectedCategory(null);
      onClose();
    } catch {
      // onSave already alerted with the specific reason (bad link, empty
      // code, etc.) — keep the modal open so the person can fix it instead
      // of losing what they typed.
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGlowColorClass = () => {
    switch(activeTab) {
      case "links": return "shadow-[0_0_40px_rgba(63,224,197,0.15)]";
      case "repos": return "shadow-[0_0_40px_rgba(139,92,246,0.15)]";
      case "snippets": return "shadow-[0_0_40px_rgba(233,79,209,0.15)]";
      case "notes": return "shadow-[0_0_40px_rgba(255,184,77,0.15)]";
      case "apis": return "shadow-[0_0_40px_rgba(63,224,197,0.15)]";
      case "ideas": return "shadow-[0_0_40px_rgba(233,79,209,0.15)]";
      default: return "shadow-[0_0_40px_rgba(255,255,255,0.05)]";
    }
  };

  if (!isOpen) return null;

  const navTabs = [
    { id: "links", label: "Link", icon: <LinkIcon className="w-[18px] h-[18px]" /> },
    { id: "repos", label: "Repo", icon: <LogoGithub className="w-[18px] h-[18px]" /> },
    { id: "snippets", label: "Snippet", icon: <CodeIcon className="w-[18px] h-[18px]" /> },
    { id: "notes", label: "Note", icon: <NoteIcon className="w-[18px] h-[18px]" /> },
    { id: "apis", label: "API", icon: <ApiIcon className="w-[18px] h-[18px]" /> },
    { id: "ideas", label: "Idea", icon: <IdeaIcon className="w-[18px] h-[18px]" /> }
  ];

  const inputBaseClass = "w-full bg-[#1A1D29]/60 backdrop-blur-md text-[#F5F6FA] placeholder:#9CA3B5/40 border border-white/8 hover:border-white/20 focus:border-[#E94FD1]/80 focus:outline-none rounded-xl h-11 px-4 transition-all duration-300";
  const textareaBaseClass = "w-full bg-[#1A1D29]/60 backdrop-blur-md text-[#F5F6FA] placeholder:#9CA3B5/40 border border-white/8 hover:border-white/20 focus:border-[#E94FD1]/80 focus:outline-none rounded-xl p-4 transition-all duration-300 min-h-[100px]";
  const labelClass = "text-[#9CA3B5] font-medium mb-1.5 block text-sm";
  const errorClass = "text-xs text-rose-500 mt-1.5 font-normal";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Frosted Background Mask Layer */}
      <div 
        className="fixed inset-0 bg-[#0B0E14]/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Futuristic Glass HUD Container Frame */}
      <div className={`bg-[#12141C]/90 backdrop-filter backdrop-blur-xl border border-white/8 rounded-2xl ${getGlowColorClass()} transition-shadow duration-500 max-h-[90vh] overflow-y-auto p-6 text-[#F5F6FA] relative w-full max-w-2xl z-10 flex flex-col gap-6`}>
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 text-[#9CA3B5] hover:text-[#F5F6FA] transition-all duration-300 cursor-pointer"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="border-b border-white/6 pb-4 pr-10">
          <h2 className="text-xl font-medium tracking-wide">Add a Card to Workspace</h2>
          <p className="text-sm text-[#9CA3B5] font-normal">Expand your dashboard ecosystem by storing a new unit.</p>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-6">

          {/* Navigation Tabs — card type, plus your categories inline right after them */}
          <div className="bg-white/5 backdrop-blur-sm p-1.5 border border-white/6 rounded-2xl w-full flex flex-wrap items-center gap-1.5">
            {navTabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setErrors({});
                  }}
                  type="button"
                  className={`flex items-center justify-center gap-2 px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isSelected 
                      ? "bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white shadow-lg shadow-pink-500/20" 
                      : "text-[#9CA3B5] hover:text-[#F5F6FA] hover:bg-white/5"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}

            {customCategories.length > 0 && (
              <div className="w-px self-stretch bg-white/10 mx-0.5" />
            )}

            {customCategories.map((cat) => {
              const isSelected = selectedCategory === cat.name && activeTab === "custom";
              return (
                <button
                  key={cat._id || cat.id || cat.name}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setSelectedCategory(null);
                      setActiveTab("links");
                    } else {
                      setSelectedCategory(cat.name);
                      setActiveTab("custom");
                    }
                    setErrors({});
                  }}
                  title={`Add data under your "${cat.name}" category`}
                  className={`flex items-center justify-center gap-2 px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#3FE0C5] to-[#2FD1FF] text-[#0B0E14] shadow-lg shadow-cyan-500/20"
                      : "text-[#9CA3B5] hover:text-[#F5F6FA] hover:bg-white/5"
                  }`}
                >
                  <Folder className="w-[18px] h-[18px]" />
                  <span className="hidden sm:inline">{cat.name}</span>
                </button>
              );
            })}

            {!isAddingCategory && (
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(true);
                  setCategorySaveError("");
                }}
                title="Save a new category"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-full border border-dashed border-white/15 text-[#9CA3B5] hover:text-[#F5F6FA] hover:border-white/30 hover:bg-white/5 transition-all duration-300"
              >
                <Plus className="w-[18px] h-[18px]" />
                <span className="hidden sm:inline">New</span>
              </button>
            )}
          </div>

          {/* Inline "save a new category" form — appears right under the tab
              bar when "+ New" is clicked, so creating one is a single step
              instead of a separate flow elsewhere in the app. */}
          {isAddingCategory && (
            <div className="flex gap-2 -mt-2">
              <input
                type="text"
                autoFocus
                placeholder="e.g. Interview Prep"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  if (categorySaveError) setCategorySaveError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveNewCategory();
                  }
                }}
                disabled={savingCategory}
                className={`${inputBaseClass} h-10 ${categorySaveError ? "border-rose-500/60 focus:border-rose-500" : ""}`}
              />
              <button
                type="button"
                onClick={handleSaveNewCategory}
                disabled={savingCategory}
                className="shrink-0 px-4 h-10 rounded-xl text-sm font-semibold text-[#0B0E14] bg-gradient-to-r from-[#3FE0C5] to-[#2FD1FF] hover:shadow-[0_0_15px_rgba(63,224,197,0.4)] transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {savingCategory ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategoryName("");
                  setCategorySaveError("");
                }}
                disabled={savingCategory}
                className="shrink-0 px-4 h-10 rounded-xl text-sm font-medium text-[#9CA3B5] hover:text-[#F5F6FA] hover:bg-white/5 border border-white/8 transition-all duration-200 cursor-pointer disabled:opacity-40"
              >
                Cancel
              </button>
            </div>
          )}
          {isAddingCategory && categorySaveError && (
            <p className="text-xs text-rose-500 -mt-4 font-normal">{categorySaveError}</p>
          )}
          
          {activeTab === "links" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#3FE0C5] bg-[#3FE0C5]/10 px-3 py-1.5 rounded-lg w-fit border border-[#3FE0C5]/20 font-medium">
                Quick-save a documentation page, tool, or guide.
              </p>
              <div>
                <label className={labelClass}>Website URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/docs"
                  value={formData.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  className={`${inputBaseClass} ${errors.url ? "border-rose-500/60 focus:border-rose-500" : ""}`}
                />
                {errors.url && <p className={errorClass}>{errors.url}</p>}
              </div>
              <div>
                <label className={labelClass}>Deck Title</label>
                <input
                  type="text"
                  placeholder="e.g., Tailwind Cheat Sheet"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`${inputBaseClass} ${errors.title ? "border-rose-500/60 focus:border-rose-500" : ""}`}
                />
                {errors.title && <p className={errorClass}>{errors.title}</p>}
              </div>
              <div>
                <label className={labelClass}>Quick Notes</label>
                <textarea
                  placeholder="Why are you saving this? (e.g., Useful for flexbox setups)"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className={textareaBaseClass}
                />
              </div>
            </div>
          )}

          {activeTab === "repos" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#8B5CF6] bg-[#8B5CF6]/10 px-3 py-1.5 rounded-lg w-fit border border-[#8B5CF6]/20 font-medium">
                Track an upstream dependency, tool, or open-source inspiration.
              </p>
              <div>
                <label className={labelClass}>Repository URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/username/repo"
                  value={formData.repoUrl}
                  onChange={(e) => handleInputChange("repoUrl", e.target.value)}
                  className={`${inputBaseClass} ${errors.repoUrl ? "border-rose-500/60 focus:border-rose-500" : ""}`}
                />
                {errors.repoUrl && <p className={errorClass}>{errors.repoUrl}</p>}
              </div>
              <div>
                <label className={labelClass}>Custom Label</label>
                <input
                  type="text"
                  placeholder="Leave blank to use the repository's original name"
                  value={formData.customLabel}
                  onChange={(e) => handleInputChange("customLabel", e.target.value)}
                  className={inputBaseClass}
                />
              </div>
            </div>
          )}

          {activeTab === "snippets" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#E94FD1] bg-[#E94FD1]/10 px-3 py-1.5 rounded-lg w-fit border border-[#E94FD1]/20 font-medium">
                Save a reusable block of magic code.
              </p>
              
              <div>
                <label className={labelClass}>Language Syntax</label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange("language", e.target.value)}
                  className="w-full bg-[#1A1D29]/60 text-[#F5F6FA] border border-white/8 hover:border-white/20 focus:border-[#E94FD1]/80 focus:outline-none rounded-xl h-11 px-3 backdrop-blur-md transition-all duration-300"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                {errors.language && <p className={errorClass}>{errors.language}</p>}
              </div>

              <div>
                <div className="flex flex-wrap justify-between items-center gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <label className={labelClass}>The Code</label>
                    <span className="text-[10px] font-mono text-[#3FE0C5]">
                      {MONACO_VALIDATED_LANGUAGES.includes(formData.language) ? "VS Code Intellisense Engine" : "Syntax highlighting only — not linted"}
                    </span>
                  </div>
                  <AiAssistButton
                    mode="code"
                    label="Generate Code"
                    disabled={formData.purpose.trim().length < MIN_AI_INPUT_LENGTH}
                    buildPayload={() => ({ description: formData.purpose, language: formData.language })}
                    onResult={(generated) => {
                      if (formData.code.trim().length > 3 && !window.confirm("This will replace your current code. Continue?")) {
                        return;
                      }
                      handleInputChange("code", generated);
                    }}
                  />
                </div>
                
                {/* MONACO EDITOR WITH AUTO-CLOSING TAGS & BRACKETS */}
                <div className={`border rounded-xl overflow-hidden shadow-inner bg-[#0B0E14] ${errors.code ? "border-rose-500/60" : "border-white/10"}`}>
                  <Editor
                    height="240px"
                    language={formData.language}
                    theme="devdeck-theme"
                    beforeMount={handleEditorWillMount}
                    value={formData.code}
                    onChange={(value) => handleInputChange("code", value || "")}
                    onValidate={handleCodeValidate}
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      lineNumbers: "on",
                      folding: true,
                      autoClosingTags: true,       // Automatically closes HTML/XML tags
                      autoClosingBrackets: "always", // Automatically closes ({[]})
                      autoClosingQuotes: "always",   // Automatically closes quotes '' "" ``
                      formatOnPaste: true,           // Formats pasted code blocks
                      padding: { top: 12, bottom: 12 },
                    }}
                  />
                </div>
                {MONACO_VALIDATED_LANGUAGES.includes(formData.language) && codeSyntaxErrors.length > 0 && !errors.code && (
                  <p className={errorClass}>
                    {codeSyntaxErrors.length} syntax error(s) — fix these before saving.
                  </p>
                )}
                {errors.code && <p className={errorClass}>{errors.code}</p>}
              </div>

              <div>
                <div className="flex flex-wrap justify-between items-center gap-2 mb-1.5">
                  <label className={`${labelClass} mb-0`}>Purpose</label>
                  <AiAssistButton
                    mode="description"
                    label="Generate Description"
                    disabled={formData.code.trim().length < MIN_AI_INPUT_LENGTH}
                    buildPayload={() => ({ code: formData.code, language: formData.language })}
                    onResult={(generated) => {
                      if (formData.purpose.trim().length > 3 && !window.confirm("This will replace your current purpose text. Continue?")) {
                        return;
                      }
                      handleInputChange("purpose", generated);
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="What does this script solve?"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  className={inputBaseClass}
                />
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#FFB84D] bg-[#FFB84D]/10 px-3 py-1.5 rounded-lg w-fit border border-[#FFB84D]/20 font-medium">
                Brainstorm, document setups, or write long-form scratchpads.
              </p>
              <div>
                <label className={labelClass}>Note Title</label>
                <input
                  type="text"
                  placeholder="e.g., Production Deployment Checklist"
                  value={formData.noteTitle}
                  onChange={(e) => handleInputChange("noteTitle", e.target.value)}
                  className={`${inputBaseClass} ${errors.noteTitle ? "border-rose-500/60 focus:border-rose-500" : ""}`}
                />
                {errors.noteTitle && <p className={errorClass}>{errors.noteTitle}</p>}
              </div>
              <div>
                <label className={labelClass}>Workspace Editor</label>
                <textarea
                  placeholder="# Start writing here... use markdown syntax for headers, lists, and bold text."
                  value={formData.markdownContent}
                  onChange={(e) => handleInputChange("markdownContent", e.target.value)}
                  className={`${textareaBaseClass} min-h-[180px]`}
                />
                {errors.markdownContent && <p className={errorClass}>{errors.markdownContent}</p>}
              </div>
            </div>
          )}

          {activeTab === "apis" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#3FE0C5] bg-[#3FE0C5]/10 px-3 py-1.5 rounded-lg w-fit border border-[#3FE0C5]/20 font-medium">
                Log a critical endpoint configuration for quick testing or reference.
              </p>
              <div className="flex gap-3 items-end">
                <div className="w-32">
                  <label className={labelClass}>Method</label>
                  <select
                    value={formData.apiMethod}
                    onChange={(e) => handleInputChange("apiMethod", e.target.value)}
                    className="w-full bg-[#1A1D29]/60 text-[#F5F6FA] border border-white/8 hover:border-white/20 focus:border-[#E94FD1]/80 focus:outline-none rounded-xl h-11 px-3 backdrop-blur-md transition-all duration-300 font-bold"
                  >
                    <option value="GET" className="text-emerald-400">GET</option>
                    <option value="POST" className="text-sky-400">POST</option>
                    <option value="PUT" className="text-amber-400">PUT</option>
                    <option value="PATCH" className="text-orange-400">PATCH</option>
                    <option value="DELETE" className="text-rose-500">DELETE</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className={labelClass}>Endpoint Route URL</label>
                  <input
                    type="text"
                    placeholder="https://api.devdeck.com/v1/auth/user"
                    value={formData.apiUrl}
                    onChange={(e) => handleInputChange("apiUrl", e.target.value)}
                    className={`${inputBaseClass} ${errors.apiUrl ? "border-rose-500/60 focus:border-rose-500" : ""}`}
                  />
                </div>
              </div>
              {errors.apiUrl && <p className={errorClass}>{errors.apiUrl}</p>}

              <div className="mt-2">
                <label className="text-[#9CA3B5] text-sm font-medium mb-3 block">Authentication Requirements</label>
                <div className="flex flex-wrap gap-4">
                  {["none", "bearer", "apikey", "basic"].map((authType) => (
                    <label key={authType} className="flex items-center gap-2 cursor-pointer select-none text-sm font-normal text-[#F5F6FA]">
                      <input
                        type="checkbox"
                        checked={formData.apiAuth.includes(authType)}
                        onChange={() => handleCheckboxChange(authType)}
                        className="rounded border-white/10 bg-white/5 text-[#E94FD1] focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                      />
                      <span className="capitalize">{authType === "apikey" ? "API Key" : authType === "bearer" ? "Bearer Token" : authType}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "ideas" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#E94FD1] bg-[#E94FD1]/10 px-3 py-1.5 rounded-lg w-fit border border-[#E94FD1]/20 font-medium">
                Don't let that late-night spark fade away. Draft it down.
              </p>
              <div>
                <label className={labelClass}>The Big Idea</label>
                <input
                  type="text"
                  placeholder="e.g., An AI-powered git commit summarizer"
                  value={formData.ideaTitle}
                  onChange={(e) => handleInputChange("ideaTitle", e.target.value)}
                  className={`${inputBaseClass} ${errors.ideaTitle ? "border-rose-500/60 focus:border-rose-500" : ""}`}
                />
                {errors.ideaTitle && <p className={errorClass}>{errors.ideaTitle}</p>}
              </div>

              <div className="mt-2">
                <label className="text-[#9CA3B5] text-sm font-medium mb-3 block">Current Momentum</label>
                <div className="flex gap-6">
                  {[
                    { val: "draft", label: "Just a Draft 🧊" },
                    { val: "coding", label: "Actively Coding 🪵" },
                    { val: "shipped", label: "Shipped & Done 🎉" }
                  ].map((statusItem) => (
                    <label key={statusItem.val} className="flex items-center gap-2 cursor-pointer select-none text-sm font-normal text-[#F5F6FA]">
                      <input
                        type="radio"
                        name="ideaStatus"
                        value={statusItem.val}
                        checked={formData.ideaStatus === statusItem.val}
                        onChange={() => handleInputChange("ideaStatus", statusItem.val)}
                        className="border-white/10 bg-white/5 text-[#E94FD1] focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                      />
                      <span>{statusItem.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "custom" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#3FE0C5] bg-[#3FE0C5]/10 px-3 py-1.5 rounded-lg w-fit border border-[#3FE0C5]/20 font-medium">
                Adding data under your "{selectedCategory}" category.
              </p>
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  placeholder="e.g., Weekend Project Notes"
                  value={formData.customCategoryTitle}
                  onChange={(e) => handleInputChange("customCategoryTitle", e.target.value)}
                  className={`${inputBaseClass} ${errors.customCategoryTitle ? "border-rose-500/60 focus:border-rose-500" : ""}`}
                />
                {errors.customCategoryTitle && <p className={errorClass}>{errors.customCategoryTitle}</p>}
              </div>
              <div>
                <label className={labelClass}>Details</label>
                <textarea
                  placeholder="Add any notes, links, or content for this entry..."
                  value={formData.customCategoryContent}
                  onChange={(e) => handleInputChange("customCategoryContent", e.target.value)}
                  className={`${textareaBaseClass} min-h-[160px]`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-white/6 pt-4 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="text-[#9CA3B5] hover:text-[#F5F6FA] hover:bg-white/5 font-medium transition-colors rounded-full px-6 py-2 text-sm bg-transparent border-0 outline-none cursor-pointer"
          >
            Nevermind
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white font-medium shadow-[0_4px_20px_rgba(233,79,209,0.4)] hover:shadow-[0_4px_25px_rgba(233,79,209,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-full px-6 py-2 text-sm border-0 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? "Adding…" : "Add to Deck"}
          </button>
        </div>

      </div>
    </div>
  );
}
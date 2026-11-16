"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import MarkdownPreview from "@/components/MarkdownPreview";

// Same palette as the snippet editors so notes feel like part of the same app.
// defineTheme is safe to call repeatedly.
const defineDevDeckTheme = (monaco) => {
  monaco.editor.defineTheme("devdeck-theme", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4", fontStyle: "italic" },
      { token: "keyword", foreground: "E94FD1", fontStyle: "bold" },
      { token: "string", foreground: "3FE0C5" },
      { token: "number", foreground: "FFB84D" },
    ],
    colors: {
      "editor.background": "#0B0E14",
      "editor.foreground": "#F5F6FA",
      "editor.lineHighlightBackground": "#1A1D2980",
      "editorCursor.foreground": "#3FE0C5",
      "editorLineNumber.foreground": "#9CA3B540",
      "editorLineNumber.activeForeground": "#3FE0C5",
      "editor.selectionBackground": "#E94FD140",
    },
  });
};

// Monaco editor (markdown mode) on the left, live rendered preview on the right.
// Stacks vertically on narrow screens.
export default function MarkdownEditor({ value, onChange, height = "280px", hasError = false, placeholder }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className={`border rounded-xl overflow-hidden shadow-inner bg-[#0B0E14] ${hasError ? "border-rose-500/60" : "border-white/10"}`}>
        <Editor
          height={height}
          language="markdown"
          theme="devdeck-theme"
          beforeMount={defineDevDeckTheme}
          value={value}
          onChange={(v) => onChange(v || "")}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            tabSize: 2,
            lineNumbers: "off",
            folding: false,
            quickSuggestions: false,
            renderLineHighlight: "none",
            padding: { top: 12, bottom: 12 },
            placeholder,
          }}
        />
      </div>

      <div
        style={{ height }}
        className="border rounded-xl p-4 overflow-y-auto border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-[#1A1D29] dark:text-[#F5F6FA]"
      >
        <MarkdownPreview source={value} emptyText="Live preview appears here as you type." />
      </div>
    </div>
  );
}
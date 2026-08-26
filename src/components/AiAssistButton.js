"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { generateWithAI } from "@/lib/aiAssist";


export default function AiAssistButton({ mode, label, disabled, buildPayload, onResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    if (disabled || loading) return;
    setError("");
    setLoading(true);
    try {
      const payload = buildPayload();
      const result = await generateWithAI({ mode, ...payload });
      onResult(result);
    } catch (err) {
      console.error("AI assist failed:", err);
      setError(err.message || "AI generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        title={disabled ? "Fill in the field above first" : "Powered by Groq"}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#3FE0C5]/30 bg-[#3FE0C5]/10 text-[#3FE0C5] hover:bg-[#3FE0C5]/20 hover:border-[#3FE0C5]/50 hover:shadow-[0_0_12px_rgba(63,224,197,0.25)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#3FE0C5]/10 disabled:hover:shadow-none cursor-pointer shrink-0"
      >
        {loading ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          <Sparkles size={11} />
        )}
        {loading ? "Thinking…" : label}
      </button>
      {error && (
        <p className="text-[10px] text-rose-400 font-normal text-right max-w-[240px] leading-tight">
          {error}
        </p>
      )}
    </div>
  );
}
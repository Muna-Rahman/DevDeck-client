"use client";

import React, { useState } from "react";
import { X, FolderPlus } from "lucide-react";

export default function CreateCategoryModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setName("");
    setError("");
    setSubmitting(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Category name is required.");
      return;
    }
    if (trimmed.length > 60) {
      setError("Category name must be 60 characters or fewer.");
      return;
    }

    setSubmitting(true);
    setError("");

    const result = await onCreate(trimmed);

    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Frosted Background Mask Layer */}
      <div
        className="fixed inset-0 bg-[#0B0E14]/70 backdrop-blur-md transition-opacity duration-300"
        onClick={submitting ? undefined : handleClose}
      />

      {/* Glass HUD Container Frame */}
      <div className="bg-[#12141C]/90 backdrop-filter backdrop-blur-xl border border-white/8 rounded-2xl shadow-[0_0_30px_rgba(46,204,150,0.12)] p-6 text-[#F5F6FA] relative w-full max-w-md z-10 flex flex-col gap-5">

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={submitting}
          className="absolute top-5 right-5 p-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 text-[#9CA3B5] hover:text-[#F5F6FA] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="border-b border-white/6 pb-4 pr-10 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-seagreen/10 border border-seagreen/20">
            <FolderPlus size={18} className="text-seagreen" />
          </div>
          <div>
            <h2 className="text-lg font-medium tracking-wide">Create Category</h2>
            <p className="text-sm text-[#9CA3B5] font-normal">
              Add a new category to organize cards under.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="category-name" className="text-xs uppercase tracking-wider text-[#9CA3B5] font-medium">
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Interview Prep"
              disabled={submitting}
              className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 focus:border-seagreen/60 focus:outline-none px-3.5 py-2.5 text-sm text-[#F5F6FA] placeholder:text-[#6B7280] transition-colors disabled:opacity-60"
            />
            {error && <p className="text-xs text-rose-500 mt-1.5 font-normal">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#9CA3B5] hover:text-[#F5F6FA] hover:bg-white/5 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-seagreen/80 via-mauve/80 to-rosepink/80 hover:from-seagreen hover:via-mauve hover:to-rosepink transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating…" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
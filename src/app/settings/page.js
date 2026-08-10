"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  User, 
  Globe, 
  Type, 
  Key, 
  Save, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Image as ImageIcon,
  ArrowLeft
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Profile States
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("en");
  const [fontSize, setFontSize] = useState("medium");

  // Password States
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // UI Feedback States
  const [saved, setSaved] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Account Modal States
  const [deleteStep, setDeleteStep] = useState(0); // 0 = closed, 1 = first confirmation, 2 = second confirmation
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || "");
    }
  }, [session]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (password && password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsUpdating(true);
    try {
      // Save settings logic goes here
      setSaved(true);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePermanentDelete = async () => {
    setIsDeleting(true);
    try {
      // Execute deletion endpoint logic here
      await authClient.signOut();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E94FD1] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F5F6FA] dark:bg-[#1A1D29] text-[#1A1D29] dark:text-[#F5F6FA] transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Button & Page Header */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-black/10 dark:border-white/15 bg-white/10 dark:bg-white/[0.04] backdrop-blur-xl hover:bg-white/20 dark:hover:bg-white/10 text-xs font-semibold uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            <span>Back</span>
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] dark:from-[#D6249F] dark:to-[#FF6FB5] bg-clip-text text-transparent inline-block">
              Settings
            </h1>
            <p className="text-xs sm:text-sm text-[#5B5F72] dark:text-[#9CA3B5] mt-1">
              Manage your account preferences, system behavior, and security options.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-8">
          
          {/* Gravatar / Profile Image Section */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/10 dark:bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/5 dark:border-white/5">
              <ImageIcon className="text-[#E94FD1] dark:text-[#FF6FB5]" size={20} />
              <h2 className="text-base font-semibold">Gravatar / Profile Image</h2>
            </div>
            <div className="flex items-center gap-5">
              <img
                src={session?.user?.image || `https://www.gravatar.com/avatar/${session?.user?.email}?d=identicon`}
                alt="Gravatar Profile"
                className="h-20 w-20 rounded-2xl border-2 border-[#FF6FB5] dark:border-[#E94FD1] object-cover shadow-[0_0_20px_rgba(233,79,209,0.3)]"
              />
              <div>
                <p className="text-xs font-semibold text-[#1A1D29] dark:text-[#F5F6FA]">Profile Avatar</p>
                <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5] mt-0.5">
                  Your profile picture is synchronized via Gravatar using your registered email address ({session?.user?.email}).
                </p>
              </div>
            </div>
          </div>

          {/* Profile Settings */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/10 dark:bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
              <User className="text-[#E94FD1] dark:text-[#FF6FB5]" size={20} />
              <h2 className="text-base font-semibold">Profile & Credentials</h2>
            </div>

            {/* Change Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] mb-2">
                Change Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#5B5F72] dark:text-[#9CA3B5]">
                  <User size={16} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white/10 dark:bg-white/[0.05] backdrop-blur-md pl-10 pr-4 text-sm outline-none transition-all focus:border-[#D6249F] dark:focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
                />
              </div>
            </div>

            {/* Change Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] mb-2">
                  Change Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#5B5F72] dark:text-[#9CA3B5]">
                    <Key size={16} strokeWidth={2.5} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white/10 dark:bg-white/[0.05] backdrop-blur-md pl-10 pr-4 text-sm outline-none transition-all focus:border-[#D6249F] dark:focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#5B5F72] dark:text-[#9CA3B5]">
                    <Key size={16} strokeWidth={2.5} />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white/10 dark:bg-white/[0.05] backdrop-blur-md pl-10 pr-4 text-sm outline-none transition-all focus:border-[#D6249F] dark:focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
                  />
                </div>
              </div>
            </div>

            {passwordError && (
              <p className="text-xs text-red-500 font-medium">{passwordError}</p>
            )}
          </div>

          {/* Preferences (Language & Font Size) */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/10 dark:bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] space-y-6">
            
            {/* Language */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Globe className="text-[#E94FD1] dark:text-[#FF6FB5]" size={20} />
                <h2 className="text-base font-semibold">Language</h2>
              </div>
              <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5] mb-3">Select preferred language</p>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white/10 dark:bg-[#1A1D29]/90 backdrop-blur-md px-4 text-sm outline-none transition-all focus:border-[#D6249F] dark:focus:border-[#FF6FB5]/50 cursor-pointer"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
                <option value="it">Italiano (Italian)</option>
                <option value="pt">Português (Portuguese)</option>
                <option value="ja">日本語 (Japanese)</option>
                <option value="zh">简体中文 (Chinese Simplified)</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <Type className="text-[#E94FD1] dark:text-[#FF6FB5]" size={20} />
                <h2 className="text-base font-semibold">Font Size</h2>
              </div>
              <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5] mb-3">Adjust display text scale</p>
              <div className="grid grid-cols-3 gap-3">
                {["small", "medium", "large"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFontSize(size)}
                    className={`h-10 rounded-xl text-xs font-semibold uppercase tracking-wider border backdrop-blur-md transition-all cursor-pointer ${
                      fontSize === size
                        ? "bg-black/15 dark:bg-white/20 text-[#D6249F] dark:text-[#FF6FB5] border-[#E94FD1] dark:border-[#FF6FB5] shadow-sm"
                        : "border-black/10 dark:border-white/10 text-[#5B5F72] dark:text-[#9CA3B5] hover:bg-white/20 dark:hover:bg-white/10"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Submit Action */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="h-11 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] dark:from-[#D6249F] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(233,79,209,0.35)] hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save size={16} strokeWidth={2.5} />
              <span>{isUpdating ? "Saving..." : "Save Settings"}</span>
            </button>

            {saved && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 animate-in fade-in">
                <CheckCircle2 size={16} />
                <span>Settings saved successfully!</span>
              </div>
            )}
          </div>

        </form>

        {/* Delete Account (Dangerous Area) */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 dark:border-red-500/30 dark:bg-red-950/10 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(239,68,68,0.08)]">
          <div className="flex items-center gap-3 mb-2 text-red-500">
            <AlertTriangle size={20} />
            <h2 className="text-base font-semibold">Danger Zone</h2>
          </div>
          <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5] mb-5">
            Permanently remove your account and all associated snippet decks and data.
          </p>

          <button
            type="button"
            onClick={() => setDeleteStep(1)}
            className="h-10 inline-flex items-center justify-center rounded-xl bg-red-500 hover:bg-red-600 text-white px-4 text-xs font-semibold uppercase tracking-wider transition-all gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.25)] active:scale-95"
          >
            <Trash2 size={14} strokeWidth={2.5} />
            <span>Delete Account</span>
          </button>
        </div>

      </div>

      {/* Confirmation Modals Flow */}
      {deleteStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4">
          <div className="w-full max-w-md rounded-2xl border border-black/10 dark:border-white/15 bg-white/20 dark:bg-[#1A1D29]/80 backdrop-blur-2xl p-6 shadow-2xl space-y-4">
            
            {deleteStep === 1 && (
              <>
                <div className="flex items-center gap-3 text-red-500">
                  <AlertTriangle size={24} />
                  <h3 className="text-lg font-bold">Delete Account</h3>
                </div>
                <p className="text-sm text-[#5B5F72] dark:text-[#9CA3B5]">
                  Do you want to delete your account?
                </p>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setDeleteStep(0)}
                    className="h-10 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] hover:bg-white/20 dark:hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteStep(2)}
                    className="h-10 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white transition-all cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {deleteStep === 2 && (
              <>
                <div className="flex items-center gap-3 text-red-500">
                  <AlertTriangle size={24} />
                  <h3 className="text-lg font-bold">Final Confirmation</h3>
                </div>
                <p className="text-sm text-[#5B5F72] dark:text-[#9CA3B5]">
                  Are you absolutely sure? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setDeleteStep(0)}
                    className="h-10 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] hover:bg-white/20 dark:hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handlePermanentDelete}
                    className="h-10 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Permanently Delete"}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
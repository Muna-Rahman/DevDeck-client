"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/context/LanguageContext";
import { 
  User, 
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
  const { data: session, isPending, refetch } = authClient.useSession();
  const { fontSize: activeFontSize, setFontSize } = useLanguage();

  // Form selections (Updated locally first, applied on Save)
  const [username, setUsername] = useState("");
  const [selectedFontSize, setSelectedFontSize] = useState("medium");

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileError, setProfileError] = useState("");

  // Feedback States
  const [saved, setSaved] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal States
  const [deleteStep, setDeleteStep] = useState(0); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || "");
    }
  }, [session]);

  // Keep the form in sync with the Font Size Context, which is the single
  // source of truth (it loads the real saved values from the backend).
  useEffect(() => {
    setSelectedFontSize(activeFontSize || "medium");
  }, [activeFontSize]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setProfileError("");

    if (password || confirmPassword) {
      if (!currentPassword) {
        setPasswordError("Current password is required to set a new password.");
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        setPasswordError("New password must be at least 8 characters.");
        return;
      }
    }

    setIsUpdating(true);
    try {
      // 1. Update Username via Auth Backend
      if (username !== session?.user?.name) {
        const { error: nameErr } = await authClient.updateUser({
          name: username,
        });
        if (nameErr) throw new Error(nameErr.message || "Failed to update username");
      }

      // 2. Change Password via Auth Backend
      if (password && currentPassword) {
        const { error: passErr } = await authClient.changePassword({
          currentPassword,
          newPassword: password,
          revokeOtherSessions: true,
        });
        if (passErr) throw new Error(passErr.message || "Failed to change password");
      }

      // 3. Persist settings (Font Size) directly to your MongoDB Backend Database
      const settingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/user/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fontSize: selectedFontSize,
        }),
      });

      if (!settingsRes.ok) {
        const errData = await settingsRes.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save settings to backend.");
      }

      // 4. Commit Font Size to the Global Context (applies it
      //    everywhere in the app immediately, not just on this page)
      setFontSize(selectedFontSize);

      if (refetch) await refetch();

      setSaved(true);
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      console.error("Settings update error:", err);
      setProfileError(err.message || "An error occurred while saving settings.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePermanentDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      const { error } = await authClient.deleteUser();
      if (error) throw new Error(error.message || "Failed to delete account.");
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Delete account error:", err);
      setDeleteError(err.message || "Could not delete account.");
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

  const glassCardStyle = 
    "relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-white/[0.02] backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:pointer-events-none";

  const glassInputStyle = 
    "w-full h-11 rounded-xl border border-white/30 dark:border-white/10 bg-white/15 dark:bg-white/[0.04] backdrop-blur-xl px-4 text-sm text-[#1A1D29] dark:text-[#F5F6FA] outline-none transition-all placeholder:text-[#5B5F72]/60 dark:placeholder:text-[#9CA3B5]/50 focus:border-[#E94FD1] dark:focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/20";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F5F6FA] dark:bg-[#1A1D29] text-[#1A1D29] dark:text-[#F5F6FA] transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Button & Header */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-white/[0.03] backdrop-blur-2xl hover:bg-white/40 dark:hover:bg-white/[0.08] text-xs font-semibold uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            <span>{"Back"}</span>
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] dark:from-[#D6249F] dark:to-[#FF6FB5] bg-clip-text text-transparent inline-block">
              {"Settings"}
            </h1>
            <p className="text-xs sm:text-sm text-[#5B5F72] dark:text-[#9CA3B5] mt-1">
              {"Account Settings"}
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-8">
          
          {/* Gravatar Section */}
          <div className={`${glassCardStyle} p-6 sm:p-8`}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/5 dark:border-white/5">
              <ImageIcon className="text-[#E94FD1] dark:text-[#FF6FB5]" size={20} />
              <h2 className="text-base font-semibold">Gravatar / Profile Image</h2>
            </div>
            <div className="flex items-center gap-5 relative z-10">
              <img
                src={session?.user?.image || `https://www.gravatar.com/avatar/${session?.user?.email}?d=identicon`}
                alt="Gravatar Profile"
                className="h-20 w-20 rounded-2xl border-2 border-[#FF6FB5]/80 dark:border-[#E94FD1]/80 object-cover shadow-[0_0_25px_rgba(233,79,209,0.35)] shrink-0"
              />
              <div>
                <p className="text-xs font-semibold text-[#1A1D29] dark:text-[#F5F6FA]">Profile Avatar</p>
                <p className="text-xs text-[#5B5F72] dark:text-[#9CA3B5] mt-0.5">
                  Your profile picture is synchronized via Gravatar using your registered email address ({session?.user?.email}).
                </p>
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className={`${glassCardStyle} p-6 sm:p-8 space-y-6`}>
            <div className="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
              <User className="text-[#E94FD1] dark:text-[#FF6FB5]" size={20} />
              <h2 className="text-base font-semibold">{"Profile & Credentials"}</h2>
            </div>

            <div className="relative z-10">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] mb-2">
                {"Change Username"}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#5B5F72] dark:text-[#9CA3B5]">
                  <User size={16} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className={`${glassInputStyle} pl-10`}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2 relative z-10">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] mb-2">
                  {"Current Password"}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#5B5F72] dark:text-[#9CA3B5]">
                    <Key size={16} strokeWidth={2.5} />
                  </div>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="password"
                    className={`${glassInputStyle} pl-10`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] mb-2">
                    {"Change Password"}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#5B5F72] dark:text-[#9CA3B5]">
                      <Key size={16} strokeWidth={2.5} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password"
                      className={`${glassInputStyle} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5F72] dark:text-[#9CA3B5] mb-2">
                    {"Confirm Password"}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#5B5F72] dark:text-[#9CA3B5]">
                      <Key size={16} strokeWidth={2.5} />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="password"
                      className={`${glassInputStyle} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {passwordError && <p className="text-xs text-red-500 font-medium">{passwordError}</p>}
            {profileError && <p className="text-xs text-red-500 font-medium">{profileError}</p>}
          </div>

          {/* Preferences */}
          <div className={`${glassCardStyle} p-6 sm:p-8 space-y-6`}>

            {/* Font Size Selector */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Type className="text-[#E94FD1] dark:text-[#FF6FB5]" size={20} />
                <h2 className="text-base font-semibold">Font Size</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["small", "medium", "large"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedFontSize(size)}
                    className={`h-11 rounded-xl text-xs font-semibold uppercase tracking-wider border backdrop-blur-2xl transition-all cursor-pointer ${
                      selectedFontSize === size
                        ? "bg-white/40 dark:bg-white/20 text-[#D6249F] dark:text-[#FF6FB5] border-[#E94FD1] dark:border-[#FF6FB5] shadow-[0_0_15px_rgba(233,79,209,0.2)]"
                        : "border-white/30 dark:border-white/10 bg-white/10 dark:bg-white/[0.02] text-[#5B5F72] dark:text-[#9CA3B5] hover:bg-white/30 dark:hover:bg-white/10"
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
              className="h-11 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] dark:from-[#D6249F] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(233,79,209,0.4)] hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
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

        {/* Danger Zone */}
        <div className="relative overflow-hidden rounded-3xl border border-red-500/30 bg-red-500/10 dark:border-red-500/40 dark:bg-red-950/20 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(239,68,68,0.15)]">
          <div className="flex items-center gap-3 mb-2 text-red-500 relative z-10">
            <AlertTriangle size={20} />
            <h2 className="text-base font-semibold">{"Danger Zone"}</h2>
          </div>
          <button
            type="button"
            onClick={() => setDeleteStep(1)}
            className="relative z-10 h-10 inline-flex items-center justify-center rounded-xl bg-red-500 hover:bg-red-600 text-white px-4 text-xs font-semibold uppercase tracking-wider transition-all gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.35)] active:scale-95"
          >
            <Trash2 size={14} strokeWidth={2.5} />
            <span>{"Delete Account"}</span>
          </button>
        </div>

      </div>

      {/* Confirmation Modals */}
      {deleteStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xl p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/30 dark:border-white/20 bg-white/30 dark:bg-[#1A1D29]/70 backdrop-blur-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-4">
            {deleteStep === 1 && (
              <>
                <h3 className="text-lg font-bold text-red-500">{"Delete Account"}</h3>
                <p className="text-sm text-[#5B5F72] dark:text-[#9CA3B5]">Do you want to delete your account?</p>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setDeleteStep(0)} className="px-4 py-2 text-xs">{"Cancel"}</button>
                  <button type="button" onClick={() => setDeleteStep(2)} className="px-4 py-2 text-xs bg-red-500 text-white rounded-xl">Continue</button>
                </div>
              </>
            )}
            {deleteStep === 2 && (
              <>
                <h3 className="text-lg font-bold text-red-500">Final Confirmation</h3>
                <p className="text-sm text-[#5B5F72] dark:text-[#9CA3B5]">Are you absolutely sure?</p>
                {deleteError && <p className="text-xs text-red-500 font-medium">{deleteError}</p>}
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setDeleteStep(0)} className="px-4 py-2 text-xs">{"Cancel"}</button>
                  <button type="button" disabled={isDeleting} onClick={handlePermanentDelete} className="px-4 py-2 text-xs bg-red-600 text-white rounded-xl">
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
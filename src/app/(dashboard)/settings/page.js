"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import {
  ArrowLeft,
  User,
  Type,
  Key,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ShieldCheck,
  Palette,
  Sparkles,
  X,
} from "lucide-react";

const FONT_SIZES = [
  { id: "small", label: "Small", px: 14 },
  { id: "medium", label: "Medium", px: 16 },
  { id: "large", label: "Large", px: 18 },
];

// Frosted glass: light tint, soft blur and a thin bright edge so the wallpaper shows through
const cardStyle =
  "relative overflow-hidden rounded-2xl border border-white/50 dark:border-white/10 bg-white/45 dark:bg-white/[0.06] backdrop-blur-xl backdrop-saturate-150 shadow-xl shadow-black/5 dark:shadow-black/30 transition-all duration-300 hover:border-white/70 dark:hover:border-white/20";

const inputStyle =
  "w-full h-11 rounded-xl border border-[#6D4AFF]/15 dark:border-white/10 bg-white/70 dark:bg-black/40 pl-10 pr-4 text-sm text-[#1E1B3A] dark:text-[#F5F6FA] outline-none transition-all placeholder:text-[#8A86A6] dark:placeholder:text-white/30 focus:border-[#6D4AFF] dark:focus:border-[#FF6FB5]/60 focus:ring-2 focus:ring-[#6D4AFF]/15 dark:focus:ring-[#FF6FB5]/15 disabled:opacity-60 disabled:cursor-not-allowed";

const labelStyle =
  "block text-[10px] font-mono font-bold uppercase tracking-widest text-[#6B6788] dark:text-[#9CA3B5] mb-1.5";

const pillStyle =
  "inline-flex max-w-full items-center gap-2 rounded-full border border-white/50 dark:border-white/10 bg-white/50 dark:bg-white/[0.08] px-3 py-1.5 text-xs font-mono text-[#4A4660] dark:text-white/80";

// Each section gets its own color so the page feels less samey
const ACCENTS = {
  pink: "bg-[#D6249F]/15 text-[#D6249F] dark:bg-[#E94FD1]/15 dark:text-[#E94FD1]",
  teal: "bg-[#0FB8A6]/15 text-[#0B8F80] dark:bg-[#3FE0C5]/15 dark:text-[#3FE0C5]",
  violet: "bg-[#6D4AFF]/15 text-[#5B3FE0] dark:bg-[#8B7CFF]/15 dark:text-[#A99CFF]",
};

function Section({ icon: Icon, tag, title, description, accent = "pink", children }) {
  return (
    <section className={`${cardStyle} p-6 hover:-translate-y-0.5`}>
      <div className="flex items-start gap-3 mb-6">
        <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${ACCENTS[accent]}`}>
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#5B5F72] dark:text-white/50">
            {tag}
          </span>
          <h2 className="text-base font-semibold tracking-tight text-[#1E1B3A] dark:text-white">{title}</h2>
          {description && (
            <p className="text-xs text-[#5B5F72] dark:text-white/60 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className={labelStyle}>{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#8A86A6] dark:text-[#9CA3B5]">
          <Icon size={16} />
        </div>
        {children}
      </div>
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${inputStyle} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-2 my-auto flex h-8 w-8 items-center justify-center rounded-lg text-[#8A86A6] dark:text-[#9CA3B5] hover:text-[#6D28D9] dark:hover:text-white hover:bg-[#6D4AFF]/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
      >
        {visible ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const { fontSize: activeFontSize, setFontSize } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [selectedFontSize, setSelectedFontSize] = useState("medium");

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileError, setProfileError] = useState("");

  const [saved, setSaved] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteStep, setDeleteStep] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || "");
    }
  }, [session]);

  // The context holds the real saved value, so the form follows it
  useEffect(() => {
    setSelectedFontSize(activeFontSize || "medium");
  }, [activeFontSize]);

  const hasChanges =
    username !== (session?.user?.name || "") ||
    selectedFontSize !== (activeFontSize || "medium") ||
    Boolean(currentPassword || password || confirmPassword);

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
      if (username !== session?.user?.name) {
        const { error: nameErr } = await authClient.updateUser({ name: username });
        if (nameErr) throw new Error(nameErr.message || "Failed to update username");
      }

      if (password && currentPassword) {
        const { error: passErr } = await authClient.changePassword({
          currentPassword,
          newPassword: password,
          revokeOtherSessions: true,
        });
        if (passErr) throw new Error(passErr.message || "Failed to change password");
      }

      const settingsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/user/settings`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ fontSize: selectedFontSize }),
        }
      );

      if (!settingsRes.ok) {
        const errData = await settingsRes.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save settings to backend.");
      }

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

  const handleDiscard = () => {
    setUsername(session?.user?.name || "");
    setSelectedFontSize(activeFontSize || "medium");
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setProfileError("");
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6D4AFF] dark:border-[#E94FD1] border-t-transparent" />
      </div>
    );
  }

  const user = session?.user;
  const firstName = (user?.name || "there").split(" ")[0];

  return (
    <div className="w-full flex flex-col relative z-10 space-y-6 min-w-0 max-w-5xl mx-auto pb-20">
      {/* Softens the wallpaper on this page only, the other pages keep it sharp */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none backdrop-blur-xl bg-white/25 dark:bg-black/30"
      />

      <button
        type="button"
        onClick={() => router.back()}
        className="self-start inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-white/50 dark:border-white/10 bg-white/45 dark:bg-white/[0.06] backdrop-blur-xl text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-white hover:border-white/70 dark:hover:border-white/20 shadow-lg transition-all active:scale-95 cursor-pointer"
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Back
      </button>

      <div className={`${cardStyle} p-6 sm:p-8`}>
        {/* A couple of blurry color blobs to give the header some life */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#E94FD1]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-[#3FE0C5]/25 blur-3xl"
        />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/50 dark:border-white/10 bg-white/50 dark:bg-white/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#6D28D9] dark:text-[#E94FD1]">
            <Sparkles size={12} />
            Your space
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight uppercase bg-gradient-to-r from-[#4338CA] via-[#D6249F] to-[#FF6FB5] bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="mt-2 text-sm text-[#4A4660] dark:text-white/70">
            Hey {firstName}, make DevDeck feel like yours.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className={pillStyle}>
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0FB8A6] opacity-60 dark:bg-[#3FE0C5]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0FB8A6] dark:bg-[#3FE0C5]" />
              </span>
              <span className="truncate">{user?.name || "Developer"}</span>
            </span>
            <span className={pillStyle}>
              <Mail size={12} className="flex-shrink-0" />
              <span className="truncate">{user?.email}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Two columns on wide screens: account stuff on the left, looks on the right */}
      <form
        id="settings-form"
        onSubmit={handleUpdateProfile}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
      >
        <div className="space-y-6 min-w-0">
          <Section
            icon={User}
            tag="Account"
            title="Profile"
            description="How you appear across your workspace."
            accent="pink"
          >
            <div className="space-y-4">
              <Field label="Username" icon={User}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className={inputStyle}
                />
              </Field>
              <Field label="Email (read-only)" icon={Mail}>
                <input type="email" value={user?.email || ""} disabled className={inputStyle} />
              </Field>
            </div>
          </Section>

          <Section
            icon={ShieldCheck}
            tag="Security"
            title="Password"
            description="Leave these blank to keep your current password. Changing it signs out your other sessions."
            accent="teal"
          >
            <div className="space-y-4">
              <Field label="Current password" icon={Key}>
                <PasswordInput
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  autoComplete="current-password"
                />
              </Field>
              <Field label="New password" icon={Key}>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
              </Field>
              <Field label="Confirm password" icon={Key}>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                />
              </Field>
              {passwordError && (
                <p className="text-xs text-rose-500 font-medium" role="alert">{passwordError}</p>
              )}
            </div>
          </Section>
        </div>

        <Section
          icon={Palette}
          tag="Appearance"
          title="Theme & text size"
          description="Theme applies instantly. Text size is saved with your account."
          accent="violet"
        >
          <div className="space-y-6">
            <div>
              <span className={labelStyle}>Theme</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                ].map(({ id, label, icon: Icon }) => {
                  const active = theme === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTheme(id)}
                      aria-pressed={active}
                      className={`h-11 inline-flex items-center justify-center gap-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        active
                          ? "bg-gradient-to-r from-[#4338CA] to-[#6D4AFF] dark:from-[#35338F] dark:to-[#5A4BD1] text-white border-transparent shadow-[0_10px_22px_-10px_rgba(79,70,229,0.8)]"
                          : "border-[#6D4AFF]/15 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] text-[#6B6788] dark:text-[#9CA3B5] hover:bg-[#6D4AFF]/[0.07] dark:hover:bg-white/[0.07]"
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className={labelStyle}>Text size</span>
              <div className="grid grid-cols-3 gap-3">
                {FONT_SIZES.map(({ id, label, px }) => {
                  const active = selectedFontSize === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedFontSize(id)}
                      aria-pressed={active}
                      className={`py-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        active
                          ? "bg-gradient-to-r from-[#4338CA] to-[#6D4AFF] dark:from-[#35338F] dark:to-[#5A4BD1] text-white border-transparent shadow-[0_10px_22px_-10px_rgba(79,70,229,0.8)]"
                          : "border-[#6D4AFF]/15 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] text-[#6B6788] dark:text-[#9CA3B5] hover:bg-[#6D4AFF]/[0.07] dark:hover:bg-white/[0.07]"
                      }`}
                    >
                      <span className="font-semibold leading-none" style={{ fontSize: px + 6 }}>Aa</span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>

        {profileError && (
          <div
            role="alert"
            className="lg:col-span-2 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-500"
          >
            <AlertTriangle size={15} />
            {profileError}
          </div>
        )}
      </form>

      {/* Danger zone: a more solid card and a filled button so it reads clearly on any wallpaper */}
      <section className="relative overflow-hidden rounded-2xl border border-rose-500/40 border-l-4 border-l-rose-500 bg-white/80 dark:bg-rose-950/50 backdrop-blur-xl shadow-xl shadow-rose-500/10 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white">
              <AlertTriangle size={18} />
            </span>
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                Danger zone
              </span>
              <h2 className="text-base font-semibold text-[#1E1B3A] dark:text-white">Delete account</h2>
              <p className="text-xs text-[#4A4660] dark:text-white/70 mt-0.5">
                Permanently removes your account and everything saved in your workspace.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDeleteStep(1)}
            className="h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer flex-shrink-0"
          >
            <Trash2 size={14} strokeWidth={2.5} />
            Delete account
          </button>
        </div>
      </section>

      {/* Save bar only shows once something has changed */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-all duration-300 ${
          hasChanges || saved ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 rounded-2xl border border-white/50 dark:border-white/10 bg-white/60 dark:bg-black/50 backdrop-blur-xl px-4 py-3 shadow-2xl">
          {saved && !hasChanges ? (
            <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={16} />
              Settings saved
            </span>
          ) : (
            <span className="text-xs font-mono text-[#6B6788] dark:text-[#9CA3B5]">Unsaved changes</span>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={!hasChanges || isUpdating}
              className="h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#6B6788] dark:text-[#9CA3B5] hover:bg-[#6D4AFF]/[0.08] dark:hover:bg-white/[0.06] transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              Discard
            </button>
            <button
              type="submit"
              form="settings-form"
              disabled={isUpdating || !hasChanges}
              className="h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4338CA] to-[#6D4AFF] dark:from-[#D6249F] dark:to-[#FF6FB5] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_22px_-10px_rgba(79,70,229,0.8)] hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={15} strokeWidth={2.5} />
              {isUpdating ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      {deleteStep > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={() => !isDeleting && setDeleteStep(0)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-[#6D4AFF]/15 dark:border-white/10 bg-white dark:bg-[#1A1D29] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                  <AlertTriangle size={18} />
                </span>
                <h3 className="text-lg font-bold text-[#1E1B3A] dark:text-white">
                  {deleteStep === 1 ? "Delete account?" : "This can't be undone"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDeleteStep(0)}
                disabled={isDeleting}
                aria-label="Close"
                className="p-1.5 rounded-lg text-[#8A86A6] dark:text-[#9CA3B5] hover:bg-[#6D4AFF]/10 dark:hover:bg-white/10 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mt-3 text-sm text-[#5F5B7A] dark:text-[#9CA3B5]">
              {deleteStep === 1
                ? "Your cards, snippets, categories and bookmarks will be removed along with your account."
                : "Everything in your DevDeck workspace will be permanently deleted. There's no way to get it back."}
            </p>
            {deleteError && <p className="mt-3 text-xs text-rose-500 font-medium">{deleteError}</p>}

            <div className="flex justify-end gap-2 pt-6">
              <button
                type="button"
                onClick={() => setDeleteStep(0)}
                disabled={isDeleting}
                className="h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#6B6788] dark:text-[#9CA3B5] hover:bg-[#6D4AFF]/[0.08] dark:hover:bg-white/[0.06] cursor-pointer"
              >
                Cancel
              </button>
              {deleteStep === 1 ? (
                <button
                  type="button"
                  onClick={() => setDeleteStep(2)}
                  className="h-10 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handlePermanentDelete}
                  className="h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete forever"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
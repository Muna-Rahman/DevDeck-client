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

// Keyframes live here so the page stays one file
const MOTION_CSS = `
@keyframes settings-rise { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes settings-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes settings-shine { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
@keyframes settings-twinkle { 0%, 100% { opacity: 0.25; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes settings-spin { to { transform: rotate(360deg); } }
@keyframes settings-pop { 0% { transform: scale(0.6); } 60% { transform: scale(1.25); } 100% { transform: scale(1); } }
@keyframes settings-wiggle { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-14deg); } 75% { transform: rotate(14deg); } }
.settings-rise { animation: settings-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards; }
.settings-float { animation: settings-float 7s ease-in-out infinite; }
.settings-float-slow { animation: settings-float 9s ease-in-out infinite reverse; }
.settings-shine { background-size: 200% auto; animation: settings-shine 6s ease-in-out infinite; }
.settings-twinkle { animation: settings-twinkle 2.4s ease-in-out infinite; }
.settings-spin { animation: settings-spin 14s linear infinite; }
.settings-pop { animation: settings-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
@media (prefers-reduced-motion: reduce) {
  .settings-rise, .settings-float, .settings-float-slow, .settings-shine, .settings-twinkle, .settings-spin, .settings-pop { animation: none; }
}
`;

// Day/night switch: the knob slides, the sun spins and the stars come out at night
function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={onToggle}
      className="group relative h-20 w-full overflow-hidden rounded-full border border-[#6D4AFF]/20 dark:border-[#8B7CFF]/30 shadow-inner cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6D4AFF] dark:focus-visible:ring-[#FF6FB5]"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-[#F6F1FF] via-[#E9DEFF] to-[#FFD6EC]" />
      <span
        className={`absolute inset-0 bg-gradient-to-r from-[#07061A] via-[#161238] to-[#4C2A9A] transition-opacity duration-500 ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="settings-twinkle absolute right-28 top-4 h-1 w-1 rounded-full bg-white" />
        <span className="settings-twinkle absolute right-10 top-6 h-1.5 w-1.5 rounded-full bg-[#FFD6EC] [animation-delay:0.6s]" />
        <span className="settings-twinkle absolute bottom-5 right-20 h-1 w-1 rounded-full bg-[#FFD6EC] [animation-delay:1.2s]" />
        <span className="settings-twinkle absolute bottom-4 right-8 h-1 w-1 rounded-full bg-[#FFD6EC] [animation-delay:1.8s]" />
      </span>

      <span
        className={`absolute left-6 top-1/2 -translate-y-1/2 text-xs font-extrabold uppercase tracking-wider text-[#2E2470] transition-all duration-500 ${
          isDark ? "-translate-x-4 opacity-0" : "opacity-100"
        }`}
      >
        Light mode
      </span>
      <span
        className={`absolute right-6 top-1/2 -translate-y-1/2 text-xs font-extrabold uppercase tracking-wider text-white transition-all duration-500 ${
          isDark ? "opacity-100" : "translate-x-4 opacity-0"
        }`}
      >
        Night mode
      </span>

      <span
        className={`absolute top-2 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#4338CA] shadow-lg shadow-[#6D4AFF]/30 transition-[left] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-active:scale-95 ${
          isDark ? "left-2" : "left-[calc(100%-4.5rem)]"
        }`}
      >
        <span className="relative flex h-8 w-8 items-center justify-center">
          <span
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
            }`}
          >
            <Sun size={30} strokeWidth={1.5} className="settings-spin" />
          </span>
          <span
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
            }`}
          >
            <Moon size={28} strokeWidth={1.5} />
          </span>
        </span>
        <Sparkles size={12} className="settings-twinkle absolute right-2.5 top-2.5 text-[#D6249F]" />
      </span>
    </button>
  );
}

// Soft color glow in each card's corner
const GLOWS = {
  pink: "bg-[#E94FD1]/30",
  teal: "bg-[#3FE0C5]/25",
  violet: "bg-[#8B7CFF]/30",
};

function Section({ icon: Icon, tag, title, description, accent = "pink", className = "", delay = 0, children }) {
  return (
    <section
      className={`${cardStyle} settings-rise flex flex-col p-5 sm:p-6 hover:-translate-y-1 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl ${GLOWS[accent]}`}
      />
      <div className="relative flex items-start gap-3 mb-5">
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
      <div className="relative flex flex-1 flex-col">{children}</div>
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

    if (currentPassword || password || confirmPassword) {
      if (!password) {
        setPasswordError("Enter a new password.");
        return;
      }
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
      // Password goes first, so a wrong current password stops the whole save
      if (password && currentPassword) {
        const { error: passErr } = await authClient.changePassword({
          currentPassword,
          newPassword: password,
          revokeOtherSessions: true,
        });
        if (passErr) {
          console.error("Change password error:", passErr);
          setPasswordError(passErr.message || "Could not change password.");
          return;
        }
      }

      if (username !== session?.user?.name) {
        const { error: nameErr } = await authClient.updateUser({ name: username });
        if (nameErr) throw new Error(nameErr.message || "Failed to update username");
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

  return (
    <div className="w-full flex flex-col relative z-10 space-y-6 min-w-0 max-w-5xl mx-auto pb-2">
      <style>{MOTION_CSS}</style>
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

      <div className={`${cardStyle} settings-rise p-6 sm:p-8`}>
        {/* Blurry color blobs for the header */}
        <div
          aria-hidden="true"
          className="settings-float pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#E94FD1]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="settings-float-slow pointer-events-none absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-[#3FE0C5]/25 blur-3xl"
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/50 dark:border-white/10 bg-white/50 dark:bg-white/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#6D28D9] dark:text-[#E94FD1]">
              <Sparkles size={12} className="settings-twinkle" />
              Your space
            </span>
            <h1 className="settings-shine mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight uppercase bg-gradient-to-r from-[#4338CA] via-[#D6249F] to-[#FF6FB5] bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="mt-2 text-sm text-[#4A4660] dark:text-white/70">Change what you need, then save.</p>
          </div>

          <div className="flex min-w-0 flex-wrap gap-2 sm:flex-col sm:items-end">
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

      {/* Card grid: three across, then password and danger zone */}
      <form
        id="settings-form"
        onSubmit={handleUpdateProfile}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5"
      >
        <Section
          icon={User}
          tag="Account"
          title="Profile"
          description="Change your username."
          accent="pink"
          className="sm:col-span-2 lg:col-span-2"
          delay={100}
        >
          <div className="flex flex-1 flex-col gap-4">
            <Field label="Username" icon={User}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className={inputStyle}
              />
            </Field>
            <div className="mt-auto">
              <Field label="Email (read-only)" icon={Mail}>
                <input type="email" value={user?.email || ""} disabled className={inputStyle} />
              </Field>
            </div>
          </div>
        </Section>

        <Section
          icon={Palette}
          tag="Appearance"
          title="Theme"
          description="Pick a look."
          accent="violet"
          className="lg:col-span-2"
          delay={200}
        >
          <div className="flex flex-1 items-center">
            <ThemeToggle isDark={theme === "dark"} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
          </div>
        </Section>

        <Section
          icon={Type}
          tag="Appearance"
          title="Text size"
          description="Pick a size."
          accent="teal"
          className="lg:col-span-2"
          delay={300}
        >
          <div className="flex flex-1 flex-col gap-3">
            {FONT_SIZES.map(({ id, label, px }) => {
              const active = selectedFontSize === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedFontSize(id)}
                  aria-pressed={active}
                  className={`flex min-h-[56px] flex-1 items-center justify-between rounded-xl border px-4 transition-all cursor-pointer hover:scale-[1.02] ${
                    active
                      ? "bg-gradient-to-r from-[#4338CA] to-[#6D4AFF] dark:from-[#35338F] dark:to-[#5A4BD1] text-white border-transparent shadow-[0_10px_22px_-10px_rgba(79,70,229,0.8)]"
                      : "border-[#6D4AFF]/15 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] text-[#6B6788] dark:text-[#9CA3B5] hover:bg-[#6D4AFF]/[0.07] dark:hover:bg-white/[0.07]"
                  }`}
                >
                  <span className={`font-semibold leading-none ${active ? "settings-pop" : ""}`} style={{ fontSize: px + 6 }}>Aa</span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{label}</span>
                </button>
              );
            })}
          </div>
        </Section>

        <Section
          icon={ShieldCheck}
          tag="Security"
          title="Password"
          description="Leave blank to keep the old one."
          accent="teal"
          className="sm:col-span-2 lg:col-span-4"
          delay={400}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Current password" icon={Key}>
                <PasswordInput
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  autoComplete="current-password"
                />
              </Field>
            </div>
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
              <p className="text-xs text-rose-500 font-medium sm:col-span-2" role="alert">{passwordError}</p>
            )}
          </div>
        </Section>

        {/* Danger zone: solid card and filled button so it stays readable on the wallpaper */}
        <section style={{ animationDelay: "500ms" }} className="settings-rise group relative flex flex-col overflow-hidden rounded-2xl border border-rose-500/40 border-l-4 border-l-rose-500 bg-white/80 dark:bg-rose-950/50 backdrop-blur-xl shadow-xl shadow-rose-500/10 p-5 sm:p-6 sm:col-span-2 lg:col-span-2">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white group-hover:[animation:settings-wiggle_0.5s_ease-in-out]">
              <AlertTriangle size={18} />
            </span>
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                Danger zone
              </span>
              <h2 className="text-base font-semibold text-[#1E1B3A] dark:text-white">Delete account</h2>
              <p className="text-xs text-[#4A4660] dark:text-white/70 mt-0.5">
                Removes your account and all your data.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDeleteStep(1)}
            className="mt-5 h-10 w-full lg:mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Trash2 size={14} strokeWidth={2.5} />
            Delete account
          </button>
        </section>

        {profileError && (
          <div
            role="alert"
            className="col-span-full flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-500"
          >
            <AlertTriangle size={15} />
            {profileError}
          </div>
        )}
      </form>

      {/* Small pill pinned to the right, only rendered once something changed */}
      {(hasChanges || saved) && (
        <div className="settings-rise pointer-events-none sticky bottom-4 z-40 flex justify-end">
          <div className="pointer-events-auto flex w-fit max-w-full items-center gap-4 rounded-full border border-white/50 dark:border-white/10 bg-white/80 dark:bg-black/60 py-1.5 pl-4 pr-1.5 shadow-lg backdrop-blur-md">
            {saved && !hasChanges ? (
              <span className="settings-pop flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={16} />
                Saved
              </span>
            ) : (
              <span className="flex items-center gap-2 text-xs font-mono text-[#6B6788] dark:text-[#9CA3B5]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
                Unsaved changes
              </span>
            )}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleDiscard}
                disabled={!hasChanges || isUpdating}
                className="h-10 rounded-full px-4 text-xs font-bold uppercase tracking-wider text-[#6B6788] dark:text-[#9CA3B5] hover:bg-[#6D4AFF]/[0.08] dark:hover:bg-white/[0.06] transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                Discard
              </button>
              <button
                type="submit"
                form="settings-form"
                disabled={isUpdating || !hasChanges}
                className="h-10 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4338CA] to-[#6D4AFF] dark:from-[#D6249F] dark:to-[#FF6FB5] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_22px_-10px_rgba(79,70,229,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Save size={15} strokeWidth={2.5} />
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

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
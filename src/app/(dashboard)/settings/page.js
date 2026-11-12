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
  X,
} from "lucide-react";

const FONT_SIZES = [
  { id: "small", label: "Small", px: 14 },
  { id: "medium", label: "Medium", px: 16 },
  { id: "large", label: "Large", px: 18 },
];

const cardStyle =
  "relative overflow-hidden rounded-2xl border border-white/40 dark:border-white/10 bg-white/85 dark:bg-black/60 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-white/60 dark:hover:border-white/20";

const inputStyle =
  "w-full h-11 rounded-xl border border-[#6D4AFF]/15 dark:border-white/10 bg-white/70 dark:bg-black/40 pl-10 pr-4 text-sm text-[#1E1B3A] dark:text-[#F5F6FA] outline-none transition-all placeholder:text-[#8A86A6] dark:placeholder:text-white/30 focus:border-[#6D4AFF] dark:focus:border-[#FF6FB5]/60 focus:ring-2 focus:ring-[#6D4AFF]/15 dark:focus:ring-[#FF6FB5]/15 disabled:opacity-60 disabled:cursor-not-allowed";

const labelStyle =
  "block text-[10px] font-mono font-bold uppercase tracking-widest text-[#6B6788] dark:text-[#9CA3B5] mb-1.5";

function Section({ icon: Icon, tag, title, description, children }) {
  return (
    <section className={`${cardStyle} p-6`}>
      <div className="flex items-start gap-3 mb-6">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#D6249F]/10 dark:bg-white/[0.07] text-[#D6249F] dark:text-[#E94FD1]">
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
  const avatarUrl =
    user?.image ||
    `https://api.dicebear.com/7.x/open-peeps/svg?seed=${encodeURIComponent(user?.name || "default")}`;
  const previewPx = FONT_SIZES.find((f) => f.id === selectedFontSize)?.px || 16;

  return (
    <div className="w-full flex flex-col relative z-10 space-y-6 min-w-0 max-w-3xl mx-auto pb-20">
      <button
        type="button"
        onClick={() => router.back()}
        className="self-start inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-white/40 dark:border-white/10 bg-white/85 dark:bg-black/60 backdrop-blur-2xl text-[#5B5F72] dark:text-[#9CA3B5] hover:text-[#1A1D29] dark:hover:text-white hover:border-white/60 dark:hover:border-white/20 shadow-lg transition-all active:scale-95 cursor-pointer"
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Back
      </button>

      <div className={`${cardStyle} p-6 flex items-center gap-5`}>
        <img
          src={avatarUrl}
          alt={user?.name ? `${user.name}'s avatar` : "Your avatar"}
          className="h-16 w-16 rounded-2xl border-2 border-[#E94FD1] bg-white dark:bg-[#1A1D29] object-cover shadow-[0_0_20px_rgba(233,79,209,0.3)] shrink-0"
        />
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight uppercase text-[#1A1D29] dark:text-white dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            Settings
          </h1>
          <p className="text-xs font-semibold tracking-wide text-[#5B5F72] dark:text-white/70 uppercase mt-2 flex items-center gap-2 min-w-0">
            <span className="h-1.5 w-1.5 rounded-full animate-ping flex-shrink-0 bg-[#0FB8A6] dark:bg-[#3FE0C5]" />
            <span className="truncate font-mono normal-case">{user?.name || "Developer"} · {user?.email}</span>
          </p>
        </div>
      </div>

    <form id="settings-form" onSubmit={handleUpdateProfile} className="space-y-6">
      <Section
        icon={User}
        tag="Account"
        title="Profile"
        description="How you appear across your workspace."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
          {passwordError && (
            <p className="text-xs text-rose-500 font-medium" role="alert">{passwordError}</p>
          )}
        </div>
      </Section>

      <Section
        icon={Palette}
        tag="Appearance"
        title="Theme & text size"
        description="Theme applies instantly. Text size is saved with your account."
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

            <div className="mt-4 rounded-xl border border-[#6D4AFF]/15 dark:border-white/[0.08] bg-white/70 dark:bg-[#12141C]/90 p-4">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#0B7F6E] dark:text-[#9CA3B5]/60 mb-2">
                Snippet · Preview
              </span>
              <p
                className="font-semibold tracking-tight text-[#1E1B3A] dark:text-white"
                style={{ fontSize: previewPx }}
              >
                useDebounce hook
              </p>
              <p className="mt-1 text-[#5F5B7A] dark:text-[#9CA3B5]" style={{ fontSize: previewPx - 2 }}>
                Delays a fast-changing value so search only fires once you stop typing.
              </p>
              <code
                className="mt-3 block rounded-lg bg-[#6D4AFF]/[0.06] dark:bg-black/40 px-3 py-2 font-mono text-[#6D28D9] dark:text-[#3FE0C5]"
                style={{ fontSize: previewPx - 3 }}
              >
                const q = useDebounce(query, 300);
              </code>
            </div>
          </div>
        </div>
      </Section>

      {profileError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-500"
        >
          <AlertTriangle size={15} />
          {profileError}
        </div>
      )}
    </form>

    <section className="relative overflow-hidden rounded-2xl border border-rose-500/30 dark:border-rose-500/30 bg-rose-500/[0.06] dark:bg-rose-950/20 backdrop-blur-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle size={18} />
          </span>
          <div>
            <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-rose-500/80">
              Danger zone
            </span>
            <h2 className="text-base font-semibold text-[#1E1B3A] dark:text-white">Delete account</h2>
            <p className="text-xs text-[#5F5B7A] dark:text-[#9CA3B5] mt-0.5">
              Permanently removes your account and everything saved in your workspace.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDeleteStep(1)}
          className="h-10 inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white px-4 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer flex-shrink-0"
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
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 rounded-2xl border border-white/40 dark:border-white/10 bg-white/90 dark:bg-black/70 backdrop-blur-2xl px-4 py-3 shadow-2xl">
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
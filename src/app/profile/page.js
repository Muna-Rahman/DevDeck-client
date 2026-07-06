"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [mounted, setMounted] = useState(false);

  // Safely extract session state variables
  const sessionResult = authClient?.useSession ? authClient.useSession() : { data: null, isPending: true };
  const { data: session, isPending } = sessionResult;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync session configurations post-hydration
  useEffect(() => {
    if (mounted && !isPending && !session) {
      router.push("/login");
    } else if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      
      // Parse the seed out of the custom avatar string
      const match = session.user.image?.match(/seed=([^&]+)/);
      setAvatarSeed(match ? decodeURIComponent(match[1]) : session.user.name || "default");
    }
  }, [session, isPending, router, mounted]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const dynamicAvatarUrl = `https://api.dicebear.com/7.x/open-peeps/svg?seed=${encodeURIComponent(avatarSeed)}`;

      // Execute update request to backend database
      const { error } = await authClient.updateUser({
        name: name,
        image: dynamicAvatarUrl,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Profile updated! Redirecting to dashboard..." });
        
        // Automatically route back to the dashboard panel after a brief 1-second delay
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      setMessage({ type: "error", text: "An anomaly occurred during profile migration." });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || isPending || !session) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0B0E14] text-[#F5F6FA] font-mono text-xs">
        RETRIEVING ENCRYPTED SESSION VARIABLES...
      </div>
    );
  }

  const previewAvatarUrl = `https://api.dicebear.com/7.x/open-peeps/svg?seed=${encodeURIComponent(avatarSeed || 'default')}`;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 relative bg-[#0B0E14]">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#1A1D29]/65 backdrop-blur-glass p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] z-10">
        
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#F5F6FA]">
            Profile Settings
          </h2>
          <p className="text-xs font-medium uppercase tracking-widest text-[#9CA3B5] mt-1">
            Modify environment operational parameters
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {message.text && (
            <div className={`rounded-xl border p-3 text-center text-xs font-semibold uppercase tracking-wider shadow-sm ${
              message.type === "success" 
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" 
                : "border-red-500/30 bg-red-500/10 text-red-500"
            }`}>
              {message.text}
            </div>
          )}

          {/* Profile Picture & Live Seed Interaction Panel */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-white/5 bg-[#0B0E14]/40">
            <div className="relative group">
              <img
                src={previewAvatarUrl}
                alt="Avatar Live Frame"
                className="h-20 w-20 rounded-full border-2 border-[#E94FD1] object-cover bg-[#1A1D29]"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-[9px] font-bold tracking-widest text-white uppercase pointer-events-none">
                Live View
              </div>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9CA3B5] mb-1.5">
                Avatar Generation Seed (Change text to change image style)
              </label>
              <input
                type="text"
                required
                value={avatarSeed}
                onChange={(e) => setAvatarSeed(e.target.value)}
                placeholder="Type anything to morph..."
                className="w-full h-10 rounded-xl border border-white/5 bg-[#0B0E14]/60 px-4 text-xs font-medium tracking-wide text-[#F5F6FA] outline-none transition-all focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
              />
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Account Form Input Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9CA3B5] mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 rounded-xl border border-white/5 bg-[#0B0E14]/60 px-4 text-xs font-medium tracking-wide text-[#F5F6FA] outline-none transition-all focus:border-[#FF6FB5]/50 focus:ring-2 focus:ring-[#FF6FB5]/10"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9CA3B5] mb-1.5">
                System Registration Email (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full h-10 rounded-xl border border-white/5 bg-white/5 px-4 text-xs font-medium tracking-wide text-[#5B5F72] cursor-not-allowed outline-none"
              />
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto h-11 px-8 rounded-xl bg-gradient-to-r from-[#D6249F] to-[#FF6FB5] text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(233,79,209,0.25)] hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Deploying Updates..." : "Save Parameter Settings"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
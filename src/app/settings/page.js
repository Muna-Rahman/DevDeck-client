"use client";

import React, { useState } from "react";
// Using explicit icons found directly in your version to make Turbopack happy
import { 
  LayoutList, // Swapped from LayoutGrid to LayoutList to fix the build error instantly
  Globe, 
  Person, 
  ShieldCheck, 
  CircleExclamation, 
  ChevronRight,
  FloppyDisk,
  Pulse 
} from "@gravity-ui/icons";

export default function SettingsPage() {
  // Keeps track of which settings menu panel group is currently open on screen
  const [activeSection, setActiveSection] = useState("density");
  // Holds a brief confirmation status string to trigger our top pop-up notification banner
  const [saveStatus, setSaveStatus] = useState("");

  // 35 different language options for complete localization coverage
  const globalLanguages = [
    { code: "en-US", name: "English (US) — Standard Dev Shell" },
    { code: "bn-BD", name: "Bengali (BD) — Localized Workspace Matrix" },
    { code: "es-ES", name: "Español (ES) — Castellano Shell" },
    { code: "fr-FR", name: "Français (FR) — Module Européen" },
    { code: "de-DE", name: "Deutsch (DE) — Standard Terminal" },
    { code: "ja-JP", name: "日本語 (JP) — インタフェース" },
    { code: "zh-CN", name: "简体中文 (CN) — 简体开发环境" },
    { code: "hi-IN", name: "हिन्दी (IN) — भारतीय भाषा" },
    { code: "ar-SA", name: "العربية (SA) — حزمة اللغة العربية" },
    { code: "pt-BR", name: "Português (BR) — Shell Dev" },
    { code: "ru-RU", name: "Русский (RU) — Локальный терминал" },
    { code: "it-IT", name: "Italiano (IT) — Ambiente di sviluppo" },
    { code: "ko-KR", name: "한국어 (KR) — Korean Shell" },
    { code: "vi-VN", name: "Tiếng Việt (VN) — Hệ thống ngôn ngữ" },
    { code: "tr-TR", name: "Türkçe (TR) — Geliştirici Kabuğu" },
    { code: "pl-PL", name: "Polski (PL) — Środowisko programisty" },
    { code: "nl-NL", name: "Nederlands (NL) — Dev Console" },
    { code: "uk-UA", name: "Українська (UA) — Мовний module" },
    { code: "th-TH", name: "ไทย (TH) — ระบบภาษาไทย" },
    { code: "id-ID", name: "Bahasa Indonesia (ID) — Modul Workspace" },
    { code: "ms-MY", name: "Bahasa Melayu (MY) — Kerangka Kerja" },
    { code: "fa-IR", name: "فارسی (IR) — پوسته توسعه" },
    { code: "he-IL", name: "עברית (IL) — סביבת פิตוח" },
    { code: "sv-SE", name: "Svenska (SE) — Utvecklingsmiljö" },
    { code: "no-NO", name: "Norsk (NO) — Terminal Oppsett" },
    { code: "fi-FI", name: "Suomi (FI) — Kehitysympäristö" },
    { code: "da-DK", name: "Dansk (DK) — Dev System" },
    { code: "cs-CZ", name: "Čeština (CZ) — Vývojové prostředí" },
    { code: "el-GR", name: "Ελληνικά (GR) — Κέλυφος Ανάπτυξης" },
    { code: "hu-HU", name: "Magyar (HU) — Fejlesztői Környezet" },
    { code: "ro-RO", name: "Română (RO) — Modul Workspace" },
    { code: "sk-SK", name: "Slovenčina (SK) — Vývojový Terminal" },
    { code: "bg-BG", name: "Български (BG) — Локална Система" },
    { code: "hr-HR", name: "Hrvatski (HR) — Razvojno Okruženje" },
    { code: "sr-RS", name: "Srpski (RS) — Terminal Matrix" }
  ];

  // React state tracking the values of all settings options across inputs
  const [settingsData, setSettingsData] = useState({
    densityMode: "comfortable",
    energyRings: true,
    language: "en-US",
    humanizedClasses: true,
    fullName: "Mahbuba Rahman Chowdhury",
    email: "muna@metrouni.edu",
    syncInterval: "30",
    autoBackup: true
  });

  // Flips basic true/false checkbox toggles on or off
  const handleToggle = (field) => {
    setSettingsData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Adjusts state strings when dropdown options change or when fields are typed in
  const handleInputChange = (field, value) => {
    setSettingsData(prev => ({ ...prev, [field]: value }));
  };

  // Emulates saving field variables down to your remote database
  const triggerSavePipeline = () => {
    setSaveStatus("synced");
    setTimeout(() => setSaveStatus(""), 3000);
    console.log("💾 Framework Sync: New settings variables stored successfully.", settingsData);
  };

  // Shared reusable design tokens for our custom transparent inputs and menus
  const inputClass = "w-full bg-[#1A1D29]/40 backdrop-blur-md text-[#F5F6FA] placeholder:#9CA3B5/30 border border-white/8 hover:border-white/20 focus:border-[#E94FD1]/80 focus:outline-none rounded-xl h-11 px-4 transition-all duration-300";
  const labelClass = "text-[#9CA3B5] font-medium mb-1.5 block text-sm";
  const navItemClass = (id) => `w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${activeSection === id ? "bg-gradient-to-r from-[#E94FD1]/10 to-[#FF6FB5]/5 border-[#E94FD1]/30 text-white shadow-[0_0_15px_rgba(233,79,209,0.05)]" : "border-transparent text-[#9CA3B5] hover:text-[#F5F6FA] hover:bg-white/5"}`;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F5F6FA] p-4 sm:p-8 flex flex-col gap-8">
      
      {/* Floating success banner box that alerts you when data is saved */}
      {saveStatus === "synced" && (
        <div className="fixed top-6 right-6 z-[9999] bg-[#12141C]/90 border border-[#3FE0C5]/40 text-[#F5F6FA] px-4 py-3 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(63,224,197,0.15)] flex items-center gap-3 animate-fadeIn">
          <div className="w-2 h-2 rounded-full bg-[#3FE0C5] animate-pulse" />
          <span className="text-xs font-medium tracking-wide">Workspace parameters synchronized successfully.</span>
        </div>
      )}

      {/* Main Control Row Header Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/6 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-wide">Workspace Settings</h1>
          <p className="text-sm text-[#9CA3B5] mt-1">Calibrate global deck spacing, sync pipelines, localization parameters, and core account paths.</p>
        </div>
        <button
          onClick={triggerSavePipeline}
          className="bg-gradient-to-r from-[#E94FD1] to-[#FF6FB5] text-white font-medium text-sm rounded-full px-6 py-2.5 shadow-[0_4px_20px_rgba(233,79,209,0.3)] hover:shadow-[0_4px_25px_rgba(233,79,209,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 border-0 outline-none cursor-pointer"
        >
          <FloppyDisk className="w-4 h-4" />
          <span>Save Framework Changes</span>
        </button>
      </div>

      {/* Side-by-Side Dual Column Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 items-start">
        
        {/* Left Side Tab Navigation Panel */}
        <div className="lg:col-span-1 bg-[#12141C]/60 backdrop-blur-xl border border-white/8 rounded-2xl p-3 flex flex-col gap-1.5 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
          <button onClick={() => setActiveSection("density")} className={navItemClass("density")}>
            <div className="flex items-center gap-3"><LayoutList className="w-[18px] h-[18px] text-[#3FE0C5]" /><span>Layout Density</span></div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
          <button onClick={() => setActiveSection("language")} className={navItemClass("language")}>
            <div className="flex items-center gap-3"><Globe className="w-[18px] h-[18px] text-[#8B5CF6]" /><span>Localization</span></div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
          <button onClick={() => setActiveSection("sync")} className={navItemClass("sync")}>
            <div className="flex items-center gap-3"><Pulse className="w-[18px] h-[18px] text-[#E94FD1]" /><span>Live Sync Stream</span></div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
          <button onClick={() => setActiveSection("account")} className={navItemClass("account")}>
            <div className="flex items-center gap-3"><Person className="w-[18px] h-[18px] text-[#FFB84D]" /><span>Profile Metadata</span></div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
          <button onClick={() => setActiveSection("security")} className={navItemClass("security")}>
            <div className="flex items-center gap-3"><ShieldCheck className="w-[18px] h-[18px] text-[#3FE0C5]" /><span>Security Gateway</span></div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
          <div className="h-px bg-white/6 my-2" />
          <button onClick={() => setActiveSection("danger")} className={navItemClass("danger")}>
            <div className="flex items-center gap-3"><CircleExclamation className="w-[18px] h-[18px] text-rose-500" /><span>Danger Zone</span></div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
        </div>

        {/* Right Side Active Panel Render Form Window */}
        <div className="lg:col-span-3 bg-[#12141C]/40 backdrop-blur-xl border border-white/8 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.15)] flex flex-col gap-6">
          
          {/* TRAY PANEL 1: CARD COMPONENT PADDING AND SIZE DENSITY SCALING */}
          {activeSection === "density" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-medium text-white tracking-wide">Workspace Density Scaling</h3>
                <p className="text-xs text-[#9CA3B5] mt-0.5">Scale down paddings, component margins, and grid tracks to lock your ideal information payload density view.</p>
              </div>
              <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />
              
              <div className="flex flex-col gap-4">
                <label className={labelClass}>Card Arrangement & Spacing Density</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    onClick={() => handleInputChange("densityMode", "comfortable")}
                    className={`border rounded-xl p-4 flex flex-col gap-1 cursor-pointer transition-all duration-300 bg-[#1A1D29]/40 backdrop-blur-md ${settingsData.densityMode === "comfortable" ? "border-[#E94FD1] shadow-[0_0_15px_rgba(233,79,209,0.1)] bg-[#1A1D29]/70" : "border-white/6 hover:border-white/20"}`}
                  >
                    <span className="text-sm font-medium text-white">Comfortable 🌱</span>
                    <span className="text-[11px] text-[#9CA3B5]">Generous grid layouts, clear margins, and deep fluid glass blurs.</span>
                  </div>
                  <div 
                    onClick={() => handleInputChange("densityMode", "compact")}
                    className={`border rounded-xl p-4 flex flex-col gap-1 cursor-pointer transition-all duration-300 bg-[#1A1D29]/40 backdrop-blur-md ${settingsData.densityMode === "compact" ? "border-[#E94FD1] shadow-[0_0_15px_rgba(233,79,209,0.1)] bg-[#1A1D29]/70" : "border-white/6 hover:border-white/20"}`}
                  >
                    <span className="text-sm font-medium text-white">Compact 🪵</span>
                    <span className="text-[11px] text-[#9CA3B5]">Decreased component padding to trace multiple card metrics in view.</span>
                  </div>
                  <div 
                    onClick={() => handleInputChange("densityMode", "minimal")}
                    className={`border rounded-xl p-4 flex flex-col gap-1 cursor-pointer transition-all duration-300 bg-[#1A1D29]/40 backdrop-blur-md ${settingsData.densityMode === "minimal" ? "border-[#E94FD1] shadow-[0_0_15px_rgba(233,79,209,0.1)] bg-[#1A1D29]/70" : "border-white/6 hover:border-white/20"}`}
                  >
                    <span className="text-sm font-medium text-white">Ultra Minimal ⚡</span>
                    <span className="text-[11px] text-[#9CA3B5]">Strict thin-line setups focus purely on code strings and favicons.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#1A1D29]/30 border border-white/6 rounded-xl p-4">
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <span className="text-sm font-medium text-white">Render Ambient Fluid Glow Rings</span>
                  <span className="text-xs text-[#9CA3B5]">Keeps active background gradient lighting blobs visible behind floating card clusters.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={settingsData.energyRings} 
                  onChange={() => handleToggle("energyRings")}
                  className="w-10 h-5 rounded-full bg-white/10 checked:bg-[#E94FD1] appearance-none cursor-pointer relative before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-all duration-300"
                />
              </div>
            </div>
          )}

          {/* TRAY PANEL 2: GLOBAL FRAMEWORK SYSTEM TRANSLATIONS OVERVIEW */}
          {activeSection === "language" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-medium text-white tracking-wide">System Localization</h3>
                <p className="text-xs text-[#9CA3B5] mt-0.5">Adjust structural string variables for system menus and console feedback cards.</p>
              </div>
              <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

              <div>
                <label className={labelClass}>Primary Framework Language Target</label>
                <select
                  value={settingsData.language}
                  onChange={(e) => handleInputChange("language", e.target.value)}
                  className="w-full bg-[#1A1D29]/60 text-[#F5F6FA] border border-white/8 hover:border-white/20 focus:border-[#E94FD1]/80 focus:outline-none rounded-xl h-11 px-3 backdrop-blur-md transition-all duration-300"
                >
                  {globalLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#12141C] text-[#F5F6FA]">
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between bg-[#1A1D29]/30 border border-white/6 rounded-xl p-4">
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <span className="text-sm font-medium text-white">Humanized Component Class Conventions</span>
                  <span className="text-xs text-[#9CA3B5]">Forces component generators to drop generic styles in favor of contextual selectors like <code className="text-[#3FE0C5] bg-black/20 px-1 py-0.5 rounded text-[11px]">.brain-flex</code> or <code className="text-[#3FE0C5] bg-black/20 px-1 py-0.5 rounded text-[11px]">.note-card</code>.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={settingsData.humanizedClasses} 
                  onChange={() => handleToggle("humanizedClasses")}
                  className="w-10 h-5 rounded-full bg-white/10 checked:bg-[#E94FD1] appearance-none cursor-pointer relative before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-all duration-300"
                />
              </div>
            </div>
          )}

          {/* TRAY PANEL 3: ASYNC DB DATA POOLING SPEED SETUPS */}
          {activeSection === "sync" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-medium text-white tracking-wide">Live Database Synchronization Stream</h3>
                <p className="text-xs text-[#9CA3B5] mt-0.5">Control pipeline fetch speeds to synchronize local changes instantly with your remote MongoDB clusters.</p>
              </div>
              <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

              <div>
                <label className={labelClass}>Background Collection Refresh Speed Interval</label>
                <select
                  value={settingsData.syncInterval}
                  onChange={(e) => handleInputChange("syncInterval", e.target.value)}
                  className="w-full bg-[#1A1D29]/60 text-[#F5F6FA] border border-white/8 hover:border-white/20 focus:border-[#E94FD1]/80 focus:outline-none rounded-xl h-11 px-3 backdrop-blur-md transition-all duration-300"
                >
                  <option value="10" className="bg-[#12141C]">High Performance Pooling — Sync every 10s</option>
                  <option value="30" className="bg-[#12141C]">Balanced Payload Mode — Sync every 30s</option>
                  <option value="60" className="bg-[#12141C]">Low Energy Workspace Track — Sync every 60s</option>
                  <option value="manual" className="bg-[#12141C]">Manual Sync Only — On Save Trigger Button</option>
                </select>
              </div>

              <div className="flex items-center justify-between bg-[#1A1D29]/30 border border-white/6 rounded-xl p-4">
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <span className="text-sm font-medium text-white">Automated Layout Backup Snapshots</span>
                  <span className="text-xs text-[#9CA3B5]">Periodically bundles card columns configurations to local browser persistent stores as fallback protection layers.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={settingsData.autoBackup} 
                  onChange={() => handleToggle("autoBackup")}
                  className="w-10 h-5 rounded-full bg-white/10 checked:bg-[#E94FD1] appearance-none cursor-pointer relative before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-all duration-300"
                />
              </div>
            </div>
          )}

          {/* TRAY PANEL 4: ACCOUNT METADATA AND IDENTIFIER DETAILS */}
          {activeSection === "account" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-medium text-white tracking-wide">Workspace Profile Metadata</h3>
                <p className="text-xs text-[#9CA3B5] mt-0.5">Configure target user tags that attach when generating new system cards or managing public repo connections.</p>
              </div>
              <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

              <div>
                <label className={labelClass}>Profile Author Moniker Name</label>
                <input 
                  type="text" 
                  value={settingsData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Active Dev Commits Email Target</label>
                <input 
                  type="email" 
                  value={settingsData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* TRAY PANEL 5: ACCESS PASSWORD RE-VECTOR GATEWAY */}
          {activeSection === "security" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-medium text-white tracking-wide">Security & Keys Gateway</h3>
                <p className="text-xs text-[#9CA3B5] mt-0.5">Rotate operational access passwords, verify environment arrays, and flush active tokens.</p>
              </div>
              <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#1A1D29]/30 border border-white/6 rounded-xl p-4 gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-white">Password Authentication Shell</span>
                  <span className="text-xs text-[#9CA3B5]">Rotate the alphanumeric encryption entry credentials securing this dashboard.</span>
                </div>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs rounded-xl px-4 py-2 transition-all cursor-pointer">
                  Rotate Access Password
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#1A1D29]/30 border border-white/6 rounded-xl p-4 gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-white">Better Auth Remote Tokens Track</span>
                  <span className="text-xs text-[#9CA3B5]">Instantly invalidates all remote storage cookies and cross-device persistent open logs safely.</span>
                </div>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs rounded-xl px-4 py-2 transition-all cursor-pointer">
                  Flush Remote Session Traces
                </button>
              </div>
            </div>
          )}

          {/* TRAY PANEL 6: DESTRUCTIVE CLEANUP SYSTEM HOOKS */}
          {activeSection === "danger" && (
            <div className="flex flex-col gap-6 animate-fadeIn border border-rose-500/20 rounded-2xl p-4 bg-rose-500/[0.02]">
              <div>
                <h3 className="text-lg font-medium text-rose-400 tracking-wide">The Danger Zone</h3>
                <p className="text-xs text-[#9CA3B5] mt-0.5">Destructive cleanup scripts. Exercise absolute caution before executing.</p>
              </div>
              <div className="h-px bg-gradient-to-r from-rose-500/30 to-transparent" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#1A1D29]/20 border border-white/6 rounded-xl p-4 gap-4">
                <div className="flex flex-col gap-0.5 max-w-[70%]">
                  <span className="text-sm font-medium text-white">Wipe Local Layout Frame Cache</span>
                  <span className="text-xs text-[#9CA3B5]">Flushes persistent client component arrays and initiates a force-fetch sync directly down from MongoDB cloud schemas.</span>
                </div>
                <button className="bg-transparent hover:bg-amber-500/10 border border-[#FFB84D]/30 text-[#FFB84D] font-medium text-xs rounded-xl px-4 py-2 transition-all cursor-pointer">
                  Purge Local Workspace Cache
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#1A1D29]/20 border border-white/6 rounded-xl p-4 gap-4">
                <div className="flex flex-col gap-0.5 max-w-[70%]">
                  <span className="text-sm font-medium text-rose-400">De-provision Profile Ecosystem</span>
                  <span className="text-xs text-[#9CA3B5]">Dismantles your total registered dashboard data permanently, dropping all collection metrics, linked repo indices, and keys. This operation cannot be rolled back.</span>
                </div>
                <button className="bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-400 font-medium text-xs rounded-xl px-4 py-2 transition-all cursor-pointer">
                  Terminate Account Lifecycle
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
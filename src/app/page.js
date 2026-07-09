"use client";
import Navbar from "@/components/Navbar";

export default function DashboardHome() {
  return (
    <>
      <Navbar />
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        
        {/* Metric Card 1 */}
        <div className="theme-card p-6 flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Active Tasks</h3>
              <span className="font-accent-serif text-sm opacity-80 text-[var(--accent-purple)]">Dev Suite</span>
            </div>
            <p className="text-4xl font-extrabold mt-4 dark:gradient-text-dark light:gradient-text-light inline-block">
              14 / 24
            </p>
          </div>
          <div className="mt-4 w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full w-[62%]" />
          </div>
        </div>

        {/* Metric Card 2 (SVG Chart Representation) */}
        <div className="theme-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">System Throughput</h3>
            <div className="w-full h-24 mt-4 flex items-end justify-between gap-1">
              {[40, 75, 55, 90, 60, 85, 95].map((val, i) => (
                <div 
                  key={i} 
                  style={{ height: `${val}%` }} 
                  className="w-full rounded-t-sm transition-all duration-500 bg-gradient-to-t from-purple-500 via-blue-400 to-orange-400 glow-stroke"
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">Update frequency: Real-time live deck stream</p>
        </div>

        {/* Accent Editorial Block */}
        <div className="theme-card p-6 flex flex-col justify-between border-dashed">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Workspace Philosophy</h3>
            <p className="font-accent-serif text-lg mt-4 text-[var(--text-primary)] leading-relaxed">
              "Design scales best when complexity is hidden beneath deliberate visual poetry."
            </p>
          </div>
          <span className="text-xs font-mono tracking-tighter text-[var(--text-secondary)] opacity-60">SYSTEM STATUS: OPTIMAL</span>
        </div>
        
      </main>
    </>
  );
}
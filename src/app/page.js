
"use client";

export default function HomePage() {
  /**
   * 1. MATRIX INVENTORY CONFIGURATION (Tactical Resource Slots)
   * Colors and glass filters adjust dynamically based on the active environmental theme pass.
   */
  const metricCards = [
    { 
      label: "Total Cards", 
      count: 12, 
      border: "border-[#FF6FB5]/20 dark:border-[#E94FD1]/25", 
      text: "text-[#D6249F] dark:text-[#FF6FB5]",
      glow: "shadow-[0_4px_20px_rgba(233,79,209,0.06)] dark:shadow-[0_0_25px_rgba(233,79,209,0.2)]",
      // Light Mode: white frosted glass with ultra soft stroke | Dark Mode: deep navy glass with neon stroke
      ring: "bg-white/70 dark:bg-[#1A1D29]/70 ring-1 ring-black/[0.04] dark:ring-[#FF6FB5]/20",
      dot: "bg-[#E94FD1] shadow-[0_0_8px_#E94FD1]"
    },
    { 
      label: "Repositories", 
      count: 2, 
      border: "border-[#159FE0]/20 dark:border-[#3FE0C5]/25", 
      text: "text-[#0FB8A6] dark:text-[#3FE0C5]",
      glow: "shadow-[0_4px_20px_rgba(63,224,197,0.04)] dark:shadow-[0_0_25px_rgba(63,224,197,0.2)]",
      ring: "bg-white/70 dark:bg-[#1A1D29]/70 ring-1 ring-black/[0.04] dark:ring-[#3FE0C5]/20",
      dot: "bg-[#3FE0C5] shadow-[0_0_8px_#3FE0C5]"
    },
    { 
      label: "Snippets", 
      count: 2, 
      border: "border-[#9B6BF0]/20 dark:border-[#8B5CF6]/25", 
      text: "text-[#7C3AED] dark:text-[#B084F5]",
      glow: "shadow-[0_4px_20px_rgba(139,92,246,0.04)] dark:shadow-[0_0_25px_rgba(139,92,246,0.2)]",
      ring: "bg-white/70 dark:bg-[#1A1D29]/70 ring-1 ring-black/[0.04] dark:ring-[#8B5CF6]/20",
      dot: "bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]"
    },
    { 
      label: "Ideas", 
      count: 2, 
      border: "border-[#E8940F]/20 dark:border-[#FFB84D]/30", 
      text: "text-[#E8940F] dark:text-gradient-warning",
      glow: "shadow-[0_4px_20px_rgba(255,184,77,0.05)] dark:shadow-[0_0_30px_rgba(255,184,77,0.25)]",
      ring: "bg-white/70 dark:bg-[#1A1D29]/70 ring-1 ring-black/[0.04] dark:ring-[#FFB84D]/20",
      dot: "bg-[#FF7A3D] shadow-[0_0_8px_#FF7A3D]"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] relative flex flex-col justify-start">
      
      {/* 2. DUAL-THEME DYNAMIC BACKGROUND INTERFACE */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* A. LIGHT MODE ENVIRONMENT CANVAS (Sunlit Bright Ethereal Fantasy Landscape) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat block dark:hidden transition-opacity duration-300"
          style={{
            backgroundImage: `url('https://i.pinimg.com/1200x/58/c9/0f/58c90fc7915681c2894fb639a19ec5e3.jpg')`
          }}
        >
          {/* Subtle white wash to lower saturation and match light frosted card readability */}
          <div className="absolute inset-0  backdrop-brightness-[0.80]" />
        </div>

        {/* B. DARK MODE ENVIRONMENT CANVAS (Mystical Strategy Kingdom Night) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden dark:block transition-opacity duration-300"
          style={{
            backgroundImage: `url('https://i.pinimg.com/736x/67/e9/60/67e960e46c4010b585d4eac3f4382654.jpg')`
          }}
        >
          {/* Dark control mask providing the near-black game overlay deep navy space */}
          <div className="absolute inset-0 bg-[#0B0E14]/10 backdrop-brightness-[0.55]" />
        </div>

      </div>

      {/* 3. CORE STRATEGY INTERFACE WORKSPACE LAYER */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 flex-1">
        
        {/* Welcome Character Banner Title Block */}
        <div className="mb-8 rounded-2xl p-5 bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/5 max-w-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-none">
          <h1 className="text-2xl font-bold tracking-tight uppercase font-sans text-[#1A1D29] dark:text-[#F5F6FA]">
            Welcome, Developer!!!
          </h1>
          <p className="text-xs font-semibold tracking-wide text-[#5B5F72] dark:text-[#9CA3B5] uppercase mt-1">
            Ecosystem environment operating stable. Ready for deployment deck initialization.
          </p>
        </div>

        {/* Metric Panel Matrix Grid Layout */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {metricCards.map((card, idx) => (
            <div 
              key={idx}
              className={`rounded-2xl border border-black/[0.02] dark:border-white/5 backdrop-blur-glass p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] ${card.border} ${card.glow} ${card.ring}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#5B5F72] dark:text-[#9CA3B5]">
                  {card.label}
                </p>
                <span className={`h-2 w-2 rounded-full ${card.dot}`} />
              </div>
              <p className={`text-4xl font-extrabold mt-3 font-mono tracking-tighter ${card.text}`}>
                {card.count}
              </p>
            </div>
          ))}
        </div>

        {/* Main Draggable Workspace Layout Slot */}
        <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-white/30 dark:bg-[#1A1D29]/20 backdrop-blur-glass p-12 text-center transition-colors">
          <div className="max-w-md mx-auto flex flex-col items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#0FB8A6] dark:bg-[#3FE0C5] animate-pulse mb-3 shadow-[0_0_10px_currentColor]" />
            <p className="text-xs uppercase font-bold tracking-widest text-[#212432] dark:text-[#9CA3B5]">
              Ecosystem workspace active. The canvas is unblocked and running in isolated frontend development mode.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
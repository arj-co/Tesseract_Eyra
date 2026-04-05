import React from 'react';

const ZONE_THEMES = {
  TL: { badge: 'bg-blue-700 text-white', border: 'border-blue-400', ring: 'ring-blue-400/40', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]' },
  TR: { badge: 'bg-violet-700 text-white', border: 'border-violet-400', ring: 'ring-violet-400/40', glow: 'shadow-[0_0_30px_rgba(139,92,246,0.15)]' },
  BL: { badge: 'bg-teal-700 text-white', border: 'border-teal-400', ring: 'ring-teal-400/40', glow: 'shadow-[0_0_30px_rgba(45,212,191,0.15)]' },
  BR: { badge: 'bg-amber-600 text-white', border: 'border-amber-400', ring: 'ring-amber-400/40', glow: 'shadow-[0_0_30px_rgba(251,191,36,0.15)]' },
};

export default function ZoneCard({ label, zone, children }) {
  const theme = ZONE_THEMES[zone] || ZONE_THEMES.TL;

  return (
    <div
      className="relative bg-slate-50/50 rounded-xl p-2 flex flex-col h-full transition-all duration-200 ease-out overflow-hidden border-2 border-slate-200"
    >
      <div className={`absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm z-10 ${theme.badge}`}>
        {label}
      </div>

      <div className="flex-1 mt-6 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
}

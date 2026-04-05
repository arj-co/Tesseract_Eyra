import React from 'react';

const ZONE_THEMES = {
  TL: { badge: 'bg-blue-700 text-white', border: 'border-blue-400', ring: 'ring-blue-400/40', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]' },
  TR: { badge: 'bg-violet-700 text-white', border: 'border-violet-400', ring: 'ring-violet-400/40', glow: 'shadow-[0_0_30px_rgba(139,92,246,0.15)]' },
  BL: { badge: 'bg-teal-700 text-white', border: 'border-teal-400', ring: 'ring-teal-400/40', glow: 'shadow-[0_0_30px_rgba(45,212,191,0.15)]' },
  BR: { badge: 'bg-amber-600 text-white', border: 'border-amber-400', ring: 'ring-amber-400/40', glow: 'shadow-[0_0_30px_rgba(251,191,36,0.15)]' },
};

export default function ZoneCard({ label, zone, isHighlighted, dwellDuration = 600, children }) {
  const theme = ZONE_THEMES[zone] || ZONE_THEMES.TL;

  return (
    <div
      className={`relative bg-white rounded-xl p-5 flex flex-col h-full transition-all duration-200 ease-out overflow-hidden border-2 ${
        isHighlighted
          ? `${theme.border} ring-4 ${theme.ring} ${theme.glow} scale-[1.02] z-10`
          : 'border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_0_1px_rgba(0,0,0,0.1)]'
      }`}
    >
      {/* CSS-animated progress bar — restarts whenever isHighlighted becomes true */}
      {isHighlighted && (
        <div
          className="absolute bottom-0 left-0 h-2 bg-medicalBlue rounded-br-xl rounded-bl-xl"
          style={{
            width: '100%',
            animation: `fillProgress ${dwellDuration}ms linear forwards`,
          }}
        />
      )}

      <div className={`absolute top-4 left-5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${theme.badge}`}>
        {label}
      </div>

      <div className="flex-1 mt-8 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
}

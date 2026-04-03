import React from 'react';

export default function ZoneCard({ label, id, isZoneActive, isOtherZoneActive, isDwelling, dwellProgress, children }) {
  const isDimmed = isOtherZoneActive && !isZoneActive;

  let theme = { bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-700', badgeTheme: 'bg-slate-800 text-white', hoverBorder: 'hover:border-slate-400' };
  if (label === 'A – F') { theme = { bg: 'bg-white', border: 'border-slate-200', text: 'text-blue-900', badgeTheme: 'bg-blue-700 text-white', hoverBorder: 'hover:border-blue-500' }; }
  else if (label === 'G – M') { theme = { bg: 'bg-white', border: 'border-slate-200', text: 'text-violet-900', badgeTheme: 'bg-violet-700 text-white', hoverBorder: 'hover:border-violet-500' }; }
  else if (label === 'N – T') { theme = { bg: 'bg-white', border: 'border-slate-200', text: 'text-teal-900', badgeTheme: 'bg-teal-700 text-white', hoverBorder: 'hover:border-teal-500' }; }
  else if (label === 'U – Z') { theme = { bg: 'bg-white', border: 'border-slate-200', text: 'text-amber-900', badgeTheme: 'bg-amber-600 text-white', hoverBorder: 'hover:border-amber-500' }; }

  return (
    <div 
      data-dwell={isZoneActive ? null : id}
      className={`relative ${theme.bg} rounded-xl p-6 flex flex-col h-full transition-all duration-200 ease-out overflow-hidden ${
        isZoneActive 
          ? 'ring-4 ring-medicalBlue/30 border-2 border-medicalBlue shadow-[0_4px_20px_rgba(15,110,86,0.2)] scale-[1.02] z-10' 
          : isDimmed 
            ? `border border-slate-200 opacity-40 grayscale-[0.5]` 
            : `border shadow-[0_2px_8px_rgba(0,0,0,0.04),0_0_1px_rgba(0,0,0,0.1)] cursor-pointer ${theme.border} ${theme.hoverBorder} hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]`
      } ${isDwelling ? 'ring-2 ring-medicalBlue/50 scale-[1.01]' : ''}`}
    >
      {isDwelling && (
        <div 
          className="absolute bottom-0 left-0 h-1.5 bg-medicalBlue transition-all duration-75 ease-linear"
          style={{ width: `${dwellProgress}%` }}
        ></div>
      )}
      <div className={`absolute top-4 left-5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${theme.badgeTheme}`}>
        {label}
      </div>

      <div className="flex-1 mt-6 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
}
